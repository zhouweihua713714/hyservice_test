import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InstitutionsController } from './institutions.controller';
import { InstitutionsService } from './institutions.service';

@Module({
  imports: [UsersService],
  controllers: [InstitutionsController],
  providers: [InstitutionsService, UsersService],
  exports: [InstitutionsService, UsersService],
})
export class InstitutionsModule {}
