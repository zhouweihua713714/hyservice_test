import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ResearchReportsModule } from './researchReports/reports.module';

@Module({
  imports: [ResearchReportsModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
