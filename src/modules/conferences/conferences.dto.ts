import { Content_Status_Enum } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/common/utils/reqListQuery';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class GetConferenceDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;
}
export class SaveConferenceDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiProperty({ description: '会议名称' })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: '会议缩写', type: String, nullable: true })
  @IsString({ message: 'abbreviation 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  abbreviation: string | null;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '举办时间', type: Date, nullable: true })
  @IsDateString({ message: ' conductedAt 类型错误, 正确类型 date' })
  @IsOptional()
  conductedAt: Date | null;

  @ApiPropertyOptional({ description: '举办结束时间(个别数据有)', type: Date, nullable: true })
  @IsDateString({ message: 'endedAt 类型错误, 正确类型 date' })
  @IsOptional()
  endedAt: Date | null;

  @ApiPropertyOptional({ description: '届', type: Date, nullable: true })
  @IsInt({ message: 'period 类型错误, 正确类型 string' })
  @IsOptional()
  period: number | null;

  @ApiPropertyOptional({
    description: '地点',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'location 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  location: string | null;

  @ApiPropertyOptional({ description: '会议简介/主题', type: String, nullable: true })
  @IsString({ message: 'introduction 类型错误, 正确类型 string' })
  @IsOptional()
  introduction: string | null;

  @ApiPropertyOptional({ description: '封面链接', type: String, nullable: true })
  @IsString({ message: 'coverUrl 类型错误, 正确类型 string' })
  @IsOptional()
  coverUrl: string | null;

  @ApiPropertyOptional({ description: '主领域', type: String,isArray:true, nullable: true })
  @IsArray({ message: 'field 类型错误, 正确类型 string' })
  @IsOptional()
  field: string[] | null;

  @ApiPropertyOptional({ description: '子领域', type: String,isArray:true, nullable: true })
  @IsArray({ message: 'minorField 类型错误, 正确类型 string' })
  @IsOptional()
  minorField: string[] | null;

  @ApiPropertyOptional({ description: '网站', type: String, nullable: true })
  @IsString({ message: 'website 类型错误, 正确类型 string' })
  @MaxLength(200)
  @IsOptional()
  website: string | null;

  @ApiPropertyOptional({ description: '联络人', type: String, nullable: true })
  @IsString({ message: 'contact 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  contact: string | null;

  @ApiPropertyOptional({ description: '联络人邮箱', type: String, nullable: true })
  @IsString({ message: 'email 类型错误, 正确类型 string' })
  @MaxLength(100)
  @IsOptional()
  email: string | null;

  @ApiPropertyOptional({ description: '举办单位', type: String, nullable: true })
  @IsString({ message: 'unit 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  unit: string | null;

  @ApiPropertyOptional({ description: '送稿截止时间', type: Date, nullable: true })
  @IsDateString({ message: 'deliveryEndedAt 类型错误, 正确类型 date' })
  @IsOptional()
  deliveryEndedAt: Date | null;

  @ApiPropertyOptional({ description: '提前注册截止时间', type: Date, nullable: true })
  @IsDateString({ message: 'preregisterEndedAt 类型错误, 正确类型 date' })
  @IsOptional()
  preregisterEndedAt: Date | null;

  @ApiPropertyOptional({ description: '注册截止时间', type: Date, nullable: true })
  @IsDateString({ message: 'registerEndedAt 类型错误, 正确类型 date' })
  @IsOptional()
  registerEndedAt: Date | null;
}
export class ListConferenceDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '会议名称,支持模糊搜索 如果为空则不传或者传null' })
  @IsString({ message: 'title 类型错误,正确类型 string' })
  @IsOptional()
  title: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiPropertyOptional({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  @IsOptional()
  columnId: string;
}
export class OperateConferencesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '状态' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  status: string;
}

export class RemoveConferencesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}
