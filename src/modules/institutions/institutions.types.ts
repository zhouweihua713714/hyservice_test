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
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '机构类型名称' })
  typeName: string;

  @ApiPropertyOptional({ description: '机构有效性名称' })
  validStatusName: string;

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
  patents: ListInstitutionInfo[];

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
