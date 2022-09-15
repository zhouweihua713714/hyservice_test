import { Module } from '@nestjs/common';
import { UserHistoryModule } from './userHistory/userHistory.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UserHistoryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
