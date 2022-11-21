import { Policies } from '@/entities/Policies.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class SavePolicyResult {
  @ApiProperty({ description: '主键id' })
  id: string;
}
export class GetPolicyDetailResult extends PickType(Policies, [
  'id',
  'name',
  'columnId',
  'status',
  'type',
  'level',
  'institution',
  'announceNo',
  'educationLevel',
  'keyword',
  'url',
  'announcedAt',
  'introduction',
  'region',
  'ownerId',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'picker',
  'topicType',
  'content',
] as const) {
  @ApiPropertyOptional({ description: '政策类型名称' })
  typeName: string;

  @ApiPropertyOptional({ description: '主题类型名称' })
  topicTypeName: string;

  @ApiProperty({ description: '栏目名称' })
  columnName: string;

  @ApiPropertyOptional({ description: '责任人' })
  owner: string;
}
export class ListPolicyInfo extends PickType(Policies, [
  'id',
  'name',
  'columnId',
  'status',
  'updatedAt',
  'clicks',
] as const) {
  @ApiProperty({ description: '栏目名称' })
  columnName: string;
}

export class ListPolicyResult {
  @ApiProperty({ description: '政策数组', type: ListPolicyInfo, isArray: true })
  policies: ListPolicyInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class OperatePoliciesResult {
  @ApiProperty({ description: '成功数量' })
  succeed: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}

export class RemovePoliciesResult extends PickType(OperatePoliciesResult, [
  'succeed',
  'failed',
] as const) {}

export class ListComplexPolicyInfo extends PickType(Policies, [
  'id',
  'name',
  'announcedAt',
  'picker',
  'announceNo',
  'institution',
  'educationLevel',
  'region',
  'introduction',
  'content',
  'type',
  'keyword',
  'url',
  'level',
] as const) {
  @ApiPropertyOptional({ description: '政策类型名称' })
  typeName: string;
}

export class ListComplexPolicyResult {
  @ApiProperty({ description: '政策数组', type: ListComplexPolicyInfo, isArray: true })
  policies: ListComplexPolicyInfo[];

  @ApiProperty({ description: '总数' })
  count: number;
}

export class RecommendPoliciesInfo extends PickType(Policies, ['id', 'name'] as const) {}

export class RecommendPoliciesResult {
  @ApiProperty({ description: '推荐政策数组', type: RecommendPoliciesInfo, isArray: true })
  policies: RecommendPoliciesInfo[];
}

export class RegionInfo {
  @ApiProperty({ description: '政策数量' })
  count: number;

  @ApiProperty({ description: '国家/地区' })
  region: string;
}

export class GetPolicyCountByRegionResult {
  @ApiProperty({ description: '政策分布数组', type: RegionInfo, isArray: true })
  regions: RegionInfo[];
}
