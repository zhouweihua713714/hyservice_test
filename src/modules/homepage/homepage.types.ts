import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
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
