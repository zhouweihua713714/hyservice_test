import { Content_Types_Enum } from '@/common/enums/common.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class SetColumnsTypeDto {
  @ApiProperty({ description: '栏目id数组', type: String, isArray: true })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];

  @ApiProperty({ description: '是否隐藏 1是，0否，默认0' })
  @IsInt({ message: 'isHide 类型错误, 正确类型 int' })
  isHide: number;
}
export class SetColumnsOrderDto {
  @ApiProperty({ description: '栏目id数组', type: String, isArray: true })
  @IsArray({ message: 'ids 类型错误, 正确类型 array' })
  ids: string[];
}

export class GetSearchResultByKeywordDto {
  @ApiProperty({
    description: '搜索文本',
  })
  @IsString({ message: 'keyword 类型错误,正确类型 string' })
  keyword: string;

  @ApiProperty({
    description:
      '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy',
  })
  @IsString({ message: 'type 类型错误,正确类型 string' })
  @IsEnum(Content_Types_Enum)
  @IsOptional()
  type: string;
}

export class GeHotKeywordsDto {
  @ApiProperty({
    description:
      '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy',
  })
  @IsString({ message: 'type 类型错误,正确类型 string' })
  @IsEnum(Content_Types_Enum)
  @IsOptional()
  type: string;

  @ApiProperty({
    description: '栏目id(项目、论文必填否则出错这里不做校验前端记得要传)',
  })
  @IsString({ message: 'columnId 类型错误,正确类型 string' })
  @IsOptional()
  columnId: string;
}
