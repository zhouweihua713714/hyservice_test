import { ApiProperty } from '@nestjs/swagger';

export class AmericaTermOverviewInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '项目数量' })
  termCount: number;

  @ApiProperty({ description: '资助金额' })
  amount: number;
}

export class AmericaTermDistributionInfo {
  @ApiProperty({ description: '美国州名称' })
  state: string;

  @ApiProperty({ description: '项目数量' })
  count: number;
}

export class AmericaTermAmountByKeywordsInfo {
  @ApiProperty({ description: '年份' })
  year: number;

  @ApiProperty({ description: '关键字' })
  keyword: string;

  @ApiProperty({ description: '金额' })
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

export class GetAmericaTermDistributionResult {
  @ApiProperty({
    description: '美国项目立项单位分布',
    type: AmericaTermDistributionInfo,
    isArray: true,
  })
  americaTerms: AmericaTermDistributionInfo[];
}

export class GetAmericaTermAmountByKeywordsResult {
  @ApiProperty({
    description: '三个学部热力图',
    type: AmericaTermAmountByKeywordsInfo,
    isArray: true,
  })
  americaTerms: AmericaTermAmountByKeywordsInfo[];
}
