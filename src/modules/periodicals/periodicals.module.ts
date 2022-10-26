import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PeriodicalsController } from './periodicals.controller';
import { PeriodicalsService } from './periodicals.service';

@Module({
  imports: [UsersService],
  controllers: [PeriodicalsController],
  providers: [PeriodicalsService, UsersService],
  exports: [PeriodicalsService, UsersService],
})
export class PeriodicalsModule {}
