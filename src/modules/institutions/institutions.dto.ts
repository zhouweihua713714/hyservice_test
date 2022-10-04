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
  MaxLength,
} from 'class-validator';
export class GetInstitutionDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;

  @ApiPropertyOptional({ description: '是否C端请求:是 true' })
  @IsBoolean({ message: 'flag 类型错误, 正确类型 boolean' })
  @IsOptional()
  flag: boolean;
}
export class SaveInstitutionDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiProperty({ description: '机构名称' })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ description: '外文机构名称', nullable: true, type: String })
  @IsString({ message: 'foreignName 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(200)
  foreignName: string | null;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '详细地址', type: String, nullable: true })
  @IsString({ message: ' address 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(200)
  address: string | null;

  @ApiPropertyOptional({ description: '简介', type: String, nullable: true })
  @IsString({ message: 'introduction 类型错误, 正确类型 string' })
  @IsOptional()
  introduction: string | null;

  @ApiPropertyOptional({ description: '网站', type: String, nullable: true })
  @IsString({ message: 'coverUrl 类型错误, 正确类型 string' })
  @IsOptional()
  @MaxLength(200)
  website: string | null;

  @ApiPropertyOptional({ description: '主办单位', type: String, nullable: true })
  @IsString({ message: 'unit 类型错误, 正确类型 string' })
  @MaxLength(100)
  @IsOptional()
  unit: string | null;

  @ApiPropertyOptional({ description: '主领域', type: String, isArray: true, nullable: true })
  @IsArray({ message: 'field 类型错误, 正确类型 string' })
  @IsOptional()
  field: string[] | null;

  @ApiPropertyOptional({ description: '子领域', type: String, isArray: true, nullable: true })
  @IsArray({ message: 'minorField 类型错误, 正确类型 string' })
  @IsOptional()
  minorField: string[] | null;

  @ApiPropertyOptional({ description: '经度:360.000000', type: Number, nullable: true })
  @IsNumber({ maxDecimalPlaces: 6 }, { message: 'longitude 类型错误, 正确类型 decimal' })
  @IsOptional()
  longitude: number | null;

  @ApiPropertyOptional({ description: '纬度:360.000000', type: Number, nullable: true })
  @IsNumber({ maxDecimalPlaces: 6 }, { message: 'latitude 类型错误, 正确类型 decimal' })
  @IsOptional()
  latitude: number | null;

  @ApiPropertyOptional({ description: '图片链接', type: String, nullable: true })
  @IsString({ message: 'url 类型错误, 正确类型 string' })
  @IsOptional()
  url: string | null;
}
export class ListInstitutionDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '机构名称,支持模糊搜索 如果为空则不传或者传null' })
  @IsString({ message: 'name 类型错误,正确类型 string' })
  @IsOptional()
  name: string;

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
export class OperateInstitutionsDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '状态' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  status: string;
}

export class RemoveInstitutionsDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}
export class ListComplexInstitutionDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({
    description: '关键词,多标签需要分号隔开才能进行分词在进行模糊搜索 如果为空则不传或者传null',
  })
  @IsString({ message: 'keyword 类型错误,正确类型 string' })
  @IsOptional()
  keyword: string;
}

export class RecommendInstitutionsDto {
  @ApiProperty({ description: '机构id' })
  @IsString({ message: '机构id 类型错误, 正确类型 string' })
  id: string;
}

