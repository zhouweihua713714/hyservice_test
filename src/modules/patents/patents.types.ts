import { Patents } from '@/entities/Patents.entity';
import { Website } from '@/entities/Website.entity';
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
