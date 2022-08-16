import { Periodicals } from '@/entities/Periodicals.entity';
import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SavePeriodicalResult {
  @ApiProperty({ description: '主键id' })
  id: string;

}
export class GetPeriodicalsDetailResult extends PickType(Periodicals, [
  'id',
  'name',
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
  @ApiProperty({ description: '项目数组', type: ListPeriodicalInfo, isArray: true })
  terms: ListPeriodicalInfo[];

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
