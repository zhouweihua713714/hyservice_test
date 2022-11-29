import { Website } from '@/entities/Website.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { GetHotKeywordsInfo } from '../configs/configs.types';

export class GetHomepageConfigResult extends PickType(Website, [
  'id',
  'name',
  'IPC',
  'CDN',
  'versionNo',
  'blacklist',
  'title',
  'description',
  'ownership',
  'bottomDescription',
  'links',
  'logo',
  'qrCode',
] as const) {}

export class GetHomepageHotKeywordsResult {
  @ApiProperty({
    description: '首页热搜关键词TOP10',
    type: GetHotKeywordsInfo,
    isArray: true,
  })
  keywords: GetHotKeywordsInfo[];
}


export class GetHomepageSearchResultByKeywordResult {
  @ApiProperty({
    description: '首页热搜关键词TOP10',
    type: GetHotKeywordsInfo,
    isArray: true,
  })
  keywords: GetHotKeywordsInfo[];
}

export class DetailInfo {
  @ApiProperty({ description: '相关的实体id' })
  id: string;

  @ApiProperty({ description: '相关的实体标题' })
  title: string;
}

export class GetHomepageKeywordChartInfo {
  @ApiProperty({ description: '栏目id' })
  id: string;

  @ApiProperty({ description: '栏目名称' })
  name: string;

  @ApiProperty({ description: '该栏目下该关键词的数量' })
  count: number;

  @ApiProperty({
    description:
      '该栏目下的具体数据数组(目前仅展示前20)可以是论文数据/项目数据/政策数据根据在哪个数组里定义含义',
    type: DetailInfo,
    isArray: true,
  })
  details: DetailInfo[];
}

export class GetHomepageKeywordChartsResult {
  @ApiProperty({
    description: '项目栏目下的数据',
    type: GetHomepageKeywordChartInfo,
    isArray: true,
  })
  termColumns: GetHomepageKeywordChartInfo[];

  @ApiProperty({
    description: '论文栏目下的数据',
    type: GetHomepageKeywordChartInfo,
    isArray: true,
  })
  treatiseColumns: GetHomepageKeywordChartInfo[];

  @ApiProperty({
    description: '政策栏目下的数据',
    type: GetHomepageKeywordChartInfo,
    isArray: true,
  })
  policyColumns: GetHomepageKeywordChartInfo[];
}
