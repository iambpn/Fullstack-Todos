import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../Models/user';
import { createToken, getRefreshToken } from '../Helpers/tokenHelper';
import { Types } from 'mongoose';
import RefreshToken from '../Models/refreshToken';
import jwtDecode from 'jwt-decode';
import { ID_Wrapper } from '../Models/init';

async function saveRefreshToken(refreshToken: string, userId: Types.ObjectId) {
  try {
    const storedRefreshToken = new RefreshToken({
      token: refreshToken,
      user: userId,
    });
    await storedRefreshToken.save();
  } catch (e) {
    return e;
  }
}

async function authenticate(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  try {
    const username = req.body.username;
    const password = req.body.password;

    // validate user
    let user = await User.findOne({ email: username }).exec();
    if (!user) {
      return res
        .status(404)
        .json({ errors: { type: 'server', msg: 'User not found.' } });
    }

    if (!(await user.verifyPassword(password))) {
      return res.status(403).json({
        errors: {
          type: 'server',
          msg: "Username or Password didn't matched.",
        },
      });
    }

    // generate token and refresh token
    let token = createToken(user.toObject());
    let refreshToken = getRefreshToken();

    await saveRefreshToken(refreshToken, user._id);

    let decodeToken = jwtDecode<
      Partial<ID_Wrapper<IUser>> & { exp: string; id: string }
    >(token);

    // save refreshToken to cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.json({
      msg: 'success',
      token,
      expiresAt: decodeToken.exp,
      userInfo: {
        ...user.toObject(),
        password: undefined,
        secretQuestion: undefined,
        secretAnswer: undefined,
      },
    });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ errors: { type: 'server', msg: 'Something went wrong.' } });
  }
}

async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  try {
    let userInfo: Partial<IUser> = {
      email: req.body.username,
      name: req.body.name,
      password: req.body.password,
      phone_number: req.body.phone_number,
      secretAnswer: req.body.answer,
      secretQuestion: req.body.question,
    };

    let foundUser = await User.findOne({
      $or: [{ email: userInfo.email }, { phone_number: userInfo.phone_number }],
    }).exec();

    if (foundUser && foundUser.email === userInfo.email) {
      return res.status(422).json({
        errors: {
          type: 'server',
          msg: 'Username is already in use.',
        },
      });
    }

    if (foundUser && foundUser.phone_number === userInfo.phone_number) {
      return res.status(422).json({
        errors: {
          type: 'server',
          msg: 'Phone number is already in use.',
        },
      });
    }

    let newUser = new User(userInfo);
    await newUser.save();

    res.status(201).json({
      msg: 'success',
    });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ errors: { type: 'server', msg: 'Something went wrong' } });
  }
}

async function getQuestion(req: Request, res: Response) {
  const key = req.params.key;
  let foundUser = await User.findOne({
    $or: [
      { email: key },
      { phone_number: isNaN(Number(key)) ? 0 : Number(key) },
    ],
  }).exec();
  if (!foundUser) {
    return res
      .status(422)
      .json({ errors: { type: 'Server', msg: 'User not found.' } });
  }
  return res.json({ msg: 'success', secretQuestion: foundUser.secretQuestion });
}

async function resetPassword(req: Request, res: Response) {
  const key = req.params.key;
  const password = req.body.new_password;
  const answer = req.body.answer;
  let foundUser = await User.findOne({
    $or: [
      { email: key },
      { phone_number: isNaN(Number(key)) ? 0 : Number(key) },
    ],
  }).exec();
  if (!foundUser) {
    return res
      .status(422)
      .json({ errors: { type: 'Server', msg: 'User not found.' } });
  }

  if (!(await foundUser.verifyAnswer(answer))) {
    return res.status(422).json({
      errors: {
        type: 'server',
        msg: 'Incorrect Answer.',
      },
    });
  }

  foundUser.password = password;
  await foundUser.save();

  return res.json({ msg: 'success' });
}

async function refreshToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userFromToken = await RefreshToken.findOne({
      refreshToken: req.cookies.refreshToken,
    }).select('user');
    if (!userFromToken) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findOne({
      _id: userFromToken.user,
    });
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const token = createToken(user);
    return res.json({ token });
  } catch (e) {
    return res.status(400).json({ message: 'something went wrong' });
  }
}

export { authenticate, register, getQuestion, resetPassword, refreshToken };
