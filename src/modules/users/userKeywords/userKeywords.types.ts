import { ApiProperty } from '@nestjs/swagger';

export class UserHotKeywordsResult {
  @ApiProperty({ description: '关键词' })
  keyword: string;

  @ApiProperty({ description: '搜索次数' })
  count: number;
}

export class ListUserSearchKeywordsResult {
  @ApiProperty({ description: '云词数组', type: UserHotKeywordsResult, isArray: true })
  keywords: UserHotKeywordsResult[];
}
