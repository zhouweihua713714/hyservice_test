import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}
@Index('periodicals_pkey', ['id'], { unique: true })
@Entity('periodicals')
export class Periodicals {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '栏目id,期刊只能选择期刊相关的栏目id' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id,期刊只能选择期刊相关的栏目id',
  })
  columnId: string;

  @ApiProperty({ description: '期刊名称' })
  @Column('character varying', { name: 'name', length: 200, comment: '期刊名称' })
  name: string;

  @ApiPropertyOptional({ description: '期刊类型:期刊 periodical', type: String, nullable: true })
  @Column('character varying', { name: 'type', length: 64, comment: '期刊类型', nullable: true })
  type: string | null;

  @ApiPropertyOptional({ description: '简介', type: String, nullable: true })
  @Column('text', { name: 'introduction', nullable: true, comment: '简介' })
  introduction: string | null;

  @ApiPropertyOptional({
    description: '语种,格式:[string,string]',
    type: String,
    isArray: true,
    nullable: true,
  })
  @Column('jsonb', {
    name: 'language',
    nullable: true,
    comment: '语种,格式:[string,string]',
  })
  language: object | null;

  @ApiPropertyOptional({
    description: '地区(刊物国别),国别之间用;隔开',
    type: String,
    nullable: true,
  })
  @Column('character varying', {
    name: 'region',
    length: 50,
    nullable: true,
    comment: '地区(刊物国别),国别之间用;隔开',
  })
  region: string | null;

  @ApiPropertyOptional({ description: '主领域(大领域之间用“;”隔开)',type:String, nullable: true })
  @Column('character varying', {
    name: 'field',
    length: 128,
    nullable: true,
    comment: '主领域(大领域之间用“;”隔开)',
  })
  field: string | null;

  @ApiPropertyOptional({ description: '子领域(大领域之间用“;”隔开)', type: String, nullable: true })
  @Column('character varying', {
    name: 'minor_field',
    length: 128,
    nullable: true,
    comment: '子领域,(子领域之间用“;”隔开)',
  })
  minorField: string | null;

  @ApiPropertyOptional({ description: '网址', type: String, nullable: true })
  @Column('character varying', { name: 'url', length: 200, nullable: true, comment: '网址' })
  url: string | null;

  @ApiPropertyOptional({ description: '详细地址', type: String, nullable: true })
  @Column('character varying', { name: 'address', length: 100, nullable: true, comment: '详细地址' })
  address: string | null;

  @ApiPropertyOptional({ description: '检索情况', type: String, nullable: true })
  @Column('character varying', { name: 'search', nullable: true, length: 50, comment: '检索情况' })
  search: string | null;

  @ApiPropertyOptional({ description: '影响因子', type: Number, nullable: true })
  @Column('decimal', {
    name: 'impact_factor',
    precision: 5,
    scale: 3,
    nullable: true,
    comment: '影响因子',
    transformer: new ColumnNumericTransformer()
  })
  impactFactor: number | null;

  @ApiPropertyOptional({ description: '创刊时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'established_at',
    nullable: true,
    comment: '创刊时间',
  })
  establishedAt: Date | null;

  @ApiPropertyOptional({ description: '出版商', type: String, nullable: true })
  @Column('character varying', {
    name: 'publisher',
    length: 200,
    nullable: true,
    comment: '出版商',
  })
  publisher: string | null;

  @ApiPropertyOptional({ description: '刊发周期', type: String, nullable: true })
  @Column('character varying', { name: 'period', length: 30, nullable: true, comment: '刊发周期' })
  period: string | null;

  @ApiPropertyOptional({ description: '主管单位', type: String, nullable: true })
  @Column('character varying', {
    name: 'manager',
    length: 50,
    nullable: true,
    comment: '主管单位',
  })
  manager: string | null;

  @ApiPropertyOptional({ description: '主办单位', type: String, nullable: true })
  @Column('character varying', {
    name: 'organizer',
    length: 50,
    nullable: true,
    comment: '主办单位',
  })
  organizer: string | null;

  @ApiPropertyOptional({ description: 'ISSN,国际标准期刊编号', type: String, nullable: true })
  @Column('character varying', {
    name: 'issn',
    length: 50,
    nullable: true,
    comment: 'ISSN,国际标准期刊编号',
  })
  ISSN: string | null;

  @ApiPropertyOptional({ description: '国内统一刊号', type: String, nullable: true })
  @Column('character varying', { name: 'cn', length: 50, nullable: true, comment: '国内统一刊号' })
  CN: string | null;

  @ApiPropertyOptional({
    description:
      '中文核心期刊(北大) 类型:核心期刊journals_001,1级权威journals_002,2级权威journals_003 格式 [string,string]',
    type: String,
    isArray: true,
    nullable: true,
  })
  @Column('jsonb', {
    name: 'peking_unit',
    nullable: true,
    comment:
      '中文核心期刊(北大) 类型:核心期刊journals_001,1级权威journals_002,2级权威journals_003 格式 [string,string]',
  })
  pekingUnit: object | null;

  @ApiPropertyOptional({ description: '期刊荣誉', type: String, nullable: true })
  @Column('character varying', { name: 'honor', length: 50, nullable: true, comment: '期刊荣誉' })
  honor: string | null;

  @ApiPropertyOptional({ description: '载文量', type: Number, nullable: true })
  @Column('integer', { name: 'article_number', nullable: true, comment: '载文量' })
  articleNumber: number | null;

  @ApiPropertyOptional({ description: '引用量', type: Number, nullable: true })
  @Column('integer', { name: 'quote', nullable: true, comment: '引用量' })
  quote: number | null;

  @ApiPropertyOptional({ description: '下载次数(统计CNKI中国知网)', type: Number, nullable: true })
  @Column('integer', { name: 'downloads', nullable: true, comment: '下载次数(统计CNKI中国知网)' })
  downloads: number | null;

  @ApiPropertyOptional({
    description: '学科分类(CNKI中国知网),格式:[string,string]',
    type: String,
    isArray: true,
    nullable: true,
  })
  @Column('jsonb', {
    name: 'subject',
    nullable: true,
    comment: '学科分类(CNKI中国知网),格式:[string,string]',
  })
  subject: object | null;

  @ApiPropertyOptional({ description: '综合影响因子', type: Number, nullable: true })
  @Column('decimal', {
    name: 'composite_impact_factor',
    precision: 5,
    scale: 3,
    nullable: true,
    comment: '综合影响因子',
    transformer: new ColumnNumericTransformer()
  })
  compositeImpactFactor: number | null;

  // @ApiPropertyOptional({ description: '复合影响因子' })
  // @Column('decimal', {
  //   name: 'compound_impact_factor',
  //   precision: 10,
  //   scale:3,
  //   nullable: true,
  //   comment: '复合影响因子',
  // })
  // compoundImpactFactor: number | null;

  @ApiPropertyOptional({ description: '审稿周期', type: String, nullable: true })
  @Column('character varying', {
    name: 'check_period',
    length: 50,
    nullable: true,
    comment: '审稿周期',
  })
  checkPeriod: string | null;

  @ApiPropertyOptional({ description: '发稿周期', type: String, nullable: true })
  @Column('character varying', {
    name: 'release_period',
    length: 50,
    nullable: true,
    comment: '发稿周期',
  })
  releasePeriod: string | null;

  @ApiPropertyOptional({ description: '录用率', type: Number, nullable: true })
  @Column('decimal', {
    name: 'record_rate',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: '录用率',
    transformer: new ColumnNumericTransformer()
  })
  recordRate: number | null;

  @ApiPropertyOptional({ description: '审稿费,单位:元', type: Number, nullable: true })
  @Column('decimal', {
    name: 'check_fee',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '审稿费,单位:元',
    transformer: new ColumnNumericTransformer()
  })
  checkFee: number | null;

  @ApiPropertyOptional({ description: '版面费,单位:元', type: Number, nullable: true })
  @Column('decimal', {
    name: 'page_fee',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '版面费,单位:元',
    transformer: new ColumnNumericTransformer()
  })
  pageFee: number | null;

  @ApiPropertyOptional({ description: '稿酬,单位:元', type: Number, nullable: true })
  @Column('decimal', {
    name: 'reward',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '稿酬,单位:元',
    transformer: new ColumnNumericTransformer()
  })
  reward: number | null;

  @ApiPropertyOptional({ description: '封面链接', type: String, nullable: true })
  @Column('character varying', {
    name: 'cover_url',
    length: 200,
    nullable: true,
    comment: '封面链接',
  })
  coverUrl: string | null;

  @ApiPropertyOptional({ description: '引用分', type: Number, nullable: true })
  @Column('decimal', {
    name: 'cite_score',
    precision: 10,
    scale: 1,
    nullable: true,
    comment: '引用分',
    transformer: new ColumnNumericTransformer()
  })
  citeScore: number | null;

  @ApiPropertyOptional({ description: '被引用率', type: Number, nullable: true })
  @Column('integer', {
    name: 'cite_rate',
    nullable: true,
    comment: '被引用率',
  })
  citeRate: number | null;

  @ApiProperty({ description: '状态:待发布ready,已发布active,已下架inactive' })
  @Column('character varying', {
    name: 'status',
    length: 10,
    default: 'ready',
    comment: '状态:待发布ready,已发布active,已下架inactive',
  })
  status: string;

  @ApiPropertyOptional({ description: '录入人id', type: String, nullable: true })
  @Column('character varying', {
    name: 'owner_id',
    length: 128,
    nullable: true,
    comment: '录入人id',
  })
  ownerId: string | null;

  // @ApiPropertyOptional({ description: '栏目图片', type: String, nullable: true })
  // @Column('character varying', {
  //   name: 'picture',
  //   length: 128,
  //   nullable: true,
  //   comment: '栏目图片',
  // })
  // picture: string | null;

  @ApiPropertyOptional({ description: '点击量,暂时不做' })
  @Column('integer', {
    name: 'clicks',
    default: 0,
    comment: '点击量,暂时不做',
  })
  clicks: number;

  @ApiProperty({ description: '创建时间' })
  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt: Date;

  @ApiPropertyOptional({ description: '发布时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'published_at',
    nullable: true,
    comment: '发布时间',
  })
  publishedAt: Date | null;

  @ApiPropertyOptional({ description: '删除时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'deleted_at',
    nullable: true,
    comment: '删除时间',
  })
  deletedAt: Date | null;

  @ApiPropertyOptional({ description: '是否有效 t是f否' })
  @Column('boolean', { name: 'enabled', default: true })
  enabled: boolean;
}
