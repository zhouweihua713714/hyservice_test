import { Columns } from '@/entities/Columns.entity';
import { Treatises } from '@/entities/Treatises.entity';
import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { GetNoteTreatiseDetailResult } from '../users/userNotes/userNotes.types';

export class SaveTreatiseResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class LabelCountInfo {
  @ApiProperty({ description: '标签id' })
  id: string;
  @ApiProperty({ description: '标记数量' })
  count: number;
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
  'authorAbbreviation',
  'authorAddress',
  'correspondingAuthorAddress',
  'referencesNumber',
  'publisher',
  'publisherAddress',
  'periodical',
  'periodicalAbbreviation',
  'releasedAt',
  'doi',
  'studyField',
  'clicks',
  'name',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '文章类型名称' })
  sortName: string;

  @ApiPropertyOptional({ description: '语种名称' })
  languageName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;

  @ApiPropertyOptional({
    description: '标签统计数,仅在C端请求进行统计',
    type: LabelCountInfo,
    isArray: true,
  })
  labels: LabelCountInfo[];

  // @ApiPropertyOptional({
  //   description: '用户笔记列表,仅在C端且用户是登录状态返回的值有效默认为空数组',
  //   type: GetNoteTreatiseDetailResult,
  //   isArray: true,
  // })
  // noteTreatises: GetNoteTreatiseDetailResult[];

  @ApiProperty({ description: '用户标签,当前用户登录时有贴就有' })
  label: string;

  @ApiProperty({ description: '是否被收藏:1是,0否(用户未登录默认都是0)' })
  isFavorite: number;
}
export class ListTreatiseInfo extends PickType(Treatises, [
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
export class ArticleCountInfo extends PickType(Columns, [
  'id',
  'name',
  'introduction',
  'sequenceNumber',
  'parentId',
] as const) {
  @ApiProperty({ description: '文章数量' })
  count: number;

  @ApiProperty({ description: '最新更新时间' })
  updatedAt: Date;
}

export class GetArticleCountResult {
  @ApiProperty({ description: '论文下栏目的文章数量数组', type: ArticleCountInfo, isArray: true })
  columns: ArticleCountInfo[];
}

export class ListComplexTreatiseInfo extends PickType(Treatises, [
  'id',
  'title',
  'deliveryAt',
  'name',
  'abstract',
  'keyword',
  'author',
  'periodical',
  'releasedAt',
] as const) {
  @ApiProperty({ description: '标签,列表标签是所有用户贴的最多的' })
  label: string;

  @ApiProperty({ description: '是否被收藏:1是,0否(用户未登录默认都是0)' })
  isFavorite: number;
}
export class RecommendTreatiseInfo extends PickType(Treatises, ['id', 'title'] as const) {}

export class ListComplexTreatiseResult {
  @ApiProperty({ description: '论文数组', type: ListComplexTreatiseInfo, isArray: true })
  treatises: ListComplexTreatiseInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class RecommendTreatisesResult {
  @ApiProperty({ description: '推荐论文数组', type: RecommendTreatiseInfo, isArray: true })
  treatises: RecommendTreatiseInfo[];
}

export class InstitutionChartInfo {
  @ApiProperty({ description: '机构名称' })
  name: string;

  @ApiProperty({ description: '文章数量' })
  count: number;
}

export class GetInstitutionChartsResult {
  @ApiProperty({ description: '机构排名数组', type: InstitutionChartInfo, isArray: true })
  institutionCharts: InstitutionChartInfo[];
}
