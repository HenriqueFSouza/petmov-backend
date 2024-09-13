import { Router } from 'express';
import { createPet } from '../controllers/petController';

const routes = Router();


// Pet routes
routes.post('/api/test', createPet);

export default routes;
