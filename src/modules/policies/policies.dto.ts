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
  Length,
  MaxLength,
} from 'class-validator';

export class GetPolicyDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;
}
export class SavePolicyDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiProperty({ description: '政策名称' })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '政策类型', type: String, nullable: true })
  @IsString({ message: 'type 类型错误, 正确类型 string' })
  @IsOptional()
  type: string | null;

  @ApiPropertyOptional({
    description: '政策层级:国家级policy_level_001',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'level 类型错误, 正确类型 string' })
  @IsOptional()
  level: string | null;

  @ApiPropertyOptional({ description: '发布机构/部门', type: String, nullable: true })
  @IsString({ message: 'institution 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  institution: string | null;

  @ApiPropertyOptional({ description: '发文号', type: String, nullable: true })
  @IsString({ message: 'announceNo 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(50)
  announceNo: string | null;

  @ApiPropertyOptional({
    description: '教育层次:基础教育basic,高等教育higher,职业教育vocation,格式:[basic,higher]',
    nullable: true,
    type: String,
    isArray: true,
  })
  @IsArray({ message: 'educationLevel 类型错误, 正确类型 array' })
  @IsOptional()
  educationLevel: string[] | null;

  @ApiPropertyOptional({ description: '关键字', type: String, nullable: true })
  @IsString({ message: 'keyword 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(50)
  keyword: string | null;

  @ApiPropertyOptional({ description: '政策发布时间(出台时间)', type: Date, nullable: true })
  @IsDateString({ message: 'announcedAt 类型错误, 正确类型 date' })
  @IsOptional()
  announcedAt: Date | null;

  @ApiPropertyOptional({ description: '简介', type: String, nullable: true })
  @IsString({ message: 'introduction 类型错误, 正确类型 string' })
  @IsOptional()
  introduction: string | null;

  @ApiPropertyOptional({ description: '政策来源(网址)', type: String, nullable: true })
  @IsString({ message: 'url 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(200)
  url: string | null;

  @ApiPropertyOptional({
    description: '国家',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'region 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  region: string | null;
}
export class ListPolicyDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '政策名称,支持模糊搜索 如果为空则不传或者传null' })
  @IsString({ message: 'name 类型错误,正确类型 string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: '政策名称name 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiPropertyOptional({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  @IsOptional()
  columnId: string;
}
export class OperatePoliciesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '状态' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  status: string;
}

export class RemovePoliciesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}
