import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'top secret lol :P';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';


export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};



export const verifyToken = (token: string): any => {
  // console.log(token);
  return jwt.verify(token, JWT_SECRET);
};