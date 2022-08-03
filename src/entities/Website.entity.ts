import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('website_pkey', ['id'], { unique: true })
@Entity('website')
export class Website {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '站点名称' })
  @Column('character varying', { name: 'name', length: 128, nullable: true, comment: '站点名称' })
  name: string | null;

  @ApiProperty({ description: '网站备案号' })
  @Column('character varying', { name: 'ipc', length: 128, nullable: true, comment: '网站备案号' })
  IPC: string | null;

  @ApiProperty({ description: 'CDN地址' })
  @Column('character varying', { name: 'cdn', length: 128, nullable: true, comment: 'CND地址' })
  CDN: string | null;

  @ApiProperty({ description: '版本号' })
  @Column('character varying', {
    name: 'version_no',
    length: 64,
    nullable: true,
    comment: '版本号',
  })
  versionNo: string | null;

  @ApiProperty({ description: '黑名单' })
  @Column('jsonb', { name: 'blacklist', nullable: true, comment: '黑名单' })
  blacklist: object | null;

  @ApiProperty({ description: '标题' })
  @Column('character varying', { name: 'title', length: 256, nullable: true, comment: '标题' })
  title: string | null;

  @ApiProperty({ description: '首页描述' })
  @Column('character varying', {
    name: 'description',
    length: 256,
    nullable: true,
    comment: '首页描述',
  })
  description: string | null;

  @ApiProperty({ description: '版权所有' })
  @Column('character varying', {
    name: 'ownership',
    length: 256,
    nullable: true,
    comment: '版权所有',
  })
  ownership: string | null;

  @ApiProperty({ description: '底部描述' })
  @Column('character varying', {
    name: 'bottom_description',
    length: 256,
    nullable: true,
    comment: '底部描述',
  })
  bottomDescription: string | null;

  @ApiProperty({ description: '友情链接 数组[{url:,title:xxx }]' })
  @Column('character varying', {
    name: 'links',
    length: 256,
    nullable: true,
    comment: '友情链接 数组[{url:,title:xxx }]',
  })
  links: object | null;

  @ApiProperty({ description: '友情链接标题' })
  @Column('character varying', {
    name: 'links_title',
    length: 256,
    nullable: true,
    comment: '友情链接标题',
  })
  linksTitle: string | null;

  @ApiProperty({ description: '手机端二维码' })
  @Column('character varying', {
    name: 'qr_code',
    length: 256,
    nullable: true,
    comment: '手机二维码',
  })
  qrCode: string | null;
}
