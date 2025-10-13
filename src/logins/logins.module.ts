import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from '../entities/login.entity';
import { LoginsController } from './logins.controller';
import { LoginsService } from './logins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Login])],
  providers: [LoginsService],
  controllers: [LoginsController],
  exports: [LoginsService],
})
export class LoginsModule { }
