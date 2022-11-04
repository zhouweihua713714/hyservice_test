import { Module } from '@nestjs/common';
import { AmericaTermsService } from './americaTerms.service';

@Module({
  providers: [AmericaTermsService],
  exports: [AmericaTermsService],
})
export class AmericaTermsModule {}
