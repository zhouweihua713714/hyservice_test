import { Content_Status_Enum } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/common/utils/reqListQuery';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class GetPolicyDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;

  @ApiPropertyOptional({ description: '是否C端请求:是 true' })
  @IsBoolean({ message: 'flag 类型错误, 正确类型 boolean' })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  flag: boolean;
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
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '政策类型', type: String, nullable: true })
  @IsString({ message: 'type 类型错误, 正确类型 string' })
  @IsOptional()
  type: string | null;

  @ApiPropertyOptional({ description: '主题类型', type: String, nullable: true })
  @IsString({ message: 'topicType 类型错误, 正确类型 string' })
  @IsOptional()
  topicType: string | null;

  @ApiPropertyOptional({
    description: '政策层级:国家级policy_level_001',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'level 类型错误, 正确类型 string' })
  @IsOptional()
  level: string | null;

  @ApiPropertyOptional({ description: '发布政策/部门', type: String, nullable: true })
  @IsString({ message: 'institution 类型错误, 正确类型 string' })
  @MaxLength(200)
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
  @MaxLength(100)
  keyword: string | null;

  @ApiPropertyOptional({ description: '政策发布时间(出台时间)', type: Date, nullable: true })
  @IsDateString({ message: 'announcedAt 类型错误, 正确类型 date' })
  @IsOptional()
  announcedAt: Date | null;

  @ApiPropertyOptional({
    description: '政策发布时间不为空，该字段不能为空,日期格式:year、month、date',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'picker 类型错误, 正确类型 string' })
  @IsOptional()
  picker: string | null;

  @ApiPropertyOptional({ description: '简介', type: String, nullable: true })
  @IsString({ message: 'introduction 类型错误, 正确类型 string' })
  @IsOptional()
  introduction: string | null;

  @ApiPropertyOptional({ description: '正文', type: String, nullable: true })
  @IsString({ message: 'content 类型错误, 正确类型 string' })
  @IsOptional()
  content: string | null;

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

export class ListComplexPolicyDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({
    description: '关键词,多标签需要分号隔开才能进行分词在进行模糊搜索 如果为空则不传或者传null',
  })
  @IsString({ message: 'keyword 类型错误,正确类型 string' })
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional({ description: '政策类型', type: String, nullable: true })
  @IsString({ message: 'type 类型错误, 正确类型 string' })
  @IsOptional()
  type: string | null;

  @ApiPropertyOptional({ description: '主题类型', type: String })
  @IsString({ message: 'topicType 类型错误, 正确类型 string' })
  @IsOptional()
  topicType: string;

  @ApiPropertyOptional({
    description: '教育层次:基础教育basic,高等教育higher,职业教育vocation',
  })
  @IsString({ message: 'educationLevel 类型错误, 正确类型 string' })
  @IsOptional()
  educationLevel: string;

  @ApiPropertyOptional({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  @IsOptional()
  columnId: string;
}

export class RecommendPoliciesDto {
  @ApiProperty({ description: '政策id' })
  @IsString({ message: '政策id 类型错误, 正确类型 string' })
  id: string;
}
