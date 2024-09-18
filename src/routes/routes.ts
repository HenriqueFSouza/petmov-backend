import { Request, Response, Router } from 'express';
import { createPet, getPets } from '../controllers/petController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createNewService, getFreeTimesServices } from '../controllers/serviceController';
import { getUserProfile, registerUser } from '../controllers/userController';
import { login } from '../controllers/authController';
import { getAgenda } from '../controllers/agendaController';

const routes = Router();


// Autenticação
routes.post('/sessions', login)

// User routes
routes.post('/users', registerUser)

// Auth check route
routes.get('/auth', authenticateToken, (req: Request, res: Response) => { 
    return res.status(200)
} 
)

// Profile route
routes.get('/profile', authenticateToken, getUserProfile)


// Admin User routes
routes.get('/agenda', authenticateToken, getAgenda)

// Pet routes
routes.post('/pet', authenticateToken, createPet);
routes.get('/pet', authenticateToken, getPets);


// Services routes
routes.get('/service/:date', authenticateToken, getFreeTimesServices)
routes.post('/service', authenticateToken, createNewService)

export default routes;
