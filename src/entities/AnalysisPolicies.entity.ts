import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('analysis_policies_pkey', ['id'], { unique: true })
@Entity('analysis_policies')
export class AnalysisPolicies {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '栏目id,政策解读只能选择政策相关的栏目id' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id,政策解读只能选择政策相关的栏目id',
  })
  columnId: string;

  @ApiProperty({ description: '标题' })
  @Column('character varying', { name: 'title', length: 200, comment: '标题' })
  title: string;

  @ApiPropertyOptional({ description: '文章来源', type: String, nullable: true })
  @Column('character varying', { name: 'source', length: 200, comment: '文章来源', nullable: true })
  source: string | null;

  @ApiPropertyOptional({ description: '正文', type: String, nullable: true })
  @Column('text', { name: 'content', nullable: true, comment: '正文' })
  content: string | null;

  // @ApiPropertyOptional({ description: '简介', type: String, nullable: true })
  // @Column('text', { name: 'introduction', nullable: true, comment: '简介' })
  // introduction: string | null;

  @ApiPropertyOptional({ description: '链接', type: String, nullable: true })
  @Column('character varying', {
    name: 'url',
    length: 200,
    nullable: true,
    comment: '链接',
  })
  url: string | null;

  @ApiPropertyOptional({ description: '发布时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'announced_at',
    nullable: true,
    comment: '发布时间',
  })
  announcedAt: Date | null;

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

  @ApiPropertyOptional({ description: '点击量' })
  @Column('integer', {
    name: 'clicks',
    default: 0,
    comment: '点击量',
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
