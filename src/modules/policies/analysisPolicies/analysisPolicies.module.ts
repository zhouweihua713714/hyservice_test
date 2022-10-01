import { Module } from '@nestjs/common';
import { AnalysisPoliciesService } from './analysisPolicies.service';

@Module({
  providers: [AnalysisPoliciesService],
  exports: [AnalysisPoliciesService],
})
export class AnalysisPoliciesModule {}
