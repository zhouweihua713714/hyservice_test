import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConferencesController } from './conferences.controller';
import { ConferencesService } from './conferences.service';

@Module({
  imports: [UsersService],
  controllers: [ConferencesController],
  providers: [ConferencesService, UsersService],
  exports: [ConferencesService, UsersService],
})
export class ConferencesModule {}
