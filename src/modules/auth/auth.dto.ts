import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class signInDto {
  @ApiProperty({ description: '用户手机号' })
  @IsString({ message: 'mobile 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsMobilePhone('zh-CN', { message: '手机号不合法' })
  mobile: string;

  @ApiProperty({ description: '密码, 8~20位大小写字母或者数字' })
  @IsString({ message: 'password 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(8, 20, { message: '密码不合法, 请输入8~20位大小写字母或者数字' })
  password: string;

  @ApiPropertyOptional({ description: '登录平台' })
  @IsString({ message: 'provider 类型错误, 正确类型 string' })
  @MaxLength(20)
  @IsOptional()
  provider: string;
}
export class signUpDto {
  @ApiProperty({ description: '用户手机号' })
  @IsString({ message: 'mobile 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsMobilePhone('zh-CN', { message: '手机号不合法' })
  mobile: string;

  @ApiProperty({ description: '验证码' })
  @IsString({ message: 'code 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '验证码不能为空' })
  @MaxLength(6)
  code: string;

  @ApiProperty({ description: '密码, 8~20位大小写字母或者数字' })
  @IsString({ message: 'password 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(8, 20, { message: '密码不合法, 请输入8~20位大小写字母或者数字' })
  password: string;
}
export class ModifyPasswordDto {
  @ApiProperty({ description: '用户手机号' })
  @IsString({ message: 'mobile 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsMobilePhone('zh-CN', { message: '手机号不合法' })
  mobile: string;

  @ApiProperty({ description: '原密码, 8~20位大小写字母或者数字' })
  @IsString({ message: 'oldPassword 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '原密码不能为空' })
  @Length(8, 20, { message: '密码不合法, 请输入8~20位大小写字母或者数字' })
  oldPassword: string;

  @ApiProperty({ description: '新密码, 8~20位大小写字母或者数字' })
  @IsString({ message: 'newPassword 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @Length(8, 20, { message: '密码不合法, 请输入8~20位大小写字母或者数字' })
  newPassword: string;
}
export class ResetPasswordDto {
  @ApiProperty({ description: '用户手机号' })
  @IsString({ message: 'mobile 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsMobilePhone('zh-CN', { message: '手机号不合法' })
  mobile: string;

  @ApiProperty({ description: '验证码' })
  @IsString({ message: 'code 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '验证码不能为空' })
  @MaxLength(6)
  code: string;

  @ApiProperty({ description: '新密码, 8~20位大小写字母或者数字' })
  @IsString({ message: 'newPassword 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @Length(8, 20, { message: '密码不合法, 请输入8~20位大小写字母或者数字' })
  password: string;
}

export class GenCodeDto {
  @ApiProperty({ description: '用户手机号' })
  @IsString({ message: 'mobile 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsMobilePhone('zh-CN', { message: '手机号不合法' })
  mobile: string;
}
