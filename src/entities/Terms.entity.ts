import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('terms_pkey', ['id'], { unique: true })
@Entity('terms')
export class Terms {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiPropertyOptional({ description: '项目编号' })
  @Column('character varying', {
    name: 'term_number',
    length: 50,
    nullable: true,
    comment: '项目编号',
  })
  termNumber: string | null;

  @ApiPropertyOptional({ description: '项目负责人' })
  @Column('character varying', { name: 'principal', length: 50, nullable: true, comment: '负责人' })
  principal: string | null;

  @ApiPropertyOptional({ description: '依托单位' })
  @Column('character varying', { name: 'unit', length: 50, nullable: true, comment: '依托单位' })
  unit: string | null;

  @ApiPropertyOptional({ description: '省份' })
  @Column('character varying', { name: 'province', length: 50, nullable: true, comment: '省份' })
  province: string | null;

  @ApiPropertyOptional({ description: '金额(万元)' })
  @Column('decimal', {
    name: 'money',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: '金额(万元)',
  })
  money: number | null;

  @ApiPropertyOptional({ description: '项目类型' })
  @Column('character varying', { name: 'type', length: 64, nullable: true, comment: '项目类型' })
  type: string | null;

  @ApiPropertyOptional({ description: '学部' })
  @Column('character varying', { name: 'department', length: 64, nullable: true, comment: '学部' })
  department: string | null;

  @ApiPropertyOptional({ description: '批准时间(年份)' })
  @Column('timestamp with time zone', {
    name: 'authorized_at',
    nullable: true,
    comment: '批准时间(年份)',
  })
  authorizedAt: number | null;

  @ApiProperty({ description: '项目名称' })
  @Column('character varying', { name: 'name', length: 50, comment: '项目名称' })
  name: string;

  @ApiProperty({ description: '学科分类' })
  @Column('character varying', { name: 'subject', nullable: true, length: 50, comment: '学科分类' })
  subject: string | null;

  @ApiProperty({ description: '学科代码' })
  @Column('character varying', {
    name: 'subject_no',
    nullable: true,
    length: 50,
    comment: '学科代码',
  })
  subjectNo: string | null;

  @ApiProperty({ description: '执行时间,开始时间' })
  @Column('timestamp with time zone', {
    name: 'started_at',
    nullable: true,
    comment: '执行时间,开始时间',
  })
  startedAt: string | null;

  @ApiProperty({ description: '执行时间,结束时间' })
  @Column('timestamp with time zone', {
    name: 'ended_at',
    nullable: true,
    comment: '执行时间,结束时间',
  })
  endedAt: string | null;

  @ApiPropertyOptional({ description: '关键字' })
  @Column('character varying', {
    name: 'keyword',
    length: 100,
    nullable: true,
    comment: '关键字',
  })
  keyword: string | null;

  @ApiProperty({ description: '栏目id,项目只能选择相关的栏目id' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id,项目只能选择相关的栏目id',
  })
  columnId: string;

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
