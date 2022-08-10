import { Terms } from '@/entities/Terms.entity';
import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

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

  @ApiProperty({ description: '责任人' })
  owner: string;
}
