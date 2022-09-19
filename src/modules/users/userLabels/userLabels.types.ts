import { UserFavoriteTreatises } from '@/entities/UserFavoriteTreatises.entity';
import { Users } from '@/entities/Users.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class UserFavoritesInfo extends PickType(UserFavoriteTreatises, [
  'userId',
] as const) {
  @ApiProperty({ description: '标题' })
  title: string;
}

export class ListHistoryResult {
  @ApiProperty({ description: '用户浏览历史数组', type: UserFavoritesInfo, isArray: true })
  userHistory: UserFavoritesInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperateTreatisesResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}
