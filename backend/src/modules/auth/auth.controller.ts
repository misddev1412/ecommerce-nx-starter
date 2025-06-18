import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Request,
  HttpStatus,
  HttpCode,
  Logger
} from '@nestjs/common';
import { AuthService, LoginResult } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

export class LoginDto {
  firebaseToken: string;
}

export class LogoutDto {
  firebaseUid: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Login with Google OAuth via Firebase
   */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() loginDto: LoginDto): Promise<LoginResult> {
    this.logger.log('Google login attempt');
    return await this.authService.loginWithGoogle(loginDto.firebaseToken);
  }

  /**
   * Login with Facebook OAuth via Firebase
   */
  @Post('facebook')
  @HttpCode(HttpStatus.OK)
  async facebookLogin(@Body() loginDto: LoginDto): Promise<LoginResult> {
    this.logger.log('Facebook login attempt');
    return await this.authService.loginWithFacebook(loginDto.firebaseToken);
  }

  /**
   * Get current user profile (protected route)
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return {
      user: req.user,
      message: 'Profile retrieved successfully'
    };
  }

  /**
   * Logout user
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutDto: LogoutDto) {
    await this.authService.logout(logoutDto.firebaseUid);
    return {
      message: 'Logged out successfully'
    };
  }

  /**
   * Verify token endpoint
   */
  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
      message: 'Token is valid'
    };
  }

  /**
   * Health check for auth service
   */
  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      service: 'auth',
      timestamp: new Date().toISOString(),
      providers: ['google', 'facebook']
    };
  }
} 