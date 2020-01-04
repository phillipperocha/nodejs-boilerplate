import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// We are defining auth middleware as Global, below here all routes needs to auth
routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
