import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('institutions_pkey', ['id'], { unique: true })
@Entity('institutions')
export class Institutions {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '栏目id,机构只能选择机构相关的栏目id' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id,机构只能选择机构相关的栏目id',
  })
  columnId: string;

  @ApiProperty({ description: '中文机构名称' })
  @Column('character varying', { name: 'name', length: 50, comment: '中文机构名称' })
  name: string;

  @ApiProperty({ description: '外文机构名称' })
  @Column('character varying', { name: 'foreign_name', length: 50, comment: '外文机构名称' })
  foreignName: string;

  @ApiProperty({ description: '详细地址' })
  @Column('character varying', { name: 'address', length: 50, comment: '详细地址' })
  address: string;

  @ApiPropertyOptional({ description: '简介' })
  @Column('text', { name: 'introduction', nullable: true, comment: '简介' })
  introduction: string | null;

  @ApiProperty({ description: '网站' })
  @Column('character varying', { name: 'website', length: 50, comment: '网站' })
  website: string;

  @ApiPropertyOptional({ description: '主办单位' })
  @Column('character varying', {
    name: 'unit',
    length: 50,
    nullable: true,
    comment: '主办单位',
  })
  organizer: string | null;

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

  @ApiPropertyOptional({ description: '经度' })
  @Column('decimal', {
    name: 'longitude',
    precision:10,
    scale:6,
    nullable: true,
    comment: '子领域',
  })
  longitude: number | null;

  @ApiPropertyOptional({ description: '纬度' })
  @Column('decimal', {
    name: 'latitude',
    precision:10,
    scale:6,
    nullable: true,
    comment: '子领域',
  })
  latitude: number | null;

  @ApiPropertyOptional({ description: '图片链接' })
  @Column('character varying', {
    name: 'url',
    length: 64,
    nullable: true,
    comment: '图片链接',
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

 @ApiPropertyOptional({ description: '关键字' })
  @Column('character varying', {
    name: 'keyword',
    length: 100,
    nullable: true,
    comment: '关键字',
  })
  keyword: string | null;

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
