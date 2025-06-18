import { Request, Response } from 'express';
import { User } from '../shared/entities/user.entity';
import { AuthService } from '../modules/auth/auth.service';
import { UserService } from '../modules/user/user.service';

export interface Context {
  req: Request;
  res: Response;
  user?: User;
  authService: AuthService;
  userService: UserService;
}

export interface CreateContextOptions {
  req: Request;
  res: Response;
  authService: AuthService;
  userService: UserService;
}

export async function createContext(opts: CreateContextOptions): Promise<Context> {
  const { req, res, authService, userService } = opts;
  
  // Extract token from Authorization header
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user: User | undefined;

  if (token) {
    try {
      // Verify JWT token and get user
      user = await authService.verifyToken(token);
    } catch (error) {
      // Token is invalid, user remains undefined
      console.warn('Invalid token provided:', error.message);
    }
  }

  return {
    req,
    res,
    user,
    authService,
    userService,
  };
} 