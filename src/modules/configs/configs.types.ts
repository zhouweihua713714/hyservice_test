import { ArticleTypes } from '@/entities/ArticleTypes.entity';
import { Columns } from '@/entities/Columns.entity';
import { Fields } from '@/entities/Fields.entity';
import { Languages } from '@/entities/Languages.entity';
import { PatentTypes } from '@/entities/PatentTypes.entity';
import { PatentValidTypes } from '@/entities/PatentValidTypes.entity';
import { PeriodicalPeriods } from '@/entities/PeriodicalPeriods.entity';
import { PolicyTypes } from '@/entities/PolicyTypes.entity';
import { Subjects } from '@/entities/Subjects.entity';
import { TermTypes } from '@/entities/TermTypes.entity';
import { Universities } from '@/entities/Universities.entity';
import { Website } from '@/entities/Website.entity';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class GetConfigsConfigResult extends PickType(Website, [
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

export class GetArticleTypesResult {
  @ApiProperty({ description: '文章类型数组', type: ArticleTypes, isArray: true })
  articleTypes: ArticleTypes[];
}
export class GetColumnsResult {
  @ApiProperty({ description: '栏目数组', type: Columns, isArray: true })
  columns: Columns[];
}
export class GetFieldsResult {
  @ApiProperty({ description: '领域数组', type: Fields, isArray: true })
  fields: Fields[];
}

export class GetLanguagesResult {
  @ApiProperty({ description: '语种数组', type: Languages, isArray: true })
  languages: Languages[];
}

export class GetPatentTypesResult {
  @ApiProperty({ description: '专利类型数组', type: PatentTypes, isArray: true })
  patentTypes: PatentTypes[];
}

export class GetPatentValidTypesResult {
  @ApiProperty({ description: '专利有效性数组', type: PatentValidTypes, isArray: true })
  patentValidTypes: PatentValidTypes[];
}

export class GetPeriodicalPeriodsResult {
  @ApiProperty({ description: '专利有效性数组', type: PeriodicalPeriods, isArray: true })
  periodicalPeriods: PeriodicalPeriods[];
}

export class GetPolicyTypesResult {
  @ApiProperty({ description: '专利有效性数组', type: PolicyTypes, isArray: true })
  policyTypes: PolicyTypes[];
}

export class GetSubjectsResult {
  @ApiProperty({ description: '学科分类数组', type: Subjects, isArray: true })
  subjects: Subjects[];
}

export class GetTermTypesResult {
  @ApiProperty({ description: '项目类型数组', type: TermTypes, isArray: true })
  termTypes: TermTypes[];
}

export class GetUniversitiesResult {
  @ApiProperty({ description: '学校数组', type: Universities, isArray: true })
  universities: Universities[];
}


export class SetColumnsTypeResult {
  @ApiProperty({ description: '成功数量' })
  success: number;

  @ApiProperty({ description: '失败数量' })
  failed: number;
}
