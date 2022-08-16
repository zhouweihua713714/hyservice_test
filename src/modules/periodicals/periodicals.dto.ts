import { Content_Status_Enum } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/common/utils/reqListQuery';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsDecimal,
  IsEnum,
  IsIn,
  isInt,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { words } from 'lodash';

export class GetPeriodicalDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;
}
export class SavePeriodicalDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: '期刊名称name 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiProperty({ description: '期刊名称' })
  @IsString({ message: '期刊名称name 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  name: string;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '期刊类型 :期刊 periodical', type: String, nullable: true })
  @IsString({ message: 'type 类型错误, 正确类型 string' })
  @IsOptional()
  type: string | null;

  @ApiPropertyOptional({ description: '简介', type: String, nullable: true })
  @IsString({ message: 'string 类型错误, 正确类型 string' })
  @Length(1, 300, { message: '最大允许值为300' })
  @IsOptional()
  introduction: string | null;

  @ApiPropertyOptional({
    description: '语种,格式:[string,string]',
    type: String,
    isArray: true,
    nullable: true,
  })
  @IsArray({ message: 'language 类型错误, 正确类型 array' })
  @IsOptional()
  language: string[] | null;

  @ApiPropertyOptional({
    description: '地区(刊物国别),国别之间用;隔开',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'region 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  region: string | null;

  @ApiPropertyOptional({ description: '主领域(大领域之间用“;”隔开)', type: String, nullable: true })
  @IsString({ message: 'field 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  field: string | null;

  @ApiPropertyOptional({ description: '子领域(大领域之间用“;”隔开)', type: String, nullable: true })
  @IsString({ message: 'minorField 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  minorField: string | null;

  @ApiPropertyOptional({ description: '网址', type: String, nullable: true })
  @IsString({ message: 'url 类型错误, 正确类型 number' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  url: string | null;

  @ApiPropertyOptional({ description: '详细地址', type: String, nullable: true })
  @IsString({ message: 'address 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  address: string | null;

  @ApiPropertyOptional({ description: '检索情况', type: String, nullable: true })
  @IsString({ message: 'search 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  search: string | null;

  @ApiPropertyOptional({ description: '影响因子', type: Number, nullable: true })
  @IsDecimal({ message: 'impactFactor 类型错误, 正确类型 decimal' })
  @IsOptional()
  impactFactor: number | null;

  @ApiPropertyOptional({ description: '创刊时间', type: Date, nullable: true })
  @IsDateString({ message: 'establishedAt 类型错误, 正确类型 date' })
  @IsOptional()
  establishedAt: Date | null;

  @ApiPropertyOptional({ description: '出版商', type: String, nullable: true })
  @IsString({ message: 'publisher 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  publisher: string | null;

  @ApiPropertyOptional({ description: '刊发周期', type: String, nullable: true })
  @IsString({ message: 'period 类型错误, 正确类型 string' })
  @IsOptional()
  period: string | null;

  @ApiPropertyOptional({ description: '主管单位', type: String, nullable: true })
  @IsString({ message: 'manager 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  manager: string | null;

  @ApiPropertyOptional({ description: '主办单位', type: String, nullable: true })
  @IsString({ message: 'organizer 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  organizer: string | null;

  @ApiPropertyOptional({ description: 'ISSN,国际标准期刊编号', type: String, nullable: true })
  @IsString({ message: 'ISSN 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  ISSN: string | null;

  @ApiPropertyOptional({ description: 'CN,国内统一刊号', type: String, nullable: true })
  @IsString({ message: 'CN 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  CN: string | null;

  @ApiPropertyOptional({
    description:
      '中文核心期刊(北大) 类型:核心期刊journals_001,1级权威journals_002,2级权威journals_003 格式 [string,string]',
    type: String,
    isArray: true,
    nullable: true,
  })
  @IsArray({ message: 'pekingUnit 类型错误, 正确类型 array' })
  @IsOptional()
  pekingUnit: string[] | null;

  @ApiPropertyOptional({ description: '期刊荣誉', type: String, nullable: true })
  @IsString({ message: 'honor 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  honor: string | null;

  @ApiPropertyOptional({ description: '载文量', type: Number, nullable: true })
  @IsInt({ message: 'articleNumber 类型错误, 正确类型 int' })
  @IsOptional()
  articleNumber: number | null;

  @ApiPropertyOptional({ description: '引用量', type: Number, nullable: true })
  @IsInt({ message: 'quote 类型错误, 正确类型 int' })
  @IsOptional()
  quote: number | null;

  @ApiPropertyOptional({ description: '下载次数(统计CNKI中国知网)', type: Number, nullable: true })
  @IsInt({ message: 'downloads 类型错误, 正确类型 int' })
  @IsOptional()
  downloads: number | null;

  @ApiPropertyOptional({
    description: '学科分类(CNKI中国知网),格式:[string,string]',
    type: String,
    isArray: true,
    nullable: true,
  })
  @IsArray({ message: 'subject 类型错误, 正确类型 array' })
  @IsOptional()
  subject: string[] | null;

  @ApiPropertyOptional({ description: '综合影响因子', type: Number, nullable: true })
  @IsDecimal({ message: 'compositeImpactFactor 类型错误, 正确类型 decimal' })
  @IsOptional()
  compositeImpactFactor: number | null;

  @ApiPropertyOptional({ description: '审稿周期', type: String, nullable: true })
  @IsString({ message: 'checkPeriod 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  checkPeriod: string | null;

  @ApiPropertyOptional({ description: '发稿周期', type: String, nullable: true })
  @IsString({ message: 'releasePeriod 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  releasePeriod: string | null;

  @ApiPropertyOptional({ description: '录用率', type: Number, nullable: true })
  @IsDecimal({ message: 'recordRate 类型错误, 正确类型 decimal' })
  @IsOptional()
  recordRate: number | null;

  @ApiPropertyOptional({ description: '审稿费,单位:元', type: Number, nullable: true })
  @IsDecimal({ message: 'checkFee 类型错误, 正确类型 decimal' })
  @IsOptional()
  checkFee: number | null;

  @ApiPropertyOptional({ description: '版面费,单位:元', type: Number, nullable: true })
  @IsDecimal({ message: 'pageFee 类型错误, 正确类型 decimal' })
  @IsOptional()
  pageFee: number | null;

  @ApiPropertyOptional({ description: '稿酬,单位:元', type: Number, nullable: true })
  @IsDecimal({ message: 'reward 类型错误, 正确类型 decimal' })
  @IsOptional()
  reward: number | null;

  @ApiPropertyOptional({ description: '封面链接', type: String, nullable: true })
  @IsString({ message: 'coverUrl 类型错误, 正确类型 string' })
  @IsOptional()
  coverUrl: string | null;

  @ApiPropertyOptional({ description: '引用分', type: Number, nullable: true })
  @IsDecimal({ message: 'citeScore 类型错误, 正确类型 decimal' })
  @IsOptional()
  citeScore: number | null;

  @ApiPropertyOptional({ description: '被引用率', type: Number, nullable: true })
  @IsInt({ message: 'citeRate 类型错误, 正确类型 int' })
  @IsOptional()
  citeRate: number | null;
}
export class ListPeriodicalDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '期刊名称,支持模糊搜索 如果为空则不传或者传null' })
  @IsString({ message: 'name 类型错误,正确类型 string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: '期刊名称name 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiPropertyOptional({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  @IsOptional()
  columnId: string;
}
export class OperatePeriodicalsDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '状态' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  status: string;
}

export class RemovePeriodicalsDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}

