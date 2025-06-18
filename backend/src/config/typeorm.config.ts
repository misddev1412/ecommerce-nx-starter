import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST') || 'localhost',
  port: configService.get('DATABASE_PORT') || 5432,
  username: configService.get('DATABASE_USERNAME') || 'postgres',
  password: configService.get('DATABASE_PASSWORD') || 'postgres',
  database: configService.get('DATABASE_NAME') || 'ecommerce_db',
  entities: ['src/shared/entities/*.entity{.ts,.js}'],
  migrations: ['migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
  ssl: configService.get('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
}); 