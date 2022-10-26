import { Module } from '@nestjs/common';
import { UserFavoritesModule } from './userFavorites/userFavorites.module';
import { UserHistoryModule } from './userHistory/userHistory.module';
import { UserKeywordsModule } from './userKeywords/userKeywords.module';
import { UserLabelsModule } from './userLabels/userLabels.module';
import { UserNotesModule } from './userNotes/userNotes.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UserHistoryModule, UserFavoritesModule, UserLabelsModule,UserNotesModule, UserKeywordsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
