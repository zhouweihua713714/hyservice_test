import { Module } from '@nestjs/common';
import { UserFavoritesModule } from './userFavorites/userFavorites.module';
import { UserHistoryModule } from './userHistory/userHistory.module';
import { UserLabelsModule } from './userLabels/userLabels.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UserHistoryModule, UserFavoritesModule, UserLabelsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
