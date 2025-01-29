import { Router } from 'express';
import { auth as authRoutes } from './auth';

const router = Router();

//ping
router.get('/ping', (req, res) => {
    res.json({ status: 'ok'}).status(200);
  });
  
  
router.use('/auth', authRoutes);

export default router;