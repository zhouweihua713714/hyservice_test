import { ApiProperty } from '@nestjs/swagger';

export class AmericaTermOverviewInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '项目数量' })
  termCount: number;

  @ApiProperty({ description: '资助金额' })
  amount: number;
}

export class GetAmericaTermOverviewResult {
  @ApiProperty({
    description: '美国项目概览',
    type: AmericaTermOverviewInfo,
    isArray: true,
  })
  americaTerms: AmericaTermOverviewInfo[];
}
