import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('conferences_pkey', ['id'], { unique: true })
@Entity('conferences')
export class Conferences {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '栏目id,会议只能选择会议相关的栏目id' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id,会议只能选择会议相关的栏目id',
  })
  columnId: string;

  @ApiProperty({ description: '会议缩写', type: String, nullable: true })
  @Column('character varying', {
    name: 'abbreviation',
    length: 50,
    nullable: true,
    comment: '会议缩写',
  })
  abbreviation: string | null;

  @ApiProperty({ description: '会议名称' })
  @Column('character varying', { name: 'name', length: 100, comment: '会议名称' })
  name: string;

  @ApiPropertyOptional({ description: '举办时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'conducted_at',
    nullable: true,
    comment: '举办时间',
  })
  conductedAt: Date | null;

  @ApiPropertyOptional({ description: '举办结束时间(个别数据有)', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'ended_at',
    nullable: true,
    comment: '举办结束时间(个别数据有)',
  })
  endedAt: Date | null;

  @ApiPropertyOptional({ description: '日期格式:year、month、date', type: String, nullable: true })
  @Column('character varying', { name: 'picker', nullable: true, comment: '日期格式:year、month、date' })
  picker: string | null;

  @ApiPropertyOptional({ description: '届', type: Number, nullable: true })
  @Column('integer', { name: 'period', nullable: true, comment: '届' })
  period: number | null;

  @ApiPropertyOptional({ description: '地点', type: String, nullable: true })
  @Column('character varying', {
    name: 'location',
    length: 50,
    nullable: true,
    comment: '地点',
  })
  location: string | null;

  @ApiPropertyOptional({ description: '会议简介/主题', type: String, nullable: true })
  @Column('text', { name: 'introduction', nullable: true, comment: '会议简介/主题' })
  introduction: string | null;

  @ApiPropertyOptional({ description: '封面链接', type: String, nullable: true })
  @Column('character varying', {
    name: 'cover_url',
    length: 200,
    nullable: true,
    comment: '封面链接',
  })
  coverUrl: string | null;

  @ApiPropertyOptional({
    description: '主领域,格式 [string,string]',
    type: String,
    isArray: true,
    nullable: true,
  })
  @Column('jsonb', {
    name: 'field',
    nullable: true,
    comment: '主领域,格式 [string,string]',
  })
  field: object | null;

  @ApiPropertyOptional({
    description: '子领域,格式 [string,string]',
    type: String,
    isArray: true,
    nullable: true,
  })
  @Column('jsonb', {
    name: 'minor_field',
    nullable: true,
    comment: '子领域,格式 [string,string]',
  })
  minorField: object | null;

  @ApiPropertyOptional({ description: '网站', type: String, nullable: true })
  @Column('character varying', { name: 'website', nullable: true, length: 200, comment: '网站' })
  website: string | null;

  @ApiPropertyOptional({ description: '联络人', type: String, nullable: true })
  @Column('character varying', { name: 'contact', nullable: true, length: 50, comment: '联络人' })
  contact: string | null;

  @ApiPropertyOptional({ description: '联络人邮箱', type: String, nullable: true })
  @Column('character varying', { name: 'email', nullable: true, length: 100, comment: '联络人邮箱' })
  email: string | null;

  @ApiPropertyOptional({ description: '举办单位', type: String, nullable: true })
  @Column('character varying', {
    name: 'unit',
    length: 50,
    nullable: true,
    comment: '举办单位',
  })
  unit: string | null;

  @ApiPropertyOptional({ description: '送稿截止时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'delivery_ended_at',
    nullable: true,
    comment: '送稿截止时间',
  })
  deliveryEndedAt: Date | null;

  @ApiPropertyOptional({ description: '提前注册截止时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'preregister_ended_at',
    nullable: true,
    comment: '提前注册截止时间',
  })
  preregisterEndedAt: Date | null;

  @ApiPropertyOptional({ description: '注册截止时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'register_ended_at',
    nullable: true,
    comment: '注册截止时间',
  })
  registerEndedAt: Date | null;

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
