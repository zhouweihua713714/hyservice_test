import { Operate_types_Enum } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/common/utils/reqListQuery';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class ListHistoryDto extends PickType(ReqListQuery, ['page', 'size'] as const) {}
export class OperateTreatisesDto {
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
}
