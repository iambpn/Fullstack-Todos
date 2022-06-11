import { Router } from 'express';
import loginValidator from '../Validators/auth/login';
import {
  authenticate,
  getQuestion,
  register,
  resetPassword,
  refreshToken,
} from '../Controllers/auth';
import registerValidator from '../Validators/auth/register';
import forgotPasswordValidator from '../Validators/auth/forgotPassword';

const auth_router = Router();

auth_router.post('/token/refresh', refreshToken);
auth_router.post('/login', loginValidator, authenticate);
auth_router.post('/register', registerValidator, register);
auth_router.get('/forgot/:key/question', getQuestion);
auth_router.post('/forgot/:key/reset', forgotPasswordValidator, resetPassword);

export default auth_router;
