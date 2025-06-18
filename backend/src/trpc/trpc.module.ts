import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcController } from './trpc.controller';
import { AuthModule } from '../modules/auth/auth.module';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [TrpcController],
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule {} 