
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export class LinkInfo {
  @ApiProperty({ description: '链接地址' })
  url: string;

  @ApiProperty({ description: '标题' })
  title: string;
}
@Index('website_pkey', ['id'], { unique: true })
@Entity('website')
export class Website {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiPropertyOptional({ description: '站点名称', type: String, nullable: true })
  @Column('character varying', { name: 'name', length: 128, nullable: true, comment: '站点名称' })
  name: string | null;

  @ApiPropertyOptional({ description: '网站备案号', type: String, nullable: true })
  @Column('character varying', { name: 'ipc', length: 128, nullable: true, comment: '网站备案号' })
  IPC: string | null;

  @ApiPropertyOptional({ description: 'CDN地址', type: String, nullable: true })
  @Column('character varying', { name: 'cdn', length: 128, nullable: true, comment: 'CND地址' })
  CDN: string | null;

  @ApiPropertyOptional({ description: '版本号', type: String, nullable: true })
  @Column('character varying', {
    name: 'version_no',
    length: 64,
    nullable: true,
    comment: '版本号',
  })
  versionNo: string | null;

  @ApiPropertyOptional({ description: '黑名单:ip分号隔开', type: String, nullable: true })
  @Column('character varying', {
    name: 'blacklist',
    length: 100,
    nullable: true,
    comment: '黑名单:ip分号隔开',
  })
  blacklist: string | null;

  @ApiPropertyOptional({ description: '标题', type: String, nullable: true })
  @Column('character varying', { name: 'title', length: 20, nullable: true, comment: '标题' })
  title: string | null;

  @ApiPropertyOptional({ description: '首页描述', type: String, nullable: true })
  @Column('character varying', {
    name: 'description',
    length: 20,
    nullable: true,
    comment: '首页描述',
  })
  description: string | null;

  @ApiPropertyOptional({ description: '版权所有', type: String, nullable: true })
  @Column('character varying', {
    name: 'ownership',
    length: 50,
    comment: '版权所有',
    nullable: true,
  })
  ownership: string | null;

  @ApiPropertyOptional({ description: '底部描述', type: String, nullable: true })
  @Column('character varying', {
    name: 'bottom_description',
    length: 50,
    comment: '底部描述',
    nullable: true,
  })
  bottomDescription: string | null;

  @ApiPropertyOptional({
    description: '友情链接 数组[{url:,title:xxx }]',
    type: LinkInfo,
    nullable: true,
    isArray: true,
  })
  @Column('jsonb', {
    name: 'links',
    comment: '友情链接 数组[{url:,title:xxx }]',
    nullable: true,
  })
  links: object | null;

  @ApiPropertyOptional({ description: 'logo', type: String, nullable: true })
  @Column('character varying', {
    name: 'logo',
    length: 256,
    comment: 'logo',
    nullable: true,
  })
  logo: string | null;

  @ApiPropertyOptional({ description: '手机端二维码', type: String, nullable: true })
  @Column('character varying', {
    name: 'qr_code',
    length: 256,
    nullable: true,
    comment: '手机二维码',
  })
  qrCode: string | null;
}
