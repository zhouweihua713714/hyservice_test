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

  @ApiProperty({ description: '会议缩写' })
  @Column('character varying', { name: 'abbreviation', length: 50, comment: '会议缩写' })
  abbreviation: string;

  @ApiProperty({ description: '会议名称' })
  @Column('character varying', { name: 'name', length: 50, comment: '会议名称' })
  name: string;

  @ApiPropertyOptional({ description: '举办时间' })
  @Column('timestamp with time zone', {
    name: 'conducted_at',
    nullable: true,
    comment: '举办时间',
  })
  conductedAt: Date | null;

  @ApiPropertyOptional({ description: '举办结束时间(个别数据有)' })
  @Column('timestamp with time zone', {
    name: 'ended_at',
    nullable: true,
    comment: '举办结束时间(个别数据有)',
  })
  endedAt: Date | null;

  @ApiPropertyOptional({ description: '届' })
  @Column('integer', { name: 'period', nullable: true, comment: '届' })
  period: number | null;

  @ApiPropertyOptional({ description: '地点' })
  @Column('character varying', {
    name: 'location',
    length: 50,
    nullable: true,
    comment: '地点',
  })
  location: string | null;

  @ApiPropertyOptional({ description: '会议简介/主题' })
  @Column('text', { name: 'introduction', nullable: true, comment: '会议简介/主题' })
  introduction: string | null;

  @ApiPropertyOptional({ description: '主领域,格式 [string,string]' })
  @Column('jsonb', {
    name: 'field',
    nullable: true,
    comment: '主领域,格式 [string,string]',
  })
  field: object | null;

  @ApiPropertyOptional({ description: '子领域,格式 [string,string]' })
  @Column('jsonb', {
    name: 'minor_field',
    nullable: true,
    comment: '子领域,格式 [string,string]',
  })
  minorField: object | null;

  @ApiPropertyOptional({ description: '网站' })
  @Column('character varying', { name: 'website', nullable: true, length: 50, comment: '网站' })
  website: string | null;

  @ApiPropertyOptional({ description: '联络人' })
  @Column('character varying', { name: 'contact', nullable: true, length: 50, comment: '联络人' })
  contact: string | null;

  @ApiPropertyOptional({ description: '联络人邮箱' })
  @Column('character varying', { name: 'email', nullable: true, length: 50, comment: '联络人邮箱' })
  email: string | null;

  @ApiPropertyOptional({ description: '举办单位' })
  @Column('character varying', {
    name: 'unit',
    length: 50,
    nullable: true,
    comment: '举办单位',
  })
  organizer: string | null;

  @ApiPropertyOptional({ description: '送稿截止时间' })
  @Column('timestamp with time zone', {
    name: 'delivery_ended_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '送稿截止时间',
  })
  deliveryEndedAt: Date | null;

  @ApiPropertyOptional({ description: '提前注册截止时间' })
  @Column('timestamp with time zone', {
    name: 'preregister_ended_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '提前注册截止时间',
  })
  preregisterEndedAt: Date | null;

  @ApiPropertyOptional({ description: '注册截止时间' })
  @Column('timestamp with time zone', {
    name: 'register_ended_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
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
  @Column('boolean', { name: 'enabled', nullable: true, default: true  })
  enabled: boolean ;
}
