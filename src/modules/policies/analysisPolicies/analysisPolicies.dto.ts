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

export class GetAnalysisPolicyDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;

  @ApiPropertyOptional({ description: '是否C端请求:是 true' })
  @IsBoolean({ message: 'flag 类型错误, 正确类型 boolean' })
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  flag: boolean;
}
export class SaveAnalysisPolicyDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiProperty({ description: '政策解读标题' })
  @IsString({ message: 'title 类型错误, 正确类型 string' })
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '文章来源', type: String, nullable: true })
  @IsString({ message: 'source 类型错误, 正确类型 string' })
  @IsOptional()
  source: string | null;

  @ApiPropertyOptional({ description: '正文', type: String, nullable: true })
  @IsString({ message: 'content 类型错误, 正确类型 string' })
  @IsOptional()
  content: string | null;

  @ApiPropertyOptional({ description: '链接', type: String, nullable: true })
  @IsString({ message: 'url 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(200)
  url: string | null;

  @ApiPropertyOptional({ description: '发布时间', type: Date, nullable: true })
  @IsDateString({ message: 'announcedAt 类型错误, 正确类型 date' })
  @IsOptional()
  announcedAt: Date | null;
}
export class ListAnalysisPolicyDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '政策名称,支持模糊搜索 如果为空则不传或者传null' })
  @IsString({ message: 'name 类型错误,正确类型 string' })
  @IsOptional()
  title: string;

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
export class OperateAnalysisPoliciesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '状态' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  status: string;
}

export class RemoveAnalysisPoliciesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}

export class ListComplexAnalysisPolicyDto extends PickType(ReqListQuery, [
  'page',
  'size',
] as const) {
  @ApiPropertyOptional({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  @IsOptional()
  columnId: string;
}

export class RecommendAnalysisPoliciesDto {
  @ApiProperty({ description: '政策id' })
  @IsString({ message: '政策id 类型错误, 正确类型 string' })
  id: string;
}
