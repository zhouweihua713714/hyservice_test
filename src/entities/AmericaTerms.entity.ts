import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AmericaTermKeywords } from './AmericaTermKeywords.entity';

@Index('america_terms_pkey', ['awardNumber'], { unique: true })
@Entity('america_terms')
export class AmericaTerms {
  @ApiProperty({ description: 'awardNumber, 资助编号, 作为id' })
  @Column('character varying', { name: 'award_number', primary: true, length: 128, comment: '资助编号' })
  awardNumber: string;

  @ApiPropertyOptional({ description: 'title' })
  @Column('character varying', { name: 'title', comment: 'title' })
  title: string;

  @ApiPropertyOptional({ description: 'program' })
  @Column('character varying', { name: 'program',  nullable: true, comment: 'program' })
  program: string | null;

  @ApiPropertyOptional({ description: '开始时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'start_date',
    nullable: true,
    comment: '开始时间',
  })
  startDate: Date | null;

  @ApiPropertyOptional({ description: '结束时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'end_date',
    nullable: true,
    comment: '结束时间',
  })
  endDate: Date | null;

  @ApiProperty({ description: '项目负责人' })
  @Column('character varying', { name: 'principal_investigator', comment: '项目负责人' })
  principalInvestigator: string;

  @ApiProperty({ description: '美国州缩写' })
  @Column('character varying', { name: 'state', comment: '美国州缩写' })
  state: string;

  @ApiProperty({ description: '组织' })
  @Column('character varying', { name: 'organization', comment: '组织' })
  organization: string;

  @ApiPropertyOptional({ description: '资助方式' })
  @Column('character varying', { name: 'award_instrument', nullable: true, comment: '资助方式' })
  awardInstrument: string | null;

  @ApiPropertyOptional({ description: '资助金额' })
  @Column('integer', { name: 'awarded_amount_to_date',  nullable: true, comment: '资助金额' })
  awardedAmountToDate: number | null;

  @ApiProperty({ description: '摘要叙述' })
  @Column('text', {
    name: 'abstract',
    nullable: true,
    comment: '摘要叙述',
  })
  abstract: string | null;

  @ApiProperty({ description: '学部' })
  @Column('character varying', {
    name: 'nsf_directorate',
    nullable: true,
    comment: '学部',
  })
  nsfDirectorate: string | null;
  
  @ApiPropertyOptional({ description: '年份' })
  @Column('character varying', { name: 'year', nullable: true, comment: '年份' })
  year: string | null;

  @ApiProperty({ description: '栏目id' })
  @Column('character varying', { name: 'column_id', length: 128, comment: '栏目id' })
  columnId: string;

  @ApiPropertyOptional({ description: '关键字', type: String, nullable: true })
  @Column('character varying', {
    name: 'keyword',
    length: 100,
    nullable: true,
    comment: '关键字',
  })
  keyword: string | null;

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
  @Column('boolean', { name: 'enabled', nullable: true, default: true })
  enabled: boolean ;

  @OneToMany(() => AmericaTermKeywords, (americaTermKeywords) => americaTermKeywords.americaTerm)
  americaTermKeywords: AmericaTermKeywords[];
}
