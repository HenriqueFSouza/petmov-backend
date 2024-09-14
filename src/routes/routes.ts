import { Router } from 'express';
import { createPet } from '../controllers/petController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createNewService, getFreeTimesServices } from '../controllers/serviceController';
import { getUserProfile, registerUser } from '../controllers/userController';
import { login } from '../controllers/authController';

const routes = Router();


// Autenticação
routes.post('/session', login)

// User routes
routes.post('/users', registerUser)

routes.use(authenticateToken)
routes.get('/profile', getUserProfile)

// Pet routes
routes.post('/api/test', createPet);

// Services routes
routes.get('/service/:date', getFreeTimesServices)
routes.post('/service', createNewService)

export default routes;
