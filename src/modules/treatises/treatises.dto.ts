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
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class GetTreatiseDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;

  @ApiPropertyOptional({ description: '是否C端请求:是 true' })
  @IsBoolean({ message: 'flag 类型错误, 正确类型 boolean' })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  flag: boolean;
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
  @IsOptional()
  region: string | null;

  @ApiPropertyOptional({
    description: '发表途径:期刊way_001,会议way_002,EDM会议way003,书way_004',
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
    description: '第一作者/作者全称',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'author 类型错误, 正确类型 string' })
  @IsOptional()
  author: string | null;

  @ApiPropertyOptional({ description: '作者缩写', type: String, nullable: true })
  @IsString({ message: 'authorAbbreviation 类型错误, 正确类型 string' })
  @IsOptional()
  authorAbbreviation: string | null;

  @ApiPropertyOptional({
    description: '第一作者单位',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'authorUnit 类型错误, 正确类型 string' })
  @IsOptional()
  authorUnit: string | null;

  @ApiPropertyOptional({ description: '作者地址', type: String, nullable: true })
  @IsString({ message: 'authorAddress 类型错误, 正确类型 string' })
  @IsOptional()
  authorAddress: string | null;

  @ApiPropertyOptional({ description: '通讯作者', type: String, nullable: true })
  @IsString({ message: 'correspondingAuthor 类型错误, 正确类型 string' })
  @IsOptional()
  correspondingAuthor: string | null;

  @ApiPropertyOptional({ description: '通讯作者单位', type: String, nullable: true })
  @IsString({ message: 'correspondingAuthorUnit 类型错误, 正确类型 string' })
  @IsOptional()
  correspondingAuthorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者地址', type: String, nullable: true })
  @IsString({ message: 'correspondingAuthorAddress 类型错误, 正确类型 string' })
  @IsOptional()
  correspondingAuthorAddress: string | null;

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

  @ApiPropertyOptional({ description: '文章类型', type: String, isArray: true, nullable: true })
  @IsArray({ message: 'sort 类型错误, 正确类型 string' })
  @IsOptional()
  sort: string[] | null;

  @ApiPropertyOptional({ description: '摘要', type: String, nullable: true })
  @IsString({ message: 'abstract 类型错误, 正确类型 string' })
  @IsOptional()
  abstract: string | null;

  @ApiPropertyOptional({ description: '检索情况', type: String, nullable: true })
  @IsString({ message: 'search 类型错误, 正确类型 string' })
  @IsOptional()
  search: string | null;

  @ApiPropertyOptional({ description: '参考文献', type: String, nullable: true })
  @IsString({ message: 'references 类型错误, 正确类型 string' })
  @IsOptional()
  references: string | null;

  @ApiPropertyOptional({ description: '参考文献量', type: Number, nullable: true })
  @IsInt({ message: 'referencesNumber 类型错误, 正确类型 string' })
  @IsOptional()
  referencesNumber: number | null;

  @ApiPropertyOptional({ description: '引用情况(次数)/被引频合计', type: Number, nullable: true })
  @IsInt({ message: 'quote 类型错误, 正确类型 int' })
  @IsOptional()
  quote: number | null;

  @ApiPropertyOptional({ description: '所获得资助项目', type: String, nullable: true })
  @IsString({ message: 'fundedProject 类型错误, 正确类型 string' })
  @IsOptional()
  fundedProject: string | null;

  @ApiPropertyOptional({ description: '论文链接', type: String, nullable: true })
  @IsString({ message: 'url 类型错误, 正确类型 string' })
  @IsOptional()
  url: string | null;

  @ApiPropertyOptional({ description: '期刊/会议名', type: String, nullable: true })
  @IsString({ message: 'url 类型错误, 正确类型 string' })
  @IsOptional()
  name: string | null;

  @ApiPropertyOptional({ description: '关键字', type: String, nullable: true })
  @IsString({ message: 'keyword 类型错误, 正确类型 string' })
  @IsOptional()
  keyword: string | null;

  @ApiPropertyOptional({ description: '出版商', type: String, nullable: true })
  @IsString({ message: 'publisher 类型错误, 正确类型 string' })
  @IsOptional()
  publisher: string | null;

  @ApiPropertyOptional({ description: '出版商地址', type: String, nullable: true })
  @IsString({ message: 'publisherAddress 类型错误, 正确类型 string' })
  @IsOptional()
  publisherAddress: string | null;

  @ApiPropertyOptional({ description: '期刊名称', type: String, nullable: true })
  @IsString({ message: 'periodical 类型错误, 正确类型 string' })
  @IsOptional()
  periodical: string | null;

  @ApiPropertyOptional({ description: '期刊简称', type: String, nullable: true })
  @IsString({ message: 'periodicalAbbreviation 类型错误, 正确类型 string' })
  @IsOptional()
  periodicalAbbreviation: string | null;

  @ApiPropertyOptional({ description: '出版年', type: Date, nullable: true })
  @IsDateString({ message: 'releasedAt 类型错误, 正确类型 string' })
  @IsOptional()
  releasedAt: Date | null;

  @ApiPropertyOptional({ description: 'doi 论文唯一id', type: String, nullable: true })
  @IsString({ message: 'doi 类型错误, 正确类型 string' })
  @IsOptional()
  doi: string | null;

  @ApiPropertyOptional({ description: '研究方向', type: String, nullable: true })
  @IsString({ message: 'studyField 类型错误, 正确类型 string' })
  @IsOptional()
  studyField: string | null;

  @ApiPropertyOptional({ description: '一级主题', type: String, nullable: true })
  @IsString({ message: 'topic 类型错误, 正确类型 string' })
  @IsOptional()
  topic: string | null;

  @ApiPropertyOptional({ description: '二级主题', type: String, nullable: true })
  @IsString({ message: 'childTopic 类型错误, 正确类型 string' })
  @IsOptional()
  childTopic: string | null;

  @ApiPropertyOptional({ description: '研究目标', type: String, nullable: true })
  @IsString({ message: 'goal 类型错误, 正确类型 string' })
  @IsOptional()
  goal: string | null;

  @ApiPropertyOptional({ description: '研究对象', type: String, nullable: true })
  @IsString({ message: 'object 类型错误, 正确类型 string' })
  @IsOptional()
  object: string | null;

  @ApiPropertyOptional({ description: '研究范式', type: String, nullable: true })
  @IsString({ message: 'paradigm 类型错误, 正确类型 string' })
  @IsOptional()
  paradigm: string | null;

  @ApiPropertyOptional({ description: '数据分析方式', type: String, nullable: true })
  @IsString({ message: 'method 类型错误, 正确类型 string' })
  @IsOptional()
  method: string | null;
}
export class ListTreatiseDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
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

export class ListComplexTreatiseDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
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

  @ApiPropertyOptional({ description: '发表时间', type: Date, nullable: true })
  @IsDateString({ message: 'deliveryAt 类型错误, 正确类型 date' })
  @IsOptional()
  deliveryAt: Date | null;

  @ApiPropertyOptional({ description: '出版年份', type: Date, nullable: true })
  @IsDateString({ message: 'releasedAt 类型错误, 正确类型 date' })
  @IsOptional()
  releasedAt: Date | null;
}

export class RecommendTreatisesDto {
  @ApiPropertyOptional({ description: '论文id' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  // @ApiPropertyOptional({
  //   description:
  //     '(论文详情里的关键词为了方便以后拓展这里不用论文id)关键词，如论文关键词为空不传或null',
  // })
  // @IsString({ message: 'keyword 类型错误,正确类型 string' })
  // @IsOptional()
  // keyword: string;

  // @ApiProperty({ description: '论文的栏目id' })
  // @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  // columnId: string;
}

export class GetInstitutionChartsDto {
  @ApiProperty({ description: '论文的栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;
}

export class GetKeywordChartsDto {
  @ApiProperty({ description: '论文的栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;
}
