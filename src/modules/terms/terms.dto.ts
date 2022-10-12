import { Content_Status_Enum } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/common/utils/reqListQuery';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class GetTermDetailDto {
  @ApiProperty({ description: 'id' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;

  @ApiPropertyOptional({ description: '是否C端请求:是 true' })
  @IsBoolean({ message: 'flag 类型错误, 正确类型 boolean' })
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  flag: boolean;
}
export class SaveTermDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: 'status类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiProperty({ description: '项目名称' })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '项目类型', type: String, nullable: true })
  @IsString({ message: 'type 类型错误, 正确类型 string' })
  @IsOptional()
  type: string | null;

  @ApiPropertyOptional({ description: '省份code', type: String, nullable: true })
  @IsString({ message: 'string 类型错误, 正确类型 string' })
  @IsOptional()
  province: string | null;

  @ApiPropertyOptional({ description: '依托单位', type: String, nullable: true })
  @IsString({ message: 'unit 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  unit: string | null;

  @ApiPropertyOptional({ description: '项目负责人', type: String, nullable: true })
  @IsString({ message: 'principal 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(50)
  principal: string | null;

  @ApiPropertyOptional({ description: '项目编号', type: String, nullable: true })
  @IsString({ message: 'termNumber 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(50)
  termNumber: string | null;

  @ApiPropertyOptional({ description: '关键词', type: String, nullable: true })
  @IsString({ message: 'keyword 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(50)
  keyword: string | null;

  @ApiPropertyOptional({ description: '金额(万元,保留到整数)', type: Number, nullable: true })
  @IsInt({ message: 'money 类型错误, 正确类型 number' })
  @IsOptional()
  money: number | null;

  @ApiPropertyOptional({ description: '学部', type: String, nullable: true })
  @IsString({ message: 'department 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(50)
  department: string | null;

  @ApiPropertyOptional({ description: '学科分类id', type: String, nullable: true })
  @IsString({ message: 'subject 类型错误, 正确类型 string' })
  @IsOptional()
  subject: string | null;

  @ApiPropertyOptional({ description: '学科代码', type: String, nullable: true })
  @IsString({ message: 'subjectNo 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  subjectNo: string | null;

  @ApiPropertyOptional({ description: '批准年份', type: Date, nullable: true })
  @IsDateString({ message: 'authorizedAt 类型错误, 正确类型 date' })
  @IsOptional()
  authorizedAt: Date | null;

  @ApiPropertyOptional({ description: '执行开始时间', type: Date, nullable: true })
  @IsDateString({ message: 'startedAt 类型错误, 正确类型 date' })
  @IsOptional()
  startedAt: Date | null;

  @ApiPropertyOptional({
    description: '执行开始时间,前端需要判断结束时间>开始时间',
    type: Date,
    nullable: true,
  })
  @IsDateString({ message: 'endedAt 类型错误, 正确类型 date', type: Date, nullable: true })
  @IsOptional()
  endedAt: Date | null;
}
export class ListTermDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '项目名称,支持模糊搜索 如果为空则不传或者传null' })
  @IsString({ message: 'name 类型错误,正确类型 string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: '项目名称name 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiPropertyOptional({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  @IsOptional()
  columnId: string;
}
export class OperateTermsDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '状态' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  status: string;
}

export class RemoveTermsDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}

export class ListComplexTermDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({
    description: '关键词,多标签需要分号隔开才能进行分词在进行模糊搜索 如果为空则不传或者传null',
  })
  @IsString({ message: 'keyword 类型错误,正确类型 string' })
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  @IsOptional()
  columnId: string;

  @ApiPropertyOptional({ description: '项目类型' })
  @IsString({ message: '项目类型type 类型错误, 正确类型 string' })
  @IsOptional()
  type: string;

  @ApiPropertyOptional({ description: '批准年份' })
  @IsDateString({ message: 'year 类型错误, 正确类型 number' })
  @IsOptional()
  authorizedAt: Date;

  @ApiPropertyOptional({ description: '依托单位,模糊搜索' })
  @IsString({ message: 'unit类型错误, 正确类型 string' })
  @IsOptional()
  unit: string;

  @ApiPropertyOptional({ description: '项目负责人,模糊搜索' })
  @IsString({ message: 'principal类型错误, 正确类型 string' })
  @IsOptional()
  principal: string;
}

export class GetTermCountByUnitDto {
  @ApiProperty({
    description: '栏目id,这里栏目id直接对应统计相关的栏目的图表不能出错否则数据统计不对齐',
  })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;
}

export class GetTermCountByTypeDto {
  @ApiProperty({
    description: '栏目id,这里栏目id直接对应统计相关的栏目的图表不能出错否则数据统计不对齐',
  })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;
}
export class GetTermCountByYearDto {
  @ApiProperty({
    description: '栏目id,这里栏目id直接对应统计相关的栏目的图表不能出错否则数据统计不对齐',
  })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;
}

export class GetTermPercentBySubjectDto {
  @ApiProperty({
    description: '栏目id,这里栏目id直接对应统计相关的栏目的图表不能出错否则数据统计不对齐',
  })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;
}
