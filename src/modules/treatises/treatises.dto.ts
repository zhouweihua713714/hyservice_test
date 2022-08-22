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
export class GetTreatiseDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;
}
export class SaveTreatiseDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiProperty({ description: '论文标题' })
  @IsString({ message: 'title 类型错误, 正确类型 string' })
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '发表时间', type: Date, nullable: true })
  @IsDateString({ message: 'deliveryAt 类型错误, 正确类型 date' })
  @IsOptional()
  deliveryAt: Date | null;

  @ApiPropertyOptional({
    description: '科研人员所属国家或地区',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'region 类型错误, 正确类型 string' })
  @MaxLength(200)
  @IsOptional()
  region: string | null;

  @ApiPropertyOptional({
    description: '发表途径:论文way_001,会议way_002,EDM会议way003,书way_004',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'channel 类型错误, 正确类型 string' })
  @IsOptional()
  channel: string | null;

  @ApiPropertyOptional({
    description: '语种',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'language 类型错误, 正确类型 string' })
  @IsOptional()
  language: string | null;

  @ApiPropertyOptional({
    description: '第一作者',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'author 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  author: string | null;

  @ApiPropertyOptional({
    description: '第一作者单位',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'authorUnit 类型错误, 正确类型 string' })
  @MaxLength(200)
  @IsOptional()
  authorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者', type: String, nullable: true })
  @IsString({ message: 'correspondingAuthor 类型错误, 正确类型 string' })
  @MaxLength(200)
  @IsOptional()
  correspondingAuthor: string | null;

  @ApiPropertyOptional({ description: '通讯作者单位', type: String, nullable: true })
  @IsString({ message: 'correspondingAuthorUnit 类型错误, 正确类型 string' })
  @MaxLength(200)
  @IsOptional()
  correspondingAuthorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者邮箱', type: String, nullable: true })
  @IsString({ message: 'correspondingAuthorEmail 类型错误, 正确类型 string' })
  @MaxLength(200)
  @IsOptional()
  correspondingAuthorEmail: string | null;

  @ApiPropertyOptional({ description: '其他作者', type: String, nullable: true })
  @IsString({ message: 'otherAuthor 类型错误, 正确类型 string' })
  @MaxLength(200)
  @IsOptional()
  otherAuthor: string | null;

  @ApiPropertyOptional({ description: '其他作者单位', type: String, nullable: true })
  @IsString({ message: 'otherAuthorUnit 类型错误, 正确类型 string' })
  @MaxLength(200)
  @IsOptional()
  otherAuthorUnit: string | null;

  
  @ApiPropertyOptional({ description: '文章主领域(大领域之间用“;”隔开)', type: String, nullable: true })
  @IsString({ message: 'field 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  field: string | null;

  @ApiPropertyOptional({ description: '文章子领域(大领域之间用“;”隔开)', type: String, nullable: true })
  @IsString({ message: 'minorField 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  minorField: string | null;

  @ApiPropertyOptional({ description: '文章类型', type: String, nullable: true })
  @IsString({ message: 'sort 类型错误, 正确类型 string' })
  @IsOptional()
  sort: string | null;

  @ApiPropertyOptional({ description: '摘要', type: String, nullable: true })
  @IsString({ message: 'abstract 类型错误, 正确类型 string' })
  @IsOptional()
  abstract: string | null;

  @ApiPropertyOptional({ description: '检索情况', type: String, nullable: true })
  @IsString({ message: 'search 类型错误, 正确类型 string' })
  @MaxLength(100)
  @IsOptional()
  search: string | null;

  @ApiPropertyOptional({ description: '参考文献', type: String, nullable: true })
  @IsString({ message: 'references 类型错误, 正确类型 string' })
  @IsOptional()
  references: string | null;

  @ApiPropertyOptional({ description: '引用情况(次数)', type: Number, nullable: true })
  @IsInt({ message: 'quote 类型错误, 正确类型 int' })
  @IsOptional()
  quote: number | null;

  @ApiPropertyOptional({ description: '所获得资助项目', type: String, nullable: true })
  @IsString({ message: 'fundedProject 类型错误, 正确类型 string' })
  @MaxLength(500)
  @IsOptional()
  fundedProject:string | null;

  @ApiPropertyOptional({ description: '论文链接', type: String, nullable: true })
  @IsString({ message: 'url 类型错误, 正确类型 string' })
  @MaxLength(200)
  @IsOptional()
  url: string | null;

  @ApiPropertyOptional({ description: '关键字', type: String, nullable: true })
  @IsString({ message: 'keyword 类型错误, 正确类型 string' })
  @MaxLength(300)
  @IsOptional()
  keyword: string | null;
  
}
export class ListTreatiseDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '论文名称,支持模糊搜索 如果为空则不传或者传null' })
  @IsString({ message: 'name 类型错误,正确类型 string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: '论文名称name 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiPropertyOptional({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  @IsOptional()
  columnId: string;
}
export class OperateTreatisesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '状态' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  status: string;
}

export class RemoveTreatisesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}
