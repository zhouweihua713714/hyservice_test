import { Module } from '@nestjs/common';
import { UserLabelsService } from './userLabels.service';

@Module({
  providers: [UserLabelsService],
  exports: [UserLabelsService],
})
export class UserLabelsModule {}
