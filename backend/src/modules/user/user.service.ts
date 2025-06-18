import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';

export interface CreateUserData {
  email: string;
  name: string;
  firebaseUid: string;
  provider: string;
  avatar?: string;
}

export interface UpdateUserData {
  name?: string;
  avatar?: string;
  status?: string;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * Find user by Firebase UID
   */
  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { firebaseUid } });
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserData): Promise<User> {
    this.logger.log(`Creating new user with email: ${userData.email}`);
    
    const user = this.userRepository.create({
      ...userData,
      status: 'ACTIVE',
    });
    
    return await this.userRepository.save(user);
  }

  /**
   * Update user
   */
  async updateUser(id: string, updateData: UpdateUserData): Promise<User> {
    const user = await this.findById(id);
    
    Object.assign(user, updateData);
    user.updatedAt = new Date();
    
    return await this.userRepository.save(user);
  }

  /**
   * Update user by Firebase UID
   */
  async updateUserByFirebaseUid(
    firebaseUid: string, 
    updateData: UpdateUserData
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { firebaseUid } });
    if (!user) {
      throw new NotFoundException(`User with Firebase UID ${firebaseUid} not found`);
    }
    
    Object.assign(user, updateData);
    user.updatedAt = new Date();
    
    return await this.userRepository.save(user);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
    this.logger.log(`User ${id} deleted successfully`);
  }

  /**
   * Get all users (admin function)
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    return await this.userRepository.count();
  }
} 