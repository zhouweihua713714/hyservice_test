import { NSFDirectorate_Enum } from '@/common/enums/common.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class GetAmericaTermAmountByKeywordsDto {
  @ApiProperty({
    description: '学部',
  })
  @IsString({ message: 'nsfDirectorate 类型错误,正确类型 string' })
  @IsEnum(NSFDirectorate_Enum)
  nsfDirectorate: NSFDirectorate_Enum;
}
