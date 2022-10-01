import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('policies_pkey', ['id'], { unique: true })
@Entity('policies')
export class Policies {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '栏目id,政策只能选择政策相关的栏目id' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id,政策只能选择政策相关的栏目id',
  })
  columnId: string;

  @ApiProperty({ description: '政策名称' })
  @Column('character varying', { name: 'name', length: 200, comment: '政策名称' })
  name: string;

  @ApiPropertyOptional({ description: '政策类型', type: String, nullable: true })
  @Column('character varying', { name: 'type', length: 64, comment: '政策类型', nullable: true })
  type: string | null;

  @ApiPropertyOptional({
    description: '主题类型:数据由数据方统计提供下拉项目前暂时没有',
    type: String,
    nullable: true,
  })
  @Column('character varying', {
    name: 'topic_type',
    length: 64,
    comment: '主题类型',
    nullable: true,
  })
  topicType: string | null;

  @ApiPropertyOptional({
    description: '政策层级:国家级policy_level_001',
    type: String,
    nullable: true,
  })
  @Column('character varying', {
    name: 'level',
    length: 64,
    nullable: true,
    comment: '政策层级:国家级policy_level_001',
  })
  level: string | null;

  @ApiPropertyOptional({ description: '发布机构/部门', type: String, nullable: true })
  @Column('character varying', {
    name: 'institution',
    length: 50,
    nullable: true,
    comment: '发布机构/部门',
  })
  institution: string | null;

  @ApiPropertyOptional({ description: '发文号', type: String, nullable: true })
  @Column('character varying', {
    name: 'announce_no',
    length: 50,
    nullable: true,
    comment: '发文号',
  })
  announceNo: string | null;

  @ApiPropertyOptional({
    description: '教育层次:基础教育basic,高等教育higher,职业教育vocation,格式:[basic,higher]',
    nullable: true,
    type: String,
    isArray: true,
  })
  @Column('jsonb', {
    name: 'education_level',
    nullable: true,
    comment: '教育层次:基础教育,高等教育,职业教育',
  })
  educationLevel: object | null;

  @ApiPropertyOptional({ description: '关键字', type: String, nullable: true })
  @Column('character varying', {
    name: 'keyword',
    length: 100,
    nullable: true,
    comment: '关键字',
  })
  keyword: string | null;

  @ApiPropertyOptional({ description: '政策发布时间(出台时间)', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'announced_at',
    nullable: true,
    comment: '政策发布时间(出台时间)',
  })
  announcedAt: Date | null;

  @ApiPropertyOptional({ description: '日期格式:year、month、date', type: String, nullable: true })
  @Column('character varying', {
    name: 'picker',
    nullable: true,
    comment: '日期格式:year、month、date',
  })
  picker: string | null;

  @ApiPropertyOptional({ description: '简介', type: String, nullable: true })
  @Column('text', { name: 'introduction', nullable: true, comment: '简介' })
  introduction: string | null;

  @ApiPropertyOptional({ description: '正文', type: String, nullable: true })
  @Column('text', { name: 'content', nullable: true, comment: '简介' })
  content: string | null;

  // @ApiPropertyOptional({ description: '详情' })
  // @Column('jsonb', { name: 'content', nullable: true, comment: '详情' })
  // content: object | null;

  @ApiPropertyOptional({ description: '政策来源(网址)', type: String, nullable: true })
  @Column('character varying', {
    name: 'url',
    length: 200,
    nullable: true,
    comment: '政策来源(网址)',
  })
  url: string | null;

  @ApiPropertyOptional({
    description: '国家',
    type: String,
    nullable: true,
  })
  @Column('character varying', {
    name: 'region',
    length: 50,
    nullable: true,
    comment: '国家',
  })
  region: string | null;

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
  enabled: boolean;
}
