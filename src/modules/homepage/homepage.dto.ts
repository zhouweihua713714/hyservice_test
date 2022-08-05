import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';


export class SetHomepageDto {
  // @ApiPropertyOptional({ description: 'id,有则传过来无则不传' })
  // @IsString({ message: 'id 类型错误, 正确类型 string' })
  // @IsOptional()
  // id: string | null;

  @ApiProperty({ description: '站点名称' })
  @IsString({ message: '站点名称name 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  name: string;

  @ApiProperty({ description: '网站备案号' })
  @IsString({ message: 'IPC 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  IPC: string;

  @ApiPropertyOptional({ description: 'CDN地址' })
  @IsString({ message: 'CDN 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  CDN: string | null;

  @ApiPropertyOptional({ description: '版本号' })
  @IsString({ message: 'versionNo 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  versionNo: string | null;

  @ApiPropertyOptional({ description: '黑名单:ip分号隔开' })
  @IsString({ message: 'blacklist 类型错误, 正确类型 string' })
  @Length(1, 100, { message: '最大允许值为100' })
  @IsOptional()
  blacklist: string | null;

  @ApiProperty({ description: '标题' })
  @IsString({ message: 'title 类型错误, 正确类型 string' })
  @Length(1, 20, { message: '最大允许值为20' })
  title: string;

  @ApiPropertyOptional({ description: '首页描述' })
  @IsString({ message: 'description 类型错误, 正确类型 string' })
  @Length(1, 20, { message: '最大允许值为20' })
  description: string | null;

  @ApiProperty({ description: '版权所有' })
  @IsString({ message: 'ownership 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  ownership: string;

  @ApiProperty({ description: '底部描述' })
  @IsString({ message: 'bottomDescription 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  bottomDescription: string;

  @ApiProperty({ description: '友情链接 数组[{url:,title:xxx }]' })
  @IsArray({ message: 'links 类型错误, 正确类型 array' })
  links: object;

  @ApiProperty({ description: 'logo' })
  @IsString({ message: 'logo 类型错误, 正确类型 string' })
  logo: string;

  @ApiPropertyOptional({ description: '手机端二维码' })
  @IsString({ message: 'qrCode 类型错误, 正确类型 string' })
  @IsOptional()
  qrCode: string | null;
}
