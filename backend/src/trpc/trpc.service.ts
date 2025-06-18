import { Injectable } from '@nestjs/common';
import { router } from './trpc';
import { AuthService } from '../modules/auth/auth.service';
import { UserService } from '../modules/user/user.service';
import { authRouter } from '../modules/auth/trpc/auth.router';
import { createContext } from './context';
import { Request, Response } from 'express';

@Injectable()
export class TrpcService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // Create TRPC context for requests
  async createContext(req: Request, res: Response) {
    return createContext({
      req,
      res,
      authService: this.authService,
      userService: this.userService,
    });
  }

  // Main app router with all sub-routers
  getAppRouter() {
    return router({
      auth: authRouter,
    });
  }
} 