import { ApiProperty } from '@nestjs/swagger';

export class ListUserSearchKeywordsResult {
  @ApiProperty({ description: '云词数组' })
  keywords: string[];
}
