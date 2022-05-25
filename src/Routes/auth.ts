import { Router } from 'express';
import loginValidator from '../Validators/auth/login';
import { authenticate, register } from '../Controllers/auth';
import registerValidator from '../Validators/auth/register';

const auth_router = Router();

auth_router.post('/login', loginValidator, authenticate);
auth_router.post('/register', registerValidator, register);

export default auth_router;
