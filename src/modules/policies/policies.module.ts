import { Module } from '@nestjs/common';
import { AnalysisPoliciesModule } from './analysisPolicies/analysisPolicies.module';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';

@Module({
  imports: [AnalysisPoliciesModule],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
