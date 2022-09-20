import { Module } from '@nestjs/common';
import { UserNotesService } from './userNotes.service';

@Module({
  providers: [UserNotesService],
  exports: [UserNotesService],
})
export class UserNotesModule {}
