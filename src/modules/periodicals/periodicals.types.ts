import { Periodicals } from '@/entities/Periodicals.entity';
import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SavePeriodicalResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetPeriodicalDetailResult extends PickType(Periodicals, [
  'id',
  'name',
  'status',
  'ownerId',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'columnId',
  'type',
  'introduction',
  'language',
  'region',
  'field',
  'minorField',
  'url',
  'address',
  'search',
  'impactFactor',
  'establishedAt',
  'publisher',
  'period',
  'manager',
  'organizer',
  'ISSN',
  'CN',
  'pekingUnit',
  'honor',
  'articleNumber',
  'quote',
  'downloads',
  'subject',
  'compositeImpactFactor',
  'checkPeriod',
  'releasePeriod',
  'recordRate',
  'checkFee',
  'pageFee',
  'reward',
  'coverUrl',
  'citeScore',
  'citeRate',
  'clicks',
] as const) {
  @ApiPropertyOptional({ description: '学科分类名称' })
  subjectName: string;

  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '发刊周期名称' })
  periodName: string;

  @ApiPropertyOptional({ description: '语种名称' })
  languageName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;
}
export class ListPeriodicalInfo extends PickType(Periodicals, [
  'id',
  'name',
  'columnId',
  'status',
  'updatedAt',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class ListPeriodicalResult {
  @ApiProperty({ description: '期刊数组', type: ListPeriodicalInfo, isArray: true })
  periodicals: ListPeriodicalInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperatePeriodicalsResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class RemovePeriodicalsResult extends PickType(OperatePeriodicalsResult, [
  'succeed',
  'failed',
] as const) {}

export class ListComplexPeriodicalInfo extends PickType(Periodicals, [
  'id',
  'name',
  'subject',
  'field',
  'minorField',
  'type',
  'period',
  'articleNumber',
  'compositeImpactFactor',
  'ISSN',
  'citeScore',
  'citeRate',
  'quote',
] as const) {
  @ApiPropertyOptional({ description: '发刊周期名称' })
  periodName: string;

  @ApiPropertyOptional({ description: '学科分类名称' })
  subjectName: string;
}

export class ListComplexPeriodicalResult {
  @ApiProperty({ description: '期刊数组', type: ListComplexPeriodicalInfo, isArray: true })
  periodicals: ListPeriodicalInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class RecommendPeriodicalInfo extends PickType(Periodicals, [
  'id',
  'name',
  'ISSN',
  'type',
  'minorField',
  'coverUrl',
] as const) {}

export class RecommendPeriodicalsResult {
  @ApiProperty({ description: '期刊数组', type: RecommendPeriodicalInfo, isArray: true })
  periodicals: ListPeriodicalInfo[];
}

export class RecommendPeriodicalByIdInfo extends PickType(Periodicals, [
  'id',
  'name',
  'columnId'
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class RecommendPeriodicalsByIdResult {
  @ApiProperty({ description: '期刊数组', type: RecommendPeriodicalByIdInfo, isArray: true })
  periodicals: ListPeriodicalInfo[];
}
