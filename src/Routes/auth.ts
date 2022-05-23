import { Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import loginValidator from '../Validators/auth/login';
import UserModel from '../Models/user';

const auth_router = Router();

auth_router.post(
  '/login',
  loginValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    try {
      const username = req.body.username;
      const password = req.body.password;

      let user = await UserModel.findOne({ email: username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!(await user.verifyPassword(password))) {
        return res
          .status(404)
          .json({ message: "Username or Password didn't matched." });
      }

      return res.json({
        message: 'success',
        user: { ...user.toObject(), password: '' },
      });
    } catch (e) {
      console.log(e);
      return res.json({ message: 'Error' });
    }
  }
);

export default auth_router;
