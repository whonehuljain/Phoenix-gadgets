import bcrypt from 'bcryptjs';
import prisma from '../config/prismaClient';
import { generateToken, verifyToken } from '../config/jwt';
import { CustomError } from '../middlewares/errorHandler';

export class AuthService {

  async register(data: {
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'AGENT';
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new CustomError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      }
    });

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
  
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new CustomError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new CustomError('Invalid credentials');
    }
    

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }


}
