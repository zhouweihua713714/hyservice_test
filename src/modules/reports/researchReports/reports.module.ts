import { Module } from '@nestjs/common';
import { ResearchReportsService } from './researchReportsService.service';

@Module({
  providers: [ResearchReportsService],
  exports: [ResearchReportsService],
})
export class ResearchReportsModule {}
