import { UserFavoriteTreatises } from '@/entities/UserFavoriteTreatises.entity';
import { UserNoteTreatises } from '@/entities/UserNoteTreatises.entity';
import { Users } from '@/entities/Users.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class GetNoteTreatiseDetailResult extends PickType(UserNoteTreatises, [
  'id',
  'comment',
  'content',
  'treatiseId',
  'updatedAt',
  'commentedAt',
] as const) {
  @ApiProperty({ description: '论文标题' })
  title: string;

  @ApiPropertyOptional({ description: '论文链接' })
  url: string;
}

export class SaveNoteTreatiseResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}

export class RemoveNoteTreatisesResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class ListNoteTreatiseResult {
  @ApiProperty({ description: '笔记数组', type: GetNoteTreatiseDetailResult, isArray: true })
  noteTreatises: GetNoteTreatiseDetailResult[];

  @ApiProperty({ description: '数量' })
  count: number;
}

export class GetNoteTreatisesByTreatiseIdResult {
  @ApiProperty({ description: '笔记数组', type: GetNoteTreatiseDetailResult, isArray: true })
  noteTreatises: GetNoteTreatiseDetailResult[];
}
