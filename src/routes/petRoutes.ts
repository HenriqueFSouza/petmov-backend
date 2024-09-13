import { Router } from 'express';
import { createPet } from '../controllers/petController';

const router = Router();

router.post('/api/test', createPet);

export default router;
