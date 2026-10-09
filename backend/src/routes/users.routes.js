import { Router } from 'express';
import { listUsers } from '../controllers/users/listUsers.js';

const router = Router();
router.get('/', listUsers);

export default router;