import { Terms } from '@/entities/Terms.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { isArray } from 'lodash';

export class SaveTermResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetTermDetailResult extends PickType(Terms, [
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
  'clicks',
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

export class ListComplexTermInfo extends PickType(Terms, [
  'id',
  'name',
  'type',
  'principal',
  'unit',
  'authorizedAt',
  'termNumber',
] as const) {
  @ApiProperty({ description: '类型名称' })
  typeName: string;
}

export class ListComplexTermResult {
  @ApiProperty({ description: '项目数组', type: ListComplexTermInfo, isArray: true })
  terms: ListComplexTermInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class UnitInfo {
  @ApiProperty({ description: '依托单位名称' })
  unit: string;

  @ApiProperty({ description: '该依托单位的项目总数' })
  count: number;

  @ApiProperty({ description: '年份(这里没啥用就是字段冗余出来没单独处理顺便文档写上了)' })
  year: number;

  @ApiProperty({ description: '与从左往右的排序一致(这里的值是top10的值来排序无其他作用字段)' })
  order: number;
}
export class GetTermCountByUnitInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '该年份下的项目的总数' })
  count: number;

  @ApiProperty({ description: 'top10单位项目的总数(这个y坐标高度可能需要展示这个值)' })
  topCount: number;

  @ApiProperty({
    description: '该年份下的依托单位数量分布(根据需求目前只展示top10)',
    type: UnitInfo,
    isArray: true,
  })
  units: UnitInfo[];
}

export class YearCountInfo {
  @ApiProperty({ description: '依托单位名称(这里没啥用就是字段冗余出来没单独处理顺便文档写上了)' })
  unit: string;

  @ApiProperty({ description: '该依托单位的项目总数' })
  count: number;

  @ApiProperty({ description: '年份' })
  year: number;
}

export class UnitTop10Info {
  @ApiProperty({ description: '依托单位名称' })
  unit: string;

  @ApiProperty({ description: '该年份下的项目的总数' })
  count: number;

  @ApiProperty({
    description: '该依托单位下不同年份的分布情况',
    type: YearCountInfo,
    isArray: true,
  })
  yearCount: YearCountInfo[];
}

export class GetTermCountByUnitResult {
  @ApiProperty({
    description:
      '依托单位分布数组(这里需要注意下国家社会科学基金、教育部人文社科项目基金主要拿这个数组展示就够了)',
    type: GetTermCountByUnitInfo,
    isArray: true,
  })
  yearCounts: GetTermCountByUnitInfo[];

  @ApiProperty({
    description:
      '依托单位top10顺序已经排好(国家自然科学基金项目(F0701)这个图表主要在这个数组里yearCount展示,这里会有yearCount具体你看下ui的xy轴就清楚了),另外两个图表这个top10主要是在x轴上要显示哪top10',
    type: UnitTop10Info,
    isArray: true,
  })
  unitTop10: UnitTop10Info[];
}

export class TypeCountInfo {
  @ApiProperty({ description: '项目类型id' })
  id: string;

  @ApiProperty({ description: '项目名称' })
  name: string;

  @ApiProperty({ description: '该类型下项目的总数' })
  count: number;

  @ApiProperty({ description: '该类型下项目占比(目前保留一位小数)' })
  percent: number;
}

export class YearCountByTypeInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '该年份下项目的总数' })
  count: number;

  @ApiProperty({ description: '该年份下项目占比(目前保留一位小数)' })
  percent: number;

  @ApiProperty({
    description: '该年份下的类型项目占比(目前保留一位小数)',
    type: TypeCountInfo,
    isArray: true,
  })
  types: TypeCountInfo[];
}

export class GetTermCountByTypeResult {
  @ApiProperty({
    description: '类型分布占比,(这里只展示前7,这边全下发因为有百分比)',
    type: TypeCountInfo,
    isArray: true,
  })
  typeCounts: TypeCountInfo[];

  @ApiProperty({
    description: '年份类型分布占比,(目前仅国家自然科学基金项目需要用到)',
    type: YearCountByTypeInfo,
    isArray: true,
  })
  yearCounts: YearCountByTypeInfo[];
}

export class TypeInfo extends PickType(TypeCountInfo, ['id', 'name', 'count'] as const) {}

export class GetTermCountByYearInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({
    description:
      '该年份下的项目的总数(这里的总数不一定与数组下的总和一致如果项目没类型的情况下无类型的会在types里过滤掉)',
  })
  count: number;

  @ApiProperty({
    description: '该年份下不同类型的项目数据统计',
    type: TypeInfo,
    isArray: true,
  })
  types: TypeInfo[];
}

export class GetTermCountByYearResult {
  @ApiProperty({
    description: '项目类别时间分析(教育部人文社科项目基金有)',
    type: GetTermCountByYearInfo,
    isArray: true,
  })
  yearCounts: GetTermCountByYearInfo[];
}

export class YearInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '资助率(学科项目总数/总项目数目前保留以为小数)' })
  percent: number;
}

export class GetTermPercentBySubjectInfo {
  @ApiProperty({ description: '学科id' })
  subject: string;

  @ApiProperty({ description: '学科名称' })
  subjectName: string;

  @ApiProperty({ description: '学科代码(这里没有用到~只是需要用这个代码排序进行了冗余)' })
  subjectNo: string;

  @ApiProperty({ description: '资助率(学科项目总数/总项目数目前保留以为小数)' })
  percent: number;

  @ApiProperty({
    description: '该学科下不同年份年份的项目数据统计',
    type: YearInfo,
    isArray: true,
  })
  years: YearInfo[];
}

export class GetTermPercentBySubjectResult {
  @ApiProperty({
    description: '不同研究方向资助率数组(国家自然科学基金有)',
    type: GetTermPercentBySubjectInfo,
    isArray: true,
  })
  subjectCounts: GetTermPercentBySubjectInfo[];
}

export class MoneyTypeInfo extends PickType(TypeCountInfo, ['id', 'name'] as const) {
  @ApiProperty({ description: '资助金额' })
  money: number;
}
export class GetMoneyByYearInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '资助金额' })
  money: number;

  @ApiProperty({
    description: '该年份下不同类型的项目资助金额(这边的排序已经按照需求id排序好)',
    type: MoneyTypeInfo,
    isArray: true,
  })
  types: MoneyTypeInfo[];
}

export class GetMoneyByYearResult {
  @ApiProperty({
    description: '资助金额分布数组(国家自然科学基金有)',
    type: GetMoneyByYearInfo,
    isArray: true,
  })
  moneyCounts: GetMoneyByYearInfo[];
}

export class ProvinceInfo {
  @ApiProperty({ description: '年份,该字段这里是冗余' })
  year: number;

  @ApiProperty({ description: '省份code,这里省份名称前端自主对照本地code码表' })
  province: string;

  @ApiProperty({ description: '项目数量' })
  count: number;
}
export class GetTermCountByProvinceInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '项目总数' })
  count: number;

  @ApiProperty({
    description: '该年份下不同省份的项目数',
    type: ProvinceInfo,
    isArray: true,
  })
  provinces: ProvinceInfo[];
}

export class GetTermCountByProvinceResult {
  @ApiProperty({
    description: '资助金额分布数组(国家自然科学基金有)',
    type: GetTermCountByProvinceInfo,
    isArray: true,
  })
  provinceCounts: GetTermCountByProvinceInfo[];
}

export class GetTermPercentByPercentInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '申请数量' })
  applicantCount: number;

  @ApiProperty({ description: '资助数量' })
  count: number;

  @ApiProperty({ description: '资助率' })
  percent: number;
}

export class GetTermPercentByYearResult {
  @ApiProperty({
    description: '申请资助情况数组(国家自然科学基金有)',
    type: GetTermPercentByPercentInfo,
    isArray: true,
  })
  yearCounts: GetTermPercentByPercentInfo[];
}
