import { Module } from '@nestjs/common';
import { TreatisesController } from './treatises.controller';
import { TreatisesService } from './treatises.service';

@Module({
  controllers: [TreatisesController],
  providers: [TreatisesService],
  exports: [TreatisesService],
})
export class TreatisesModule {}
