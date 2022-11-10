import { Institutions } from '@/entities/Institutions.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SaveInstitutionResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetInstitutionDetailResult extends PickType(Institutions, [
  'id',
  'status',
  'ownerId',
  'createdAt',
  'updatedAt',
  'columnId',
  'foreignName',
  'address',
  'introduction',
  'website',
  'unit',
  'field',
  'minorField',
  'longitude',
  'latitude',
  'url',
  'name',
  'clicks',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '子领域名称' })
  minorFieldName: string;

  @ApiPropertyOptional({ description: '主领域名称' })
  fieldName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;
}
export class ListInstitutionInfo extends PickType(Institutions, [
  'id',
  'columnId',
  'status',
  'updatedAt',
  'name',
  'clicks',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class ListInstitutionResult {
  @ApiProperty({ description: '机构数组', type: ListInstitutionInfo, isArray: true })
  institutions: ListInstitutionInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperateInstitutionsResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class RemoveInstitutionsResult extends PickType(OperateInstitutionsResult, [
  'succeed',
  'failed',
] as const) {}

export class ListComplexInstitutionInfo extends PickType(Institutions, [
  'id',
  'name',
  'foreignName',
  'address',
  'introduction',
  'unit',
  'field',
  'minorField',
  'website',
  'url',
] as const) {
  @ApiPropertyOptional({
    description: '子领域名称(这里拼接好下发用;隔开如果样式问题可以根据分号进行切割展示)',
  })
  minorFieldName: string;

  @ApiPropertyOptional({
    description: '主领域名称(这里拼接好下发用;隔开如果样式问题可以根据分号进行切割展示)',
  })
  fieldName: string;
}

export class ListComplexInstitutionResult {
  @ApiProperty({ description: '机构数组', type: ListComplexInstitutionInfo, isArray: true })
  institutions: ListComplexInstitutionInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class RecommendInstitutionsInfo extends PickType(Institutions, [
  'id',
  'name',
  'columnId',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class RecommendInstitutionsResult {
  @ApiProperty({ description: '推荐机构数组', type: RecommendInstitutionsInfo, isArray: true })
  institutions: RecommendInstitutionsInfo[];
}

export class GetInstitutionsByCoordinateInfo extends PickType(Institutions, [
  'name',
  'latitude',
  'longitude',
] as const) {}

export class GetInstitutionsByCoordinateResult {
  @ApiProperty({
    description: '推荐机构数组',
    type: GetInstitutionsByCoordinateInfo,
    isArray: true,
  })
  institutions: GetInstitutionsByCoordinateInfo[];
}
