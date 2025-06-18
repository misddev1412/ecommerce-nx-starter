import { 
  Controller, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  Request,
  Logger
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../shared/entities/user.entity';

export class UpdateUserDto {
  name?: string;
  avatar?: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /**
   * Get current user profile
   */
  @Get('me')
  async getProfile(@Request() req): Promise<User> {
    return req.user;
  }

  /**
   * Update current user profile
   */
  @Put('me')
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    this.logger.log(`Updating profile for user ${req.user.id}`);
    return await this.userService.updateUser(req.user.id, updateUserDto);
  }

  /**
   * Delete current user account
   */
  @Delete('me')
  async deleteAccount(@Request() req): Promise<{ message: string }> {
    this.logger.log(`Deleting account for user ${req.user.id}`);
    await this.userService.deleteUser(req.user.id);
    return { message: 'Account deleted successfully' };
  }

  /**
   * Get user by ID (admin only - to be implemented later)
   */
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }
} 