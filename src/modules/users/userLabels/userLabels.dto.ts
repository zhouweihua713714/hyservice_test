import { Labels_Enum, Operate_types_Enum } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/common/utils/reqListQuery';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ListLabelTreatiseDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
  @ApiPropertyOptional({ description: '是否获取用户标签,是true,否:false' })
  @IsBoolean({ message: 'flag 类型错误,正确类型 boolean' })
  @IsOptional()
  flag: string;

  @ApiPropertyOptional({ description: '标签id', type: String, nullable: true })
  @IsString({ message: 'label 类型错误,正确类型 string' })
  @IsEnum(Labels_Enum)
  @IsOptional()
  label: string | null;
}
export class OperateLabelTreatisesDto {
  @ApiProperty({ description: '论文id数组', isArray: true })
  @IsArray({ message: 'ids 类型错误,正确类型 array' })
  @ArrayMinSize(1, { message: '最小长度为1' })
  @IsNotEmpty({ message: 'type 不允许为空' })
  ids: string[];

  @ApiProperty({ description: '操作类型:add 添加,remove 移出' })
  @IsString({ message: 'type 类型错误,正确类型 string' })
  @IsEnum(Operate_types_Enum)
  @IsNotEmpty({ message: 'type 不允许为空' })
  type: string;

  @ApiProperty({ description: '标签id' })
  @IsString({ message: 'label 类型错误,正确类型 string' })
  @IsEnum(Labels_Enum)
  @IsNotEmpty({ message: 'type 不允许为空' })
  label: string;
}
