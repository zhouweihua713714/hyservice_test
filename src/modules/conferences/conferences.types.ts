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
  'abbreviation',
  'name',
  'conductedAt',
  'endedAt',
  'period',
  'location',
  'introduction',
  'coverUrl',
  'field',
  'minorField',
  'website',
  'contact',
  'email',
  'unit',
  'deliveryEndedAt',
  'preregisterEndedAt',
  'registerEndedAt',
  'picker',
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
export class ListConferenceInfo extends PickType(Conferences, [
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

export class ListConferenceResult {
  @ApiProperty({ description: '会议数组', type: ListConferenceInfo, isArray: true })
  conferences: ListConferenceInfo[];

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

export class ListComplexConferenceInfo extends PickType(Conferences, [
  'id',
  'name',
  'conductedAt',
  'endedAt',
  'picker',
  'location',
  'period',
  'introduction',
  'field',
  'minorField',
  'website',
  'coverUrl',
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

export class ListComplexConferenceResult {
  @ApiProperty({ description: '会议数组', type: ListComplexConferenceInfo, isArray: true })
  conferences: ListComplexConferenceInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class ListRecentConferenceInfo extends PickType(Conferences, [
  'id',
  'name',
  'conductedAt',
  'endedAt',
  'picker',
  'location',
  'period',
  'coverUrl',
] as const) {}

export class ListRecentConferenceResult {
  @ApiProperty({ description: '会议数组', type: ListRecentConferenceInfo, isArray: true })
  conferences: ListRecentConferenceInfo[];
}

export class RecommendConferencesInfo extends PickType(Conferences, [
  'id',
  'name',
  'columnId',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class RecommendConferencesResult {
  @ApiProperty({ description: '会议数组', type: RecommendConferencesInfo, isArray: true })
  conferences: RecommendConferencesInfo[];
}
