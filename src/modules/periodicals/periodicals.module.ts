import { Module } from '@nestjs/common';
import { PeriodicalsController } from './periodicals.controller';
import { PeriodicalsService } from './periodicals.service';

@Module({
  controllers: [PeriodicalsController],
  providers: [PeriodicalsService],
  exports: [PeriodicalsService],
})
export class PeriodicalsModule {}
