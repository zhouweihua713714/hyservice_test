import { ResearchReports } from '@/entities/ResearchReports.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
export class ListResearchReportInfo extends PickType(ResearchReports, [
  'id',
  'title',
  'abstract',
  'author',
  'downloads',
  'publishedAt'
] as const) {
  @ApiPropertyOptional({ description: '下载链接' })
  url: string;
}

export class ListResearchReportsResult {
  @ApiProperty({ description: '报告数组', type: ListResearchReportInfo, isArray: true })
  reports: ListResearchReportInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}
