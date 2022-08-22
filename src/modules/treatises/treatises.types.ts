import { Treatises } from '@/entities/Treatises.entity';
import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SaveTreatiseResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetTreatisesDetailResult extends PickType(Treatises, [
  'id',
  'status',
  'ownerId',
  'createdAt',
  'updatedAt',
  'columnId',
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
export class ListTreatiseInfo extends PickType(Treatises, [
  'id',
  'columnId',
  'status',
  'updatedAt',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class ListTreatiseResult {
  @ApiProperty({ description: '项目数组', type: ListTreatiseInfo, isArray: true })
  periodicals: ListTreatiseInfo[];

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
