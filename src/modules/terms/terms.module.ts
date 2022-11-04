import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AmericaTermsModule } from './americaTerms/americaTerms.module';
import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';

@Module({
  imports: [UsersService, AmericaTermsModule],
  controllers: [TermsController],
  providers: [TermsService, UsersService],
  exports: [TermsService, UsersService],
})
export class TermsModule {}
