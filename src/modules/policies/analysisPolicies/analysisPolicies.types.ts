import { AnalysisPolicies } from '@/entities/AnalysisPolicies.entity';
import { AssemblyPolicies } from '@/entities/AssemblyPolicies.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SaveAnalysisPolicyResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetAnalysisPolicyDetailResult extends PickType(AnalysisPolicies, [
  'id',
  'columnId',
  'title',
  'source',
  'content',
  'url',
  'announcedAt',
  'status',
  'ownerId',
  'clicks',
  'createdAt',
  'updatedAt',
  'publishedAt',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;
}
export class ListAnalysisPolicyInfo extends PickType(AnalysisPolicies, [
  'id',
  'title',
  'columnId',
  'status',
  'updatedAt',
  'clicks',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class ListAnalysisPolicyResult {
  @ApiProperty({ description: '政策解读数组', type: ListAnalysisPolicyInfo, isArray: true })
  analysisPolicies: ListAnalysisPolicyInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperateAnalysisPoliciesResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class RemoveAnalysisPoliciesResult extends PickType(OperateAnalysisPoliciesResult, [
  'succeed',
  'failed',
] as const) {}

export class ListComplexAnalysisPolicyInfo extends PickType(AnalysisPolicies, [
  'id',
  'title',
  'announcedAt',
  'source',
  'content',
] as const) {}

export class ListComplexAnalysisPolicyResult {
  @ApiProperty({ description: '政策解读数组', type: ListComplexAnalysisPolicyInfo, isArray: true })
  analysisPolicies: ListComplexAnalysisPolicyInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class RecommendAnalysisPoliciesInfo extends PickType(AnalysisPolicies, [
  'id',
  'title',
  'source',
  'announcedAt'
] as const) {}

export class RecommendAnalysisPoliciesResult {
  @ApiProperty({
    description: '推荐政策解读数组',
    type: RecommendAnalysisPoliciesInfo,
    isArray: true,
  })
  analysisPolicies: RecommendAnalysisPoliciesInfo[];
}

export class AssemblyPoliciesInfo extends PickType(AssemblyPolicies, [
  'id',
  'title',
  'downloads',
  'page',
  'publishedAt',
] as const) {
  @ApiProperty({ description: '下载链接' })
  url: string;

  @ApiProperty({ description: '封面链接' })
  coverUrl: string;
}

export class ListAssemblyPoliciesResult {
  @ApiProperty({
    description: '汇编列表',
    type: AssemblyPoliciesInfo,
    isArray: true,
  })
  assemblyPolicies: AssemblyPoliciesInfo[];
}
