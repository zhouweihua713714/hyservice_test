import { NSFDirectorate_Enum } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/common/utils/reqListQuery';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class GetAmericaTermAmountByKeywordsDto {
  @ApiProperty({
    description: '学部',
    enum: NSFDirectorate_Enum
  })
  @IsString({ message: 'nsfDirectorate 类型错误,正确类型 string' })
  @IsEnum(NSFDirectorate_Enum)
  nsfDirectorate: NSFDirectorate_Enum;
}

export class ListComplexAmericaTermDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({
    description: '关键词,多标签需要分号隔开才能进行分词在进行模糊搜索 如果为空则不传或者传null',
  })
  @IsString({ message: 'keyword 类型错误,正确类型 string' })
  @IsOptional()
  keyword: string;

  // @ApiPropertyOptional({ description: '栏目id' })
  // @IsString({ message: 'columnId 类型错误, 正确类型 string' })
  // @IsOptional()
  // columnId: string;

  @ApiPropertyOptional({ description: '立项时间' })
  @IsDateString({ message: 'year 类型错误, 正确类型 IsDateString' })
  @IsOptional()
  year: Date;

  @ApiPropertyOptional({ description: '热门研究单位,模糊搜索' })
  @IsString({ message: 'organization 类型错误, 正确类型 string' })
  @IsOptional()
  organization: string;

  @ApiProperty({description: '学部', enum: NSFDirectorate_Enum})
  @IsString({ message: 'nsfDirectorate 类型错误,正确类型 string' })
  @IsEnum(NSFDirectorate_Enum)
  @IsOptional()
  nsfDirectorate: NSFDirectorate_Enum;

  @ApiPropertyOptional({ description: '项目负责人,模糊搜索' })
  @IsString({ message: 'principalInvestigator 类型错误, 正确类型 string' })
  @IsOptional()
  principalInvestigator: string;
}
