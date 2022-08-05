import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { User_Status_Enum } from '@/common/enums/common.enum';
import { Users } from '@/entities/Users.entity';

// signIn 返回的聚合数据
export class SignInResInfo extends PickType(Users, ['id', 'mobile', 'status', 'name','type'] as const) {
  @ApiProperty({ description: 'token' })
  token: string;
}
export class signUpResInfo extends PickType(Users, ['id', 'mobile', 'status', 'name','type'] as const) {
  @ApiProperty({ description: 'token' })
  token: string;
}
export class JwtUser {
  id: string;
  mobile: string;
  name?: string | null;
  status: string;
  type:string;
}
