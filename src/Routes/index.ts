import { NextFunction, Request, Response, Router } from 'express';
import auth_router from './auth';

const routes = Router();

const attachUser = (req: Request, res: Response, next: NextFunction) => {
  next();
};

routes.use(attachUser);
routes.use(auth_router);

export default routes;
