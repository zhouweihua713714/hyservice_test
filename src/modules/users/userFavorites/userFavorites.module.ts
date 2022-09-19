import { Module } from '@nestjs/common';
import { UserFavoritesService } from './userFavorites.service';

@Module({
  providers: [UserFavoritesService],
  exports: [UserFavoritesService],
})
export class UserFavoritesModule {}
