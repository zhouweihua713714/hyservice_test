import { Institutions } from '@/entities/Institutions.entity';
import { Website } from '@/entities/Website.entity';
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
  'url'
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
  'clicks'
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
