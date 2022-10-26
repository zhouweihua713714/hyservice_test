import { Module } from '@nestjs/common';
import { UserKeywordsService } from './userKeywords.service';

@Module({
  providers: [UserKeywordsService],
  exports: [UserKeywordsService],
})
export class UserKeywordsModule {}
