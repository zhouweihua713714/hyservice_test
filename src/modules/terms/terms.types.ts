import { Terms } from '@/entities/Terms.entity';
import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SaveTermResult {
  @ApiProperty({ description: '主键id' })
  id: string;

}
export class GetTermsDetailResult extends PickType(Terms, [
  'id',
  'name',
  'termNumber',
  'principal',
  'unit',
  'province',
  'money',
  'type',
  'department',
  'authorizedAt',
  'subject',
  'subjectNo',
  'startedAt',
  'endedAt',
  'keyword',
  'columnId',
  'status',
  'ownerId',
  'createdAt',
  'updatedAt',
  'publishedAt',
] as const) {
  @ApiPropertyOptional({ description: '项目类型名称' })
  typeName: string;

  @ApiPropertyOptional({ description: '学科分类名称' })
  subjectName: string;

  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;
}
export class ListTermInfo extends PickType(Terms, [
  'id',
  'name',
  'columnId',
  'status',
  'updatedAt',
  'clicks'
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class ListTermResult {
  @ApiProperty({ description: '项目数组', type: ListTermInfo, isArray: true })
  terms: ListTermInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperateTermsResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class RemoveTermsResult extends PickType(OperateTermsResult, [
  'succeed',
  'failed',
] as const) {}
