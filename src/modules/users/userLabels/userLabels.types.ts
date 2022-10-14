import { UserFavoriteTreatises } from '@/entities/UserFavoriteTreatises.entity';
import { UserLabelTreatises } from '@/entities/UserLabelTreatises.entity';
import { Users } from '@/entities/Users.entity';
import { LabelCountInfo } from '@/modules/treatises/treatises.types';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class UserLabelTreatiseInfo extends PickType(UserLabelTreatises, [
  'treatiseId',
  'label',
] as const) {
  @ApiProperty({ description: '标题' })
  title: string;

  @ApiPropertyOptional({ description: '作者' })
  author: string;

  @ApiPropertyOptional({ description: '发表时间' })
  deliveryAt: Date;

  @ApiProperty({ description: '栏目id' })
  columnId: string;
}

export class ListLabelTreatiseResult {
  @ApiProperty({ description: '标签论文数组', type: UserLabelTreatiseInfo, isArray: true })
  labelTreatises: UserLabelTreatiseInfo[];

  @ApiPropertyOptional({
    description: '用户标签并带标签数量',
    type: LabelCountInfo,
    isArray: true,
  })
  labels: LabelCountInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperateTreatisesResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}
