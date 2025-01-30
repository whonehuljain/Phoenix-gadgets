import { Router } from 'express';
import { auth as authRoute } from './auth';
import { gadget as gadgetRoute } from './gadget';

const router = Router();

//ping
router.get('/ping', (req, res) => {
    res.json({ status: 'ok'}).status(200);
  });
  
  
router.use('/auth', authRoute);
router.use('/gadgets', gadgetRoute);

export default router;