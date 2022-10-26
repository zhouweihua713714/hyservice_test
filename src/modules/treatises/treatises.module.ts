import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TreatisesController } from './treatises.controller';
import { TreatisesService } from './treatises.service';

@Module({
  imports: [UsersService],
  controllers: [TreatisesController],
  providers: [TreatisesService, UsersService],
  exports: [TreatisesService, UsersService],
})
export class TreatisesModule {}
