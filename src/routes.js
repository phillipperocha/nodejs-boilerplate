import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Variable to uploads
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

routes.post('/users', UserController.store);
// We will prevent bruteforce attack to this route. Brute will save the ips in Redis
// And their attempts.
routes.post('/sessions', bruteForce.prevent, SessionController.store);

// We are defining auth middleware as Global, below here all routes needs to auth
routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

// Defining a route without a controller and a middleware to just accept single files
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
