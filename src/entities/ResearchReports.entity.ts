import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';

@Index('research_reports_pkey', ['id'], { unique: true })
@Entity('research_reports')
export class ResearchReports {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '栏目id' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id',
  })
  columnId: string;

  @ApiProperty({ description: '报告标题' })
  @Column('character varying', { name: 'title', length: 256, comment: '报告标题' })
  title: string;

  @ApiProperty({ description: '作者', type: String })
  @Column('text', { name: 'author', comment: '作者' })
  author: string;

  @ApiProperty({ description: '摘要叙述' })
  @Column('text', {
    name: 'abstract',
    nullable: true,
    comment: '摘要叙述',
  })
  abstract: string | null;

  @ApiProperty({ description: '下载次数' })
  @Column('integer', { name: 'downloads', default: 0, comment: '下载次数' })
  downloads: number;

  @ApiPropertyOptional({ description: '下载链接', type: String, nullable: true })
  @Column('text', { name: 'url', nullable: true, comment: '下载链接' })
  url: string | null;

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
