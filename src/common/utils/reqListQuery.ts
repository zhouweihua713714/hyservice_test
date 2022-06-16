import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class ReqListQuery {
  @ApiProperty({ description: '显示页数' })
  @IsInt({ message: 'page 类型错误, 正确类型 int' })
  @Min(1, { message: '页数至少为1' })
  @Max(10000, { message: '超出了页数限制' })
  @Transform(({ value }) => Number(value))
  page: number;

  @ApiProperty({ description: '每页显示条数' })
  @IsInt({ message: 'size 类型错误, 正确类型 int' })
  @Min(1, { message: '条数至少为1' })
  @Max(10000, { message: '超出了条数限制' })
  @Transform(({ value }) => Number(value))
  size: number;
}
