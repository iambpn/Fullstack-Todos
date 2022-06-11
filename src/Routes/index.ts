import { NextFunction, Request, Response, Router } from 'express';
import auth_router from './auth';
import todo_router from './todo';
import jwtDecode from 'jwt-decode';
import { expressjwt } from 'express-jwt';

const routes = Router();

const attachUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authentication' });
  }

  // slice bearer<space>
  const decodedToken = jwtDecode<{ id: string; exp: string }>(token.slice(7));

  if (!decodedToken) {
    return res.status(401).json({
      message: 'There was a problem authorizing the request',
    });
  } else {
    req.userId = decodedToken.id;
    next();
  }
};

// Check Auth middleware.
const requireAuth = expressjwt({
  secret: process.env.secret || 'undefined',
  audience: 'todos',
  issuer: 'todos',
  algorithms: ['HS256'],
});

// add routes that is publicly accessible.
routes.use(auth_router);

// add routes that require Auth
routes.use(requireAuth, attachUser);
routes.use('/todo', todo_router);

export default routes;
