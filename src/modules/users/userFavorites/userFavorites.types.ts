import { UserFavoriteTreatises } from '@/entities/UserFavoriteTreatises.entity';
import { Users } from '@/entities/Users.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class UserFavoriteTreatisesInfo extends PickType(UserFavoriteTreatises, [
  'treatiseId',
  'createdAt',
] as const) {
  @ApiProperty({ description: '标题' })
  title: string;

  @ApiProperty({ description: '标签' })
  label: string;
}

export class ListFavoriteTreatiseResult {
  @ApiProperty({ description: '收藏论文数组', type: UserFavoriteTreatisesInfo , isArray: true })
  favoriteTreatises: UserFavoriteTreatisesInfo [];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperateTreatisesResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}
