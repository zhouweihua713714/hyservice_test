import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('treatises_pkey', ['id'], { unique: true })
@Entity('treatises')
export class Treatises {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '论文标题' })
  @Column('character varying', { name: 'title', length: 200, comment: '论文标题' })
  title: string;

  @ApiPropertyOptional({ description: '发表时间,单位:年', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'delivery_at',
    nullable: true,
    comment: '发表时间,单位:年',
  })
  deliveryAt: Date | null;

  @ApiPropertyOptional({ description: '科研人员所属国家或地区', type: String, nullable: true })
  @Column('character varying', {
    name: 'region',
    nullable: true,
    length: 200,
    comment: '科研人员所属国家或地区',
  })
  region: string | null;

  @ApiPropertyOptional({
    description: '发表途径:期刊way_001,会议way_002,EDM会议way003,书way_004',
    type: String,
    nullable: true,
  })
  @Column('character varying', {
    name: 'channel',
    nullable: true,
    length: 32,
    comment: '发表途径:期刊way_001,会议way_002,EDM会议way003,书way_004',
  })
  channel: string | null;

  @ApiPropertyOptional({ description: '语种', type: String, nullable: true })
  @Column('character varying', {
    name: 'language',
    length: 20,
    nullable: true,
    comment: '语种',
  })
  language: string | null;

  @ApiPropertyOptional({ description: '第一作者', type: String, nullable: true })
  @Column('character varying', { name: 'author', nullable: true, length: 50, comment: '第一作者' })
  author: string | null;

  @ApiPropertyOptional({ description: '第一作者单位', type: String, nullable: true })
  @Column('character varying', {
    name: 'author_unit',
    nullable: true,
    length: 200,
    comment: '第一作者单位',
  })
  authorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者', type: String, nullable: true })
  @Column('character varying', {
    name: 'corresponding_author',
    nullable: true,
    length: 200,
    comment: '通讯作者',
  })
  correspondingAuthor: string | null;

  @ApiPropertyOptional({ description: '通讯作者单位', type: String, nullable: true })
  @Column('character varying', {
    name: 'corresponding_author_unit',
    nullable: true,
    length: 200,
    comment: '通讯作者单位',
  })
  correspondingAuthorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者邮箱', type: String, nullable: true })
  @Column('character varying', {
    name: 'corresponding_author_email',
    nullable: true,
    length: 200,
    comment: '通讯作者邮箱',
  })
  correspondingAuthorEmail: string | null;

  @ApiPropertyOptional({ description: '其他作者', type: String, nullable: true })
  @Column('character varying', {
    name: 'other_author',
    nullable: true,
    length: 200,
    comment: '其他作者',
  })
  otherAuthor: string | null;

  @ApiPropertyOptional({ description: '其他作者单位', type: String, nullable: true })
  @Column('character varying', {
    name: 'other_author_unit',
    nullable: true,
    length: 200,
    comment: '其他作者单位',
  })
  otherAuthorUnit: string | null;

  @ApiPropertyOptional({ description: '文章主领域', type: String, nullable: true })
  @Column('character varying', { name: 'field', length: 50, nullable: true, comment: '文章主领域' })
  field: string | null;

  @ApiPropertyOptional({ description: '文章子领域', type: String, nullable: true })
  @Column('character varying', {
    name: 'minor_field',
    length: 50,
    nullable: true,
    comment: '文章子领域',
  })
  minorField: string | null;

  @ApiPropertyOptional({ description: '文章类型', type: String, nullable: true })
  @Column('character varying', {
    name: 'sort',
    length: 50,
    nullable: true,
    comment: '文章类型',
  })
  sort: string | null;

  @ApiPropertyOptional({ description: '摘要', type: String, nullable: true })
  @Column('text', { name: 'abstract', nullable: true, comment: '摘要' })
  abstract: string | null;

  @ApiPropertyOptional({ description: '检索情况', type: String, nullable: true })
  @Column('character varying', { name: 'search', nullable: true, length: 100, comment: '检索情况' })
  search: string | null;

  @ApiPropertyOptional({ description: '参考文献', type: String, nullable: true })
  @Column('text', { name: 'references', nullable: true, comment: '参考文献' })
  references: string | null;

  @ApiPropertyOptional({ description: '引用情况(次数)', type: Number, nullable: true })
  @Column('integer', { name: 'quote', nullable: true, comment: '引用情况(次数)' })
  quote: number | null;

  @ApiPropertyOptional({ description: '所获得资助项目', type: String, nullable: true })
  @Column('text', { name: 'funded_project', nullable: true, comment: '所获得资助项目' })
  fundedProject: string | null;

  @ApiPropertyOptional({ description: '论文链接', type: String, nullable: true })
  @Column('character varying', { name: 'url', nullable: true, length: 200, comment: '论文链接' })
  url: string | null;

  @ApiPropertyOptional({ description: '期刊/会议名' })
  @Column('character varying', {
    name: 'name',
    length: 200,
    comment: '期刊/会议名',
    nullable:true
  })
  name: string | null;

  @ApiPropertyOptional({
    description: '栏目id,期刊论文只能选择期刊相关的栏目且不为空',
    type: String,
  })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    nullable: true,
    comment: '栏目id,期刊论文只能选择期刊相关的栏目且不为空',
  })
  columnId: string;

  // @ApiPropertyOptional({ description: '会议id,会议论文不为空' })
  // @Column('character varying', {
  //   name: 'conference_id',
  //   length: 128,
  //   nullable: true,
  //   comment: '会议id,会议论文不为空',
  // })
  // conferenceId: string | null;

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

  @ApiPropertyOptional({ description: '关键字', type: String, nullable: true })
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
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @Column('timestamp with time zone', {
    name: 'updated_at',
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

  @ApiPropertyOptional({ description: '删除时间', type: Date })
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
