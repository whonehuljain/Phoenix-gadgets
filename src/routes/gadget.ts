import { Router } from 'express';
import { GadgetController } from '../controllers/gadgetsController';
import { SelfDestructController } from '../controllers/selfDestructController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validate, validateQParams } from '../middlewares/validate';
import { createGadgetModel, updateGadgetModel, selfDestructModel, filterGadgetsByStatusModel } from '../models/gadgetModel';

export const gadget = Router();
const gadgetController = new GadgetController();
const selfDestructController = new SelfDestructController();

gadget.use(authenticate);


gadget.get('/', validateQParams(filterGadgetsByStatusModel), gadgetController.getAllGadgets);

gadget.post('/', authorize('ADMIN'), validate(createGadgetModel), gadgetController.createGadget);

gadget.patch('/:id', authorize('ADMIN'), validate(updateGadgetModel), gadgetController.updateGadget);
gadget.delete('/:id', authorize('ADMIN'), gadgetController.deleteGadget);

// self destruct allowed for Admin as well as agent
gadget.post('/:id/self-destruct', authorize('ADMIN','AGENT'), validate(selfDestructModel), selfDestructController.handleSelfDestruct); 
