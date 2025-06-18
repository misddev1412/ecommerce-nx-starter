import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from './firebase.service';
import { UserService, CreateUserData } from '../user/user.service';
import { User } from '../../shared/entities/user.entity';

export interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  firebaseUid: string;
  provider: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private firebaseService: FirebaseService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  /**
   * Login with Google OAuth via Firebase
   */
  async loginWithGoogle(firebaseToken: string): Promise<LoginResult> {
    this.logger.log('Processing Google login');
    
    try {
      // Verify Firebase token
      const decodedToken = await this.firebaseService.verifyIdToken(firebaseToken);
      
      // Check if it's Google provider
      const provider = this.firebaseService.getProviderFromToken(decodedToken);
      if (provider !== 'google') {
        throw new UnauthorizedException('Invalid provider. Expected Google.');
      }

      // Find or create user
      let user = await this.userService.findByFirebaseUid(decodedToken.uid);
      
      if (!user) {
        const userData: CreateUserData = {
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          firebaseUid: decodedToken.uid,
          provider: 'google',
          avatar: decodedToken.picture,
        };
        user = await this.userService.createUser(userData);
        this.logger.log(`New user created: ${user.email}`);
      } else {
        // Update user info if needed
        await this.userService.updateUserByFirebaseUid(decodedToken.uid, {
          name: decodedToken.name || user.name,
          avatar: decodedToken.picture || user.avatar,
        });
        this.logger.log(`Existing user logged in: ${user.email}`);
      }

      // Generate JWT token
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        firebaseUid: user.firebaseUid,
        provider: user.provider,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        user,
        accessToken,
      };
    } catch (error) {
      this.logger.error('Google login failed:', error.message);
      throw new UnauthorizedException('Google login failed');
    }
  }

  /**
   * Login with Facebook OAuth via Firebase
   */
  async loginWithFacebook(firebaseToken: string): Promise<LoginResult> {
    this.logger.log('Processing Facebook login');
    
    try {
      // Verify Firebase token
      const decodedToken = await this.firebaseService.verifyIdToken(firebaseToken);
      
      // Check if it's Facebook provider
      const provider = this.firebaseService.getProviderFromToken(decodedToken);
      if (provider !== 'facebook') {
        throw new UnauthorizedException('Invalid provider. Expected Facebook.');
      }

      // Find or create user
      let user = await this.userService.findByFirebaseUid(decodedToken.uid);
      
      if (!user) {
        const userData: CreateUserData = {
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          firebaseUid: decodedToken.uid,
          provider: 'facebook',
          avatar: decodedToken.picture,
        };
        user = await this.userService.createUser(userData);
        this.logger.log(`New user created: ${user.email}`);
      } else {
        // Update user info if needed
        await this.userService.updateUserByFirebaseUid(decodedToken.uid, {
          name: decodedToken.name || user.name,
          avatar: decodedToken.picture || user.avatar,
        });
        this.logger.log(`Existing user logged in: ${user.email}`);
      }

      // Generate JWT token
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        firebaseUid: user.firebaseUid,
        provider: user.provider,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        user,
        accessToken,
      };
    } catch (error) {
      this.logger.error('Facebook login failed:', error.message);
      throw new UnauthorizedException('Facebook login failed');
    }
  }

  /**
   * Verify JWT token and return user
   */
  async verifyToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token) as JwtPayload;
      const user = await this.userService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      return user;
    } catch (error) {
      this.logger.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Logout user (revoke Firebase token)
   */
  async logout(firebaseUid: string): Promise<{ message: string }> {
    try {
      await this.firebaseService.revokeRefreshTokens(firebaseUid);
      this.logger.log(`User ${firebaseUid} logged out successfully`);
      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Logout failed:', error.message);
      throw new UnauthorizedException('Logout failed');
    }
  }

  /**
   * Generate custom Firebase token for user
   */
  async generateCustomToken(userId: string): Promise<string> {
    const user = await this.userService.findById(userId);
    return await this.firebaseService.createCustomToken(user.firebaseUid);
  }
} 