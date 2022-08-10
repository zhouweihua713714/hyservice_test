import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('america_terms_pkey', ['id'], { unique: true })
@Entity('america_terms')
export class AmericaTerms {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiPropertyOptional({ description: 'AwardID' })
  @Column('character varying', {
    name: 'award_id',
    length: 50,
    nullable: true,
    comment: 'AwardID',
  })
  awardID: string | null;

  @ApiPropertyOptional({ description: 'AwardTitle' })
  @Column('character varying', { name: 'award_title',  nullable: true, comment: 'AwardTitle' })
  awardTitle: string | null;

  @ApiPropertyOptional({ description: '数量' })
  @Column('integer', { name: 'amount',  nullable: true, comment: '数量' })
  amount: number | null;

  @ApiPropertyOptional({ description: '研究人' })
  @Column('character varying', { name: 'investigator', nullable: true, comment: '研究人' })
  investigator: string | null;

  @ApiPropertyOptional({ description: '资助方式' })
  @Column('character varying', { name: 'instrument', length: 50, nullable: true, comment: '资助方式' })
  instrument: string | null;

  @ApiPropertyOptional({ description: '项目负责人' })
  @Column('character varying', { name: 'program_officer', nullable: true, comment: '项目负责人' })
  programOfficer: string | null;

  @ApiPropertyOptional({ description: '所属机构' })
  @Column('character varying', { name: 'institution',  nullable: true, comment: '所属机构' })
  institution: string | null;

  @ApiPropertyOptional({ description: 'foa信息' })
  @Column('character varying', { name: 'foa_information',  nullable: true, comment: 'foa信息' })
  foaInformation: string | null;

  @ApiProperty({ description: '组织' })
  @Column('character varying', { name: 'organization', length: 50, comment: '组织' })
  organization: string;

  @ApiProperty({ description: 'ProgramElement' })
  @Column('character varying', { name: 'program_element', nullable: true, comment: 'ProgramElement' })
  programElement: string | null;

  @ApiProperty({ description: '摘要叙述' })
  @Column('text', {
    name: 'abstract',
    nullable: true,
    comment: '摘要叙述',
  })
  abstract: string | null;

  @ApiProperty({ description: 'ProgramReference' })
  @Column('text', {
    name: 'reference',
    nullable: true,
    comment: 'ProgramReference',
  })
  reference: string | null;

  
  @ApiPropertyOptional({ description: '批准年份' })
  @Column('character varying', { name: 'year', nullable: true, comment: '批准年份' })
  year: string | null;

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
  @Column('boolean', { name: 'enabled', nullable: true, default: true })
  enabled: boolean ;
}
