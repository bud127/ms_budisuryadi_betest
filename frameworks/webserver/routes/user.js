import userController from '../../../adapters/controllers/userController';
import userDbRepository from '../../../application/repositories/userDbRepository';
import userDbRepositoryMongoDB from '../../database/mongoDB/repositories/userRepositoryMongoDB';
import userRedisRepository from '../../../application/repositories/userRedisRepository';
import userRedisRepositoryImpl from '../../database/redis/userRepositoryRedis';
import authServiceInterface from '../../../application/services/authService';
import redisCachingMiddleware from '../middlewares/redisCachingMiddleware';
import authServiceImpl from '../../services/authService';
import authMiddleware from '../middlewares/authMiddleware';

export default function userRouter(express, redisClient) {
  const router = express.Router();

  // load controller with dependencies
  const controller = userController(
    userDbRepository,
    userDbRepositoryMongoDB,
    authServiceInterface,
    authServiceImpl,
    redisClient,
    userRedisRepository,
    userRedisRepositoryImpl
  );

  // GET enpdpoints
  router.route('/:id').get(authMiddleware, controller.fetchUserById);
  router
    .route('/identityNumber/:identityNumber')
    .get(authMiddleware, controller.fetchUserByIdentityNumber);
  router
    .route('/accountNumber/:accountNumber')
    .get(authMiddleware, controller.fetchUserByAccountNumber);
  router
    .route('/')
    .get(
      [authMiddleware, redisCachingMiddleware(redisClient, 'users')],
      controller.fetchUsersByProperty
    );

  router.route('/:id').put(authMiddleware, controller.updateUserById);

  router.route('/:id').delete(authMiddleware, controller.deleteUserById);
  // POST enpdpoints
  router.route('/').post(controller.addNewUser);

  return router;
}
