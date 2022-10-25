import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PatentsController } from './patents.controller';
import { PatentsService } from './patents.service';

@Module({
  imports: [UsersService],
  controllers: [PatentsController],
  providers: [PatentsService, UsersService],
  exports: [PatentsService, UsersService],
})
export class PatentsModule {}
