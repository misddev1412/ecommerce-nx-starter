import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async testConnection(): Promise<{ status: string; message: string }> {
    try {
      // Test database connection by counting users
      const count = await this.userRepository.count();
      this.logger.log('Database connection test successful');
      return {
        status: 'success',
        message: `Database connected successfully. User count: ${count}`,
      };
    } catch (error) {
      this.logger.error('Database connection test failed:', error.message);
      return {
        status: 'error',
        message: 'Database connection failed: ' + error.message,
      };
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        order: { createdAt: 'DESC' },
      });
      this.logger.log(`Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Failed to get users:', error.message);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    return this.getAllUsers(); // Alias for backward compatibility
  }

  async createTestUser(): Promise<User> {
    try {
      const testUser = this.userRepository.create({
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        firebaseUid: `test-uid-${Date.now()}`,
        provider: 'test',
        status: 'ACTIVE',
      });

      const savedUser = await this.userRepository.save(testUser);
      this.logger.log(`Test user created: ${savedUser.email}`);
      return savedUser;
    } catch (error) {
      this.logger.error('Failed to create test user:', error.message);
      throw error;
    }
  }

  async createUser(userData: {
    email: string;
    name: string;
    firebaseUid?: string;
    provider?: string;
    avatar?: string;
  }): Promise<User> {
    try {
      const user = this.userRepository.create({
        ...userData,
        status: 'ACTIVE',
      });

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User created: ${savedUser.email}`);
      return savedUser;
    } catch (error) {
      this.logger.error('Failed to create user:', error.message);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return user;
    } catch (error) {
      this.logger.error('Failed to get user by ID:', error.message);
      throw error;
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    try {
      await this.userRepository.update(id, updateData);
      const updatedUser = await this.getUserById(id);
      this.logger.log(`User updated: ${id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error('Failed to update user:', error.message);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
      this.logger.log(`User deleted: ${id}`);
    } catch (error) {
      this.logger.error('Failed to delete user:', error.message);
      throw error;
    }
  }
} 