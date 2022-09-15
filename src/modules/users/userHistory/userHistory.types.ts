import { UserHistory } from '@/entities/UserHistory.entity';
import { Users } from '@/entities/Users.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class UserHistoryInfo extends PickType(UserHistory, [
  'id',
  'relatedId',
  'type',
  'userId',
] as const) {
  @ApiProperty({ description: '标题' })
  title: string;
}

export class ListHistoryResult {
  @ApiProperty({ description: '用户浏览历史数组', type: UserHistoryInfo, isArray: true })
  userHistory: UserHistoryInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}
