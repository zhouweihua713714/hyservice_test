import { Module } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { TreatiseLibraryService } from './treatiseLibrary.service';

@Module({
  imports: [UsersService],
  providers: [TreatiseLibraryService, UsersService],
  exports: [TreatiseLibraryService, UsersService],
})
export class TreatiseLibraryModule {}
