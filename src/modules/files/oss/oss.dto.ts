import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class LaunchDto {
  @ApiProperty({ description: '文件名' })
  @IsString({ message: '文件名 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '文件名不能为空' })
  @MaxLength(500, { message: '文件名超出长度范围' })
  filename: string;

  @ApiPropertyOptional({ description: '上传凭证' })
  @IsString({ message: '上传凭证 类型错误, 正确类型 string' })
  @IsOptional()
  uploadToken: string;
}

export class AccessDto {
  @ApiProperty({ description: '文件id' })
  @IsString({ message: '文件id 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '文件id 不能为空' })
  file_id: string;
}
