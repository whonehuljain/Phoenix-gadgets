import { Router } from 'express';
import { auth as authRoute } from './auth';

const router = Router();

//ping
router.get('/ping', (req, res) => {
    res.json({ status: 'ok'}).status(200);
  });
  
  
router.use('/auth', authRoute);

export default router;