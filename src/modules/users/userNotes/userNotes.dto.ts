import { Operate_types_Enum } from '@/common/enums/common.enum';
import { ReqListQuery } from '@/common/utils/reqListQuery';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetNoteTreatiseDetailDto {
  @ApiProperty({ description: 'id,笔记id' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;
}

export class SaveNoteTreatiseDto {
  @ApiPropertyOptional({ description: 'id,传表示编辑不传新增' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  @IsOptional()
  id: string;

  @ApiProperty({ description: '笔记内容' })
  @IsString({ message: 'content 类型错误, 正确类型 string' })
  content: string;

  @ApiPropertyOptional({ description: '笔记评论(自己)', type: String, nullable: true })
  @IsString({ message: 'comment 类型错误, 正确类型 string' })
  @IsOptional()
  comment: string | null;

  @ApiProperty({ description: '论文id' })
  @IsString({ message: 'treatiseId 类型错误, 正确类型 string' })
  treatiseId: string;
}

export class RemoveNoteTreatisesDto {
  @ApiProperty({ description: '笔记id数组' })
  @IsArray({ message: 'ids 类型错误,正确类型 array' })
  @ArrayMinSize(1, { message: '最小长度为1' })
  @IsNotEmpty({ message: 'type 不允许为空' })
  ids: string[];
}

export class ListNoteTreatiseDto extends PickType(ReqListQuery, ['page', 'size'] as const) {
}

export class GetNoteTreatisesByTreatiseIdDto {
  @ApiProperty({ description: '论文id' })
  @IsString({ message: 'id 类型错误, 正确类型 string' })
  id: string;
}


