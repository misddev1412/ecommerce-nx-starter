import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from '../modules/database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Backend API',
    };
  }

  @Get('db/test')
  async testDatabase() {
    return await this.databaseService.testConnection();
  }

  @Get('db/users')
  async getUsers() {
    return await this.databaseService.getAllUsers();
  }

  @Get('db/create-test-user')
  async createTestUser() {
    return await this.databaseService.createTestUser();
  }
}
