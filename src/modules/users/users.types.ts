import { Users } from '@/entities/Users.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SaveUserResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetUsersDetailResult extends PickType(Users, [
  'id',
  'mobile',
  'name',
  'createdAt',
  'type',
  'avatar',
  'university',
  'info',
] as const) {
  @ApiPropertyOptional({ description: '学校名称', type: String, nullable: true })
  universityName: string | null;
}
