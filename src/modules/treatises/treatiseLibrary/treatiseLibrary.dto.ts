import { Content_Status_Enum } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/common/utils/reqListQuery';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class GetTreatiseLibraryDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;

  @ApiPropertyOptional({ description: '是否C端请求:是 true' })
  @IsBoolean({ message: 'flag 类型错误, 正确类型 boolean' })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  flag: boolean;
}
export class SaveTreatiseLibraryDto {
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
  title: string;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '发表时间', type: Date, nullable: true })
  @IsDateString({ message: 'deliveryAt 类型错误, 正确类型 date' })
  @IsOptional()
  deliveryAt: Date | null;

  @ApiPropertyOptional({
    description: '第一作者/作者全称',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'author 类型错误, 正确类型 string' })
  @IsOptional()
  author: string | null;

  @ApiPropertyOptional({
    description: '第一作者单位',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'authorUnit 类型错误, 正确类型 string' })
  @IsOptional()
  authorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者', type: String, nullable: true })
  @IsString({ message: 'correspondingAuthor 类型错误, 正确类型 string' })
  @IsOptional()
  correspondingAuthor: string | null;

  @ApiPropertyOptional({ description: '通讯作者单位', type: String, nullable: true })
  @IsString({ message: 'correspondingAuthorUnit 类型错误, 正确类型 string' })
  @IsOptional()
  correspondingAuthorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者邮箱', type: String, nullable: true })
  @IsString({ message: 'correspondingAuthorEmail 类型错误, 正确类型 string' })
  @IsOptional()
  correspondingAuthorEmail: string | null;

  @ApiPropertyOptional({ description: '其他作者', type: String, nullable: true })
  @IsString({ message: 'otherAuthor 类型错误, 正确类型 string' })
  @IsOptional()
  otherAuthor: string | null;

  @ApiPropertyOptional({ description: '其他作者单位', type: String, nullable: true })
  @IsString({ message: 'otherAuthorUnit 类型错误, 正确类型 string' })
  @IsOptional()
  otherAuthorUnit: string | null;

  @ApiPropertyOptional({
    description: '文章主领域(大领域之间用“;”隔开)',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'field 类型错误, 正确类型 string' })
  @IsOptional()
  field: string | null;

  @ApiPropertyOptional({
    description: '文章子领域(大领域之间用“;”隔开)',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'minorField 类型错误, 正确类型 string' })
  @IsOptional()
  minorField: string | null;

  @ApiPropertyOptional({
    description: '杂志文章主领域(大领域之间用“;”隔开)',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'magazineField 类型错误, 正确类型 string' })
  @IsOptional()
  magazineField: string | null;

  @ApiPropertyOptional({
    description: '杂志文章子领域(大领域之间用“;”隔开)',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'magazineMinorField 类型错误, 正确类型 string' })
  @IsOptional()
  magazineMinorField: string | null;

  @ApiPropertyOptional({ description: '分类', type: String, isArray: true, nullable: true })
  @IsString({ message: 'sort 类型错误, 正确类型 string' })
  @IsOptional()
  sort: string | null;

  @ApiPropertyOptional({ description: '摘要', type: String, nullable: true })
  @IsString({ message: 'abstract 类型错误, 正确类型 string' })
  @IsOptional()
  abstract: string | null;

  @ApiPropertyOptional({ description: '论文链接', type: String, nullable: true })
  @IsString({ message: 'url 类型错误, 正确类型 string' })
  @IsOptional()
  url: string | null;

  @ApiPropertyOptional({ description: '期刊/会议名', type: String, nullable: true })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @IsOptional()
  name: string | null;

  @ApiPropertyOptional({ description: '关键字', type: String, nullable: true })
  @IsString({ message: 'keyword 类型错误, 正确类型 string' })
  @IsOptional()
  keyword: string | null;

  @ApiPropertyOptional({ description: '期刊名称', type: String, nullable: true })
  @IsString({ message: 'periodical 类型错误, 正确类型 string' })
  @IsOptional()
  periodical: string | null;
}
export class ListTreatiseLibraryDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '论文名称,支持模糊搜索 如果为空则不传或者传null' })
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
export class OperateTreatiseLibrariesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '状态' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  status: string;
}

export class RemoveTreatiseLibrariesDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}

export class ListComplexTreatiseLibraryDto extends PickType(ReqListQuery, [
  'page',
  'size',
] as const) {
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

  @ApiPropertyOptional({ description: '分类', type: String, nullable: true })
  @IsString({ message: 'sort 类型错误, 正确类型 string' })
  @IsOptional()
  sort: string | null;
}

export class RecommendTreatiseLibrariesDto {
  @ApiPropertyOptional({ description: '论文id' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;
}
export class GetTreatiseLibraryCountBySortAndYearDto {
  @ApiProperty({ description: '精选文库的栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;
}

