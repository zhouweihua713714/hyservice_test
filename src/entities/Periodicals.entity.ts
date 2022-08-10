import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column('character varying', { name: 'name', length: 50, comment: '期刊名称' })
  name: string;

  @ApiPropertyOptional({ description: '期刊类型' })
  @Column('character varying', { name: 'type', length: 64, comment: '期刊类型' })
  type: string ;

  @ApiPropertyOptional({ description: '简介' })
  @Column('text', { name: 'introduction', nullable: true, comment: '简介' })
  introduction: string | null;

  @ApiPropertyOptional({ description: '语种,格式:[string,string]' })
  @Column('jsonb', {
    name: 'language',
    nullable: true,
    comment: '语种,格式:[string,string]',
  })
  language: object | null;

  @ApiPropertyOptional({ description: '地区(刊物国别),格式 [string,string]' })
  @Column('jsonb', {
    name: 'region',
    nullable: true,
    comment: '地区(刊物国别)格式 [string,string]',
  })
  region: object | null;

  @ApiPropertyOptional({ description: '主领域' })
  @Column('character varying', {
    name: 'field',
    length: 128,
    nullable: true,
    comment: '主领域',
  })
  field: string | null;

  @ApiPropertyOptional({ description: '子领域' })
  @Column('character varying', {
    name: 'minor_field',
    length: 128,
    nullable: true,
    comment: '子领域,格式 [string,string]',
  })
  minorField: string | null;

  @ApiPropertyOptional({ description: '网址' })
  @Column('character varying', { name: 'url', length: 50, nullable: true, comment: '网址' })
  url: string | null;

  @ApiPropertyOptional({ description: '详细地址' })
  @Column('character varying', { name: 'address', length: 50, nullable: true, comment: '详细地址' })
  address: string | null;

  @ApiPropertyOptional({ description: '检索情况' })
  @Column('character varying', { name: 'search', nullable: true, length: 32, comment: '检索情况' })
  search: string | null;

  @ApiPropertyOptional({ description: '影响因子' })
  @Column('decimal', {
    name: 'impact_factor',
    precision: 5,
    scale:3,
    nullable: true,
    comment: '影响因子',
  })
  impactFactor: number | null;

  @ApiPropertyOptional({ description: '创刊时间' })
  @Column('timestamp with time zone', {
    name: 'established_at',
    nullable: true,
    comment: '创刊时间',
  })
  establishedAt: Date | null;

  @ApiPropertyOptional({ description: '出版商' })
  @Column('character varying', {
    name: 'publisher',
    length: 50,
    nullable: true,
    comment: '出版商',
  })
  publisher: string | null;

  @ApiPropertyOptional({ description: '刊发周期' })
  @Column('character varying', { name: 'period', length: 10, nullable: true, comment: '刊发周期' })
  period: string | null;

  @ApiPropertyOptional({ description: '主管单位' })
  @Column('character varying', {
    name: 'manager',
    length: 50,
    nullable: true,
    comment: '主管单位',
  })
  manager: string | null;

  @ApiPropertyOptional({ description: '主办单位' })
  @Column('character varying', {
    name: 'organizer',
    length: 50,
    nullable: true,
    comment: '主办单位',
  })
  organizer: string | null;

  @ApiPropertyOptional({ description: 'ISSN,国际标准期刊编号' })
  @Column('character varying', {
    name: 'issn',
    length: 50,
    nullable: true,
    comment: 'ISSN,国际标准期刊编号',
  })
  ISSN: string | null;

  @ApiPropertyOptional({ description: '' })
  @Column('character varying', { name: 'cn', length: 50, nullable: true, comment: '国内统一刊号' })
  CN: string | null;

  @ApiPropertyOptional({ description: '中文核心期刊(北大) 类型:核心期刊journals_001,1级权威journals_002,2级权威journals_003 格式 [string,string]' })
  @Column('jsonb', {
    name: 'peking_unit',
    nullable: true,
    comment: '中文核心期刊(北大) 类型:核心期刊journals_001,1级权威journals_002,2级权威journals_003 格式 [string,string]',
  })
  pekingUnit: object | null;

  @ApiPropertyOptional({ description: '期刊荣誉' })
  @Column('character varying', { name: 'honor', length: 50, nullable: true, comment: '期刊荣誉' })
  honor: string | null;

  @ApiPropertyOptional({ description: '载文量' })
  @Column('integer', { name: 'article_number', nullable: true, comment: '载文量' })
  articleNumber: number | null;

  @ApiPropertyOptional({ description: '引用量' })
  @Column('integer', { name: 'quote', nullable: true, comment: '引用量' })
  quote: number | null;

  @ApiPropertyOptional({ description: '下载次数(统计CNKI中国知网)' })
  @Column('integer', { name: 'downloads', nullable: true, comment: '下载次数(统计CNKI中国知网)' })
  downloads: number | null;

  @ApiPropertyOptional({ description: '学科分类(CNKI中国知网),格式:[string,string]' })
  @Column('jsonb', {
    name: 'classification',
    nullable: true,
    comment: '学科分类(CNKI中国知网),格式:[string,string]',
  })
  classification: object | null;

  @ApiPropertyOptional({ description: '综合影响因子' })
  @Column('decimal', {
    name: 'composite_impact_factor',
    precision: 5,
    scale: 3,
    nullable: true,
    comment: '综合影响因子',
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

  @ApiPropertyOptional({ description: '审稿周期' })
  @Column('character varying', {
    name: 'check_period',
    length: 50,
    nullable: true,
    comment: '审稿周期',
  })
  checkPeriod: string | null;

  @ApiPropertyOptional({ description: '发稿周期' })
  @Column('character varying', {
    name: 'release_period',
    length: 50,
    nullable: true,
    comment: '发稿周期',
  })
  releasePeriod: string | null;

  @ApiPropertyOptional({ description: '录用率' })
  @Column('decimal', {
    name: 'record_rate',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: '录用率',
  })
  recordRate: number | null;

  @ApiPropertyOptional({ description: '审稿费' })
  @Column('decimal', {
    name: 'check_fee',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '审稿费',
  })
  checkFee: string | null;

  @ApiPropertyOptional({ description: '版面费' })
  @Column('decimal', {
    name: 'page_fee',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '版面费',
  })
  pageFee: string | null;

  @ApiPropertyOptional({ description: '稿酬' })
  @Column('decimal', {
    name: 'reward',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '稿酬',
  })
  reward: string | null;

  @ApiPropertyOptional({ description: '封面链接' })
  @Column('character varying', {
    name: 'cover_url',
    length: 50,
    nullable: true,
    comment: '封面链接',
  })
  coverUrl: string | null;

  @ApiPropertyOptional({ description: '引用分' })
  @Column('decimal', {
    name: 'cite_score',
    precision: 10,
    scale: 1,
    nullable: true,
    comment: '引用分',
  })
  citeScore: number | null;

  @ApiPropertyOptional({ description: '被引用率' })
  @Column('integer', {
    name: 'cite_rate',
    nullable: true,
    comment: '被引用率',
  })
  citeRate: number | null;

  @ApiPropertyOptional({ description: '详情' })
  @Column('jsonb', { name: 'content', nullable: true, comment: '详情' })
  content: object | null;

  @ApiProperty({ description: '状态:待发布ready,已发布active,已下架inactive' })
  @Column('character varying', {
    name: 'status',
    length: 10,
    default: 'ready',
    comment: '状态:待发布ready,已发布active,已下架inactive',
  })
  status: string;

  @ApiPropertyOptional({ description: '录入人id' })
  @Column('character varying', {
    name: 'owner_id',
    length:128,
    nullable: true,
    comment: '录入人id',
  })
  ownerId: string | null;

  @ApiPropertyOptional({ description: '栏目图片' })
  @Column('character varying', {
    name: 'picture',
    length: 128,
    nullable: true,
    comment: '栏目图片',
  })
  picture: string | null;

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
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date | null;

  @ApiProperty({ description: '更新时间' })
  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt: Date | null;

  @ApiPropertyOptional({ description: '发布时间' })
  @Column('timestamp with time zone', {
    name: 'published_at',
    nullable: true,
    comment: '发布时间',
  })
  publishedAt: Date | null;

  @ApiPropertyOptional({ description: '删除时间' })
  @Column('timestamp with time zone', {
    name: 'deleted_at',
    nullable: true,
    comment: '删除时间',
  })
  @ApiPropertyOptional({ description: '是否有效 t是f否' })
  @Column('boolean', { name: 'enabled', nullable: true, default: 'true' })
  enabled: boolean ;
}
