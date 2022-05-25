import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserModel, { IUser } from '../Models/user';
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
    let user = await UserModel.findOne({ email: username }).exec();
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

    let decodeToken = jwtDecode<Partial<ID_Wrapper<IUser>> & { exp: string }>(
      token
    );

    // save refreshToken to cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.json({
      msg: 'success',
      token,
      expiresAt: decodeToken.exp,
      userInfo: { ...user.toObject(), password: undefined },
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
    let userInfo = {
      email: req.body.username,
      name: req.body.name,
      password: req.body.password,
      phone_number: req.body.phone_number,
    };

    let foundUser = await UserModel.findOne({
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

    let newUser = new UserModel(userInfo);
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

export { authenticate, register };
