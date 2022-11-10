import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class GetUserDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;
}
export class ModifyUserInfoDto {
  @ApiProperty({ description: '用户id' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;

  @ApiPropertyOptional({ description: '用户头像', type: String, nullable: true })
  @IsString({ message: 'avatar 类型错误, 正确类型 string' })
  @IsOptional()
  avatar: string | null;

  @ApiPropertyOptional({ description: '学校id', type: String, nullable: true })
  @IsString({ message: 'university 类型错误, 正确类型 string' })
  @IsOptional()
  university: string | null;
}
