import { Module } from '@nestjs/common';
import { UserHistoryService } from './userHistory.service';

@Module({
  providers: [UserHistoryService],
  exports: [UserHistoryService],
})
export class UserHistoryModule {}
