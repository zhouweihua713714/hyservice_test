import { Conferences } from '@/entities/Conferences.entity';
import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SaveConferenceResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetConferenceDetailResult extends PickType(Conferences, [
  'id',
  'status',
  'ownerId',
  'createdAt',
  'updatedAt',
  'columnId',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '会议类型名称' })
  typeName: string;

  @ApiPropertyOptional({ description: '会议有效性名称' })
  validStatusName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;
}
export class ListConferenceInfo extends PickType(Conferences, [
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

export class ListConferenceResult {
  @ApiProperty({ description: '会议数组', type: ListConferenceInfo, isArray: true })
  patents: ListConferenceInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperateConferencesResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class RemoveConferencesResult extends PickType(OperateConferencesResult, [
  'succeed',
  'failed',
] as const) {}
