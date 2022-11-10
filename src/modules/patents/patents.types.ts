import { Patents } from '@/entities/Patents.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SavePatentResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetPatentDetailResult extends PickType(Patents, [
  'id',
  'status',
  'ownerId',
  'createdAt',
  'updatedAt',
  'columnId',
  'title',
  'abstract',
  'applicant',
  'announcedNo',
  'announcedAt',
  'appliedNo',
  'appliedAt',
  'type',
  'country',
  'agency',
  'agent',
  'validStatus',
  'keyword',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '专利类型名称' })
  typeName: string;

  @ApiPropertyOptional({ description: '专利有效性名称' })
  validStatusName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;
}
export class ListPatentInfo extends PickType(Patents, [
  'id',
  'columnId',
  'status',
  'updatedAt',
  'title',
  'clicks',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class ListPatentResult {
  @ApiProperty({ description: '专利数组', type: ListPatentInfo, isArray: true })
  patents: ListPatentInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperatePatentsResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class RemovePatentsResult extends PickType(OperatePatentsResult, [
  'succeed',
  'failed',
] as const) {}

export class ListComplexPatentInfo extends PickType(Patents, [
  'id',
  'title',
  'announcedAt',
  'applicant',
  'abstract',
  'type',
  'keyword',
] as const) {
  @ApiPropertyOptional({ description: '类型名称' })
  typeName: string;
}

export class ListComplexPatentResult {
  @ApiProperty({ description: '专利数组', type: ListComplexPatentInfo, isArray: true })
  patents: ListComplexPatentInfo[];
}

export class AgentInfo {
  @ApiProperty({ description: '发明数量' })
  count: number;

  @ApiProperty({ description: '代理人,如果发明数相同代理人用分号隔开' })
  agent: string;
}

export class GePatentCountByAgentResult {
  @ApiProperty({ description: '代理人下发明专利数量', type: AgentInfo, isArray: true })
  agents: AgentInfo[];
}

export class GetPatentChartsInfo {
  @ApiProperty({ description: '专利数量' })
  count: number;

  @ApiPropertyOptional({ description: '百分比当位专利类型分布时这个值不为空' })
  percent: number;

  @ApiProperty({
    description: '不同类型的type对应不同的含义,year 即年份,applicant 申请人年份,type 专利类型名称',
  })
  name: string;
}

export class GetPatentChartsResult {
  @ApiProperty({ description: '专利图表数组', type: GetPatentChartsInfo, isArray: true })
  patents: GetPatentChartsInfo[];
}
