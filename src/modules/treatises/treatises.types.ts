import { Treatises } from '@/entities/Treatises.entity';
import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SaveTreatiseResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetTreatiseDetailResult extends PickType(Treatises, [
  'id',
  'status',
  'ownerId',
  'createdAt',
  'updatedAt',
  'columnId',
  'title',
  'deliveryAt',
  'region',
  'channel',
  'language',
  'author',
  'authorUnit',
  'correspondingAuthor',
  'correspondingAuthorUnit',
  'correspondingAuthorEmail',
  'otherAuthor',
  'otherAuthorUnit',
  'field',
  'minorField',
  'sort',
  'abstract',
  'search',
  'references',
  'quote',
  'fundedProject',
  'url',
  'keyword',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '文章类型名称' })
  sortName: string;

  @ApiPropertyOptional({ description: '语种名称' })
  languageName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;
}
export class ListTreatiseInfo extends PickType(Treatises, [
  'id',
  'columnId',
  'status',
  'updatedAt',
  'title',
  'clicks'
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class ListTreatiseResult {
  @ApiProperty({ description: '论文数组', type: ListTreatiseInfo, isArray: true })
  treatises: ListTreatiseInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperateTreatisesResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class RemoveTreatisesResult extends PickType(OperateTreatisesResult, [
  'succeed',
  'failed',
] as const) {}
