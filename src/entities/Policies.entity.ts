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
  @Column('character varying', { name: 'name', length: 50, comment: '政策名称' })
  name: string;

  @ApiPropertyOptional({ description: '政策类型' })
  @Column('character varying', { name: 'type', length: 64, nullable: true, comment: '政策类型' })
  type: string | null;

  @ApiPropertyOptional({ description: '政策层次' })
  @Column('character varying', { name: 'level', length: 64, nullable: true, comment: '政策层次' })
  level: string | null;

  @ApiPropertyOptional({ description: '发布机构' })
  @Column('character varying', {
    name: 'institution',
    length: 50,
    nullable: true,
    comment: '发布机构',
  })
  institution: string | null;

  @ApiPropertyOptional({ description: '发文号' })
  @Column('character varying', {
    name: 'announce_no',
    length: 50,
    nullable: true,
    comment: '发文号',
  })
  announceNo: string | null;

  @ApiPropertyOptional({ description: '教育层次:基础教育basic,高等教育higher,职业教育vocation,格式:[basic,higher]' })
  @Column('jsonb', {
    name: 'education_level',
    nullable: true,
    comment: '教育层次:基础教育,高等教育,职业教育',
  })
  educationLevel: object | null;

  @ApiPropertyOptional({ description: '关键字' })
  @Column('character varying', {
    name: 'keyword',
    length: 100,
    nullable: true,
    comment: '关键字',
  })
  keyword: string | null;

  @ApiPropertyOptional({ description: '政策发布时间(出台时间)' })
  @Column('timestamp with time zone', {
    name: 'announced_at',
    nullable: true,
    comment: '政策发布时间(出台时间)',
  })
  announcedAt: Date | null;

  @ApiPropertyOptional({ description: '简介' })
  @Column('text', { name: 'introduction', nullable: true, comment: '简介' })
  introduction: string | null;

  // @ApiPropertyOptional({ description: '详情' })
  // @Column('jsonb', { name: 'content', nullable: true, comment: '详情' })
  // content: object | null;

  @ApiPropertyOptional({ description: '政策来源(网址)' })
  @Column('character varying', {
    name: 'url',
    length: 10,
    nullable: true,
    comment: '政策来源(网址)',
  })
  url: string | null;

  @ApiProperty({ description: '状态:待发布ready,已发布active,已下架inactive' })
  @Column('character varying', {
    name: 'status',
    length: 10,
    default: 'ready',
    comment: '状态:待发布ready,已发布active,已下架inactive',
  })
  status: string;

  @ApiProperty({ description: '录入人id' })
  @Column('character varying', {
    name: 'owner_id',
    length: 20,
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
}
