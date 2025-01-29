import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body, res);
      res.status(201).json({
        success: true,
        data: user,
        message: 'Registration Successful!'
      });
    } catch (error) {
      next(error);
    }
  }



  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password, res);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }


}