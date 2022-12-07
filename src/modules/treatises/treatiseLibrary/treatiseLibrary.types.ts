import { Columns } from '@/entities/Columns.entity';
import { TreatiseLibrary } from '@/entities/TreatiseLibrary.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SaveTreatiseLibraryResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class LabelCountInfo {
  @ApiProperty({ description: '标签id' })
  id: string;
  @ApiProperty({ description: '标记数量' })
  count: number;
}

export class GetTreatiseLibraryDetailResult extends PickType(TreatiseLibrary, [
  'id',
  'status',
  'ownerId',
  'createdAt',
  'updatedAt',
  'columnId',
  'title',
  'deliveryAt',
  'author',
  'authorUnit',
  'correspondingAuthor',
  'correspondingAuthorUnit',
  'correspondingAuthorEmail',
  'otherAuthor',
  'otherAuthorUnit',
  'field',
  'minorField',
  'magazineField',
  'magazineMinorField',
  'sort',
  'abstract',
  'url',
  'keyword',
  'clicks',
  'name',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiProperty({ description: '类型名称' })
  sortName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;
}
export class ListTreatiseLibraryInfo extends PickType(TreatiseLibrary, [
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

export class ListTreatiseLibraryResult {
  @ApiProperty({ description: '精选文库数组', type: ListTreatiseLibraryInfo, isArray: true })
  treatiseLibraries: ListTreatiseLibraryInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperateTreatiseLibrariesResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class RemoveTreatiseLibrariesResult extends PickType(OperateTreatiseLibrariesResult, [
  'succeed',
  'failed',
] as const) { }
export class ListComplexTreatiseLibraryInfo extends PickType(TreatiseLibrary, [
  'id',
  'title',
  'deliveryAt',
  'author',
  'authorUnit',
  'name',
  'abstract',
  'keyword',
] as const) { }
export class RecommendTreatiseInfo extends PickType(TreatiseLibrary, [
  'id',
  'title',
  'columnId',
] as const) { }

export class ListComplexTreatiseLibraryResult {
  @ApiProperty({ description: '精选文库数组', type: ListComplexTreatiseLibraryInfo, isArray: true })
  treatiseLibraries: ListComplexTreatiseLibraryInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class RecommendTreatiseLibrariesResult {
  @ApiProperty({ description: '推荐精选文库数组', type: RecommendTreatiseInfo, isArray: true })
  treatiseLibraries: RecommendTreatiseInfo[];
}

export class KeywordChartTreatiseInfo {
  @ApiProperty({ description: '关键词名称字段冗余' })
  name: string;

  @ApiProperty({ description: '精选文库id,以防未来需要跳转需要用' })
  treatiseId: string;

  @ApiProperty({ description: '精选文库标题' })
  title: string;
}

export class KeywordChartInfo {
  @ApiProperty({ description: '关键词名称' })
  name: string;

  @ApiProperty({ description: '出现的频率数量' })
  frequency: number;

  // @ApiProperty({ description: '用户搜索频率,这个得等小俊那边埋点完才有效果' })
  // search: number;

  @ApiProperty({
    description: '用户精选文库数据(目前展示10条,这个数量可由PM的需求调整)',
    type: KeywordChartTreatiseInfo,
    isArray: true,
  })
  treatises: KeywordChartTreatiseInfo[];
}

export class SortCountsInfo {
  @ApiProperty({ description: '分类id' })
  sort: string;

  @ApiProperty({ description: '分类名称' })
  sortName: string;

  @ApiProperty({ description: '精选文库数量' })
  count: number;
}

export class YearCountsInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '年份下分类数据', type: SortCountsInfo, isArray: true })
  sortCounts: SortCountsInfo[];

  @ApiProperty({ description: '精选文库数量' })
  count: number;
}

export class GetTreatiseLibraryCountBySortAndYearResult {
  @ApiProperty({ description: '分类下数据统计', type: SortCountsInfo, isArray: true })
  sortCounts: SortCountsInfo[];

  @ApiProperty({ description: '年份下数据统计', type: YearCountsInfo, isArray: true })
  yearCounts: YearCountsInfo[];
}
