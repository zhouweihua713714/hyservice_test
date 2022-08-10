import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('patents_pkey', ['id'], { unique: true })
@Entity('patents')
export class Patents {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '专利标题' })
  @Column('character varying', { name: 'title', length: 50, comment: '专利标题' })
  title: string;

  @ApiPropertyOptional({ description: '关键字' })
  @Column('character varying', {
    name: 'keyword',
    length: 100,
    nullable: true,
    comment: '关键字',
  })
  keyword: string | null;

  @ApiPropertyOptional({ description: '摘要' })
  @Column('text', { name: 'abstract', nullable: true, comment: '摘要' })
  abstract: string | null;

  @ApiPropertyOptional({ description: '申请人(单位)' })
  @Column('character varying', {
    name: 'institution',
    length: 50,
    nullable: true,
    comment: '申请人(单位)',
  })
  applicant: string | null;

  @ApiPropertyOptional({ description: '公开(公告)号' })
  @Column('character varying', {
    name: 'announced_no',
    nullable: true,
    length:128,
    comment: '公开(公告)号',
  })
  announcedNo: Date | null;

  @ApiPropertyOptional({ description: '公开(公告)日' })
  @Column('timestamp with time zone', {
    name: 'announced_at',
    nullable: true,
    comment: '公开(公告)日',
  })
  announcedAt: Date | null;

  @ApiPropertyOptional({ description: '申请号' })
  @Column('character varying', {
    name: 'applied_no',
    nullable: true,
    length:128,
    comment: '申请号',
  })
  appliedNo: Date | null;

  @ApiPropertyOptional({ description: '申请日' })
  @Column('timestamp with time zone', {
    name: 'applied_at',
    nullable: true,
    comment: '申请日',
  })
  appliedAt: Date | null;

  @ApiProperty({ description: '专利类型' })
  @Column('character varying', { name: 'type', length: 64,  comment: '专利类型' })
  type: string ;

  @ApiPropertyOptional({ description: '公开国别' })
  @Column('character varying', { name: 'country', length: 32, nullable: true, comment: '公开国别' })
  country: string | null;

  @ApiPropertyOptional({ description: '代理机构' })
  @Column('character varying', { name: 'agency', length: 128, nullable: true, comment: '代理机构' })
  agency: string | null;

  @ApiPropertyOptional({ description: '代理人' })
  @Column('character varying', { name: 'agent', length: 64, nullable: true, comment: '代理人' })
  agent: string | null;

  @ApiPropertyOptional({ description: '专利有效性' })
  @Column('character varying', {
    name: 'valid_status',
    length: 64,
    nullable: true,
    comment: '专利有效性',
  })
  validStatus: string | null;

  @ApiProperty({ description: '栏目id,专利只能选择专利相关的栏目id' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id,专利只能选择专利相关的栏目id',
  })
  columnId: string;

  // @ApiPropertyOptional({ description: '详情' })
  // @Column('jsonb', { name: 'content', nullable: true, comment: '详情' })
  // content: object | null;

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
  @Column('boolean', { name: 'enabled', nullable: true, default: 'true' })
  enabled: boolean ;
}
