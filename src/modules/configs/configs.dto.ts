import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class SetColumnsTypeDto {
  // @ApiPropertyOptional({ description: 'id,有则传过来无则不传' })
  // @IsString({ message: 'id 类型错误, 正确类型 string' })
  // @IsOptional()
  // id: string | null;

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
