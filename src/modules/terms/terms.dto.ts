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
} from 'class-validator';

export class GetTermDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;
}
export class SaveTermDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: '项目名称name 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiProperty({ description: '项目名称' })
  @IsString({ message: '项目名称name 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  name: string;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '项目类型' })
  @IsString({ message: 'type 类型错误, 正确类型 string' })
  @IsOptional()
  type: string;

  @ApiPropertyOptional({ description: '省份code' })
  @IsString({ message: 'string 类型错误, 正确类型 string' })
  @IsOptional()
  province: string;

  @ApiPropertyOptional({ description: '依托单位' })
  @IsString({ message: 'unit 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  unit: string;

  @ApiPropertyOptional({ description: '项目负责人' })
  @IsString({ message: 'principal 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  principal: string;

  @ApiPropertyOptional({ description: '项目编号' })
  @IsString({ message: 'termNumber 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  termNumber: string;

  @ApiPropertyOptional({ description: '关键词' })
  @IsString({ message: 'keyword 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  keyword: string;

  @ApiPropertyOptional({ description: '金额(万元,保留到整数)' })
  @IsInt({ message: 'money 类型错误, 正确类型 number' })
  money: number;

  @ApiPropertyOptional({ description: '学部' })
  @IsString({ message: 'department 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  department: string;

  @ApiPropertyOptional({ description: '学科分类id' })
  @IsString({ message: 'subject 类型错误, 正确类型 string' })
  @IsOptional()
  subject: string;

  @ApiPropertyOptional({ description: '学科代码' })
  @IsString({ message: 'subjectNo 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  subjectNo: string;

  @ApiPropertyOptional({ description: '批准年份' })
  @IsDateString({ message: 'authorizedAt 类型错误, 正确类型 date' })
  @IsOptional()
  authorizedAt: Date;

  @ApiPropertyOptional({ description: '执行开始时间' })
  @IsDateString({ message: 'startedAt 类型错误, 正确类型 date' })
  @IsOptional()
  startedAt: Date;

  @ApiPropertyOptional({ description: '执行开始时间,前端需要判断结束时间>开始时间' })
  @IsDateString({ message: 'endedAt 类型错误, 正确类型 date' })
  @IsOptional()
  endedAt: Date;
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
