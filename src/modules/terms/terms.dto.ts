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
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  unit: string | null;

  @ApiPropertyOptional({ description: '项目负责人', type: String, nullable: true })
  @IsString({ message: 'principal 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  principal: string | null;

  @ApiPropertyOptional({ description: '项目编号', type: String, nullable: true })
  @IsString({ message: 'termNumber 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  termNumber: string | null;

  @ApiPropertyOptional({ description: '关键词', type: String, nullable: true })
  @IsString({ message: 'keyword 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  keyword: string | null;

  @ApiPropertyOptional({ description: '金额(万元,保留到整数)', type: String, nullable: true })
  @IsInt({ message: 'money 类型错误, 正确类型 number' })
  money: number | null;

  @ApiPropertyOptional({ description: '学部', type: String, nullable: true })
  @IsString({ message: 'department 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  department: string | null;

  @ApiPropertyOptional({ description: '学科分类id', type: String, nullable: true })
  @IsString({ message: 'subject 类型错误, 正确类型 string' })
  @IsOptional()
  subject: string | null;

  @ApiPropertyOptional({ description: '学科代码', type: String, nullable: true })
  @IsString({ message: 'subjectNo 类型错误, 正确类型 string' })
  @Length(1, 50, { message: '最大允许值为50' })
  @IsOptional()
  subjectNo: string | null;

  @ApiPropertyOptional({ description: '批准年份', type: String, nullable: true })
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
