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
export class GetPatentDetailDto {
  @ApiProperty({ description: 'id,' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;

  @ApiPropertyOptional({ description: '是否C端请求:是 true' })
  @IsBoolean({ message: 'flag 类型错误, 正确类型 boolean' })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  flag: boolean;
}
export class SavePatentDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiPropertyOptional({ description: '状态,待发布,已发布' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  @IsOptional()
  status: string;

  @ApiProperty({ description: '专利标题' })
  @IsString({ message: 'title 类型错误, 正确类型 string' })
  // @MaxLength(300)
  title: string;

  @ApiPropertyOptional({ description: '关键字', type: String, nullable: true })
  @IsString({ message: 'keyword 类型错误, 正确类型 string' })
  // @MaxLength(100)
  @IsOptional()
  keyword: string | null;

  @ApiProperty({ description: '栏目id' })
  @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  columnId: string;

  @ApiPropertyOptional({ description: '摘要', type: String, nullable: true })
  @IsString({ message: 'abstract 类型错误, 正确类型 string' })
  @IsOptional()
  abstract: string | null;

  @ApiPropertyOptional({ description: '申请人(单位)', type: String, nullable: true })
  @IsString({ message: 'applicant 类型错误, 正确类型 string' })
  // @MaxLength(100)
  @IsOptional()
  applicant: string | null;

  @ApiPropertyOptional({ description: '公开(公告)号', type: String, nullable: true })
  @IsString({ message: 'announcedNo 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  announcedNo: string | null;

  @ApiPropertyOptional({ description: '公开(公告)日', type: Date, nullable: true })
  @IsDateString({ message: 'announcedAt 类型错误, 正确类型 date' })
  @IsOptional()
  announcedAt: Date | null;

  @ApiPropertyOptional({ description: '申请号', type: String, nullable: true })
  @IsString({ message: 'appliedNo 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  appliedNo: string | null;

  @ApiPropertyOptional({ description: '申请日', type: Date, nullable: true })
  @IsDateString({ message: 'appliedAt 类型错误, 正确类型 date' })
  @IsOptional()
  appliedAt: Date | null;

  @ApiPropertyOptional({ description: '专利类型', type: Date, nullable: true })
  @IsString({ message: 'type 类型错误, 正确类型 string' })
  @IsOptional()
  type: string | null;

  @ApiPropertyOptional({
    description: '公开国别',
    type: String,
    nullable: true,
  })
  @IsString({ message: 'country 类型错误, 正确类型 string' })
  @MaxLength(50)
  @IsOptional()
  country: string | null;

  @ApiPropertyOptional({ description: '代理机构', type: String, nullable: true })
  @IsString({ message: 'agency 类型错误, 正确类型 string' })
  @MaxLength(300)
  @IsOptional()
  agency: string | null;

  @ApiPropertyOptional({ description: '代理人', type: String, nullable: true })
  @IsString({ message: 'agent 类型错误, 正确类型 string' })
  // @MaxLength(100)
  @IsOptional()
  agent: string | null;

  @ApiPropertyOptional({ description: '专利有效性', type: String, nullable: true })
  @IsString({ message: 'validStatus 类型错误, 正确类型 string' })
  @IsOptional()
  validStatus: string | null;
}
export class ListPatentDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '专利名称,支持模糊搜索 如果为空则不传或者传null' })
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
export class OperatePatentsDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '状态' })
  @IsString({ message: 'status 类型错误, 正确类型 string' })
  @IsEnum(Content_Status_Enum)
  status: string;
}

export class RemovePatentsDto {
  @ApiProperty({ description: 'ids 数组' })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}

export class ListComplexPatentDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({
    description: '关键词,多标签需要分号隔开才能进行分词在进行模糊搜索 如果为空则不传或者传null',
  })
  @IsString({ message: 'keyword 类型错误,正确类型 string' })
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional({ description: '专利类型', type: Date, nullable: true })
  @IsString({ message: 'type 类型错误, 正确类型 string' })
  @IsOptional()
  type: string;
}

export class GetPatentChartsDto {
  @ApiProperty({
    description: '图标类型:申请人(单位)applicant,年份year,类型type',
    type: Date,
    nullable: true,
  })
  @IsString({ message: 'type 类型错误, 正确类型 string' })
  type: string;
}
