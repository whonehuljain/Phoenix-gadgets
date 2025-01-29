import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { registerModel, loginModel } from '../models/authmodel';

export const auth = Router();

const authController = new AuthController();

auth.post('/register', validate(registerModel), authController.register);
auth.post('/login', validate(loginModel), authController.login);
