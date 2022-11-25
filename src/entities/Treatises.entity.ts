import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TreatiseKeywords } from './TreatiseKeywords.entity';
import { UserFavoriteTreatises } from './UserFavoriteTreatises.entity';
import { UserLabelTreatises } from './UserLabelTreatises.entity';
import { UserNoteTreatises } from './UserNoteTreatises.entity';

@Index('treatises_pkey', ['id'], { unique: true })
@Index('index_gin_treatise_title', { synchronize: false })
@Index('index_gin_treatise_keyword', { synchronize: false })
// @Index('index_gin_treatise_abstract', { synchronize: false })
@Entity('treatises')
export class Treatises {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '论文标题' })
  @Column('text', { name: 'title', comment: '论文标题' })
  title: string;

  @ApiPropertyOptional({ description: '发表时间,单位:年', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'delivery_at',
    nullable: true,
    comment: '发表时间,单位:年',
  })
  deliveryAt: Date | null;

  @ApiPropertyOptional({
    description: '发表时间,冗余字段便于查询',
    type: Number,
    nullable: true,
  })
  @Column('integer', {
    name: 'year',
    nullable: true,
    comment: '发表时间,冗余字段便于查询',
  })
  year: number | null;

  @ApiPropertyOptional({ description: '科研人员所属国家或地区', type: String, nullable: true })
  @Column('text', {
    name: 'region',
    nullable: true,
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

  @ApiPropertyOptional({ description: '第一作者/作者全称', type: String, nullable: true })
  @Column('text', { name: 'author', nullable: true, comment: '第一作者/作者全称' })
  author: string | null;

  @ApiPropertyOptional({ description: '作者缩写', type: String, nullable: true })
  @Column('text', { name: 'author_abbreviation', nullable: true, comment: '第一作者' })
  authorAbbreviation: string | null;

  @ApiPropertyOptional({ description: '第一作者单位', type: String, nullable: true })
  @Column('text', {
    name: 'author_unit',
    nullable: true,
    comment: '第一作者单位',
  })
  authorUnit: string | null;

  @ApiPropertyOptional({ description: '作者地址', type: String, nullable: true })
  @Column('text', {
    name: 'author_address',
    nullable: true,
    comment: '作者地址',
  })
  authorAddress: string | null;

  @ApiPropertyOptional({ description: '通讯作者', type: String, nullable: true })
  @Column('text', {
    name: 'corresponding_author',
    nullable: true,
    comment: '通讯作者',
  })
  correspondingAuthor: string | null;

  @ApiPropertyOptional({ description: '通讯作者单位', type: String, nullable: true })
  @Column('text', {
    name: 'corresponding_author_unit',
    nullable: true,
    comment: '通讯作者单位',
  })
  correspondingAuthorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者地址', type: String, nullable: true })
  @Column('text', {
    name: 'corresponding_author_address',
    nullable: true,
    comment: '通讯作者地址',
  })
  correspondingAuthorAddress: string | null;

  @ApiPropertyOptional({ description: '通讯作者邮箱', type: String, nullable: true })
  @Column('text', {
    name: 'corresponding_author_email',
    nullable: true,
    comment: '通讯作者邮箱',
  })
  correspondingAuthorEmail: string | null;

  @ApiPropertyOptional({ description: '其他作者', type: String, nullable: true })
  @Column('text', {
    name: 'other_author',
    nullable: true,
    comment: '其他作者',
  })
  otherAuthor: string | null;

  @ApiPropertyOptional({ description: '其他作者单位', type: String, nullable: true })
  @Column('text', {
    name: 'other_author_unit',
    nullable: true,
    comment: '其他作者单位',
  })
  otherAuthorUnit: string | null;

  @ApiPropertyOptional({ description: '文章主领域', type: String, nullable: true })
  @Column('text', { name: 'field', nullable: true, comment: '文章主领域' })
  field: string | null;

  @ApiPropertyOptional({ description: '文章子领域', type: String, nullable: true })
  @Column('text', {
    name: 'minor_field',
    nullable: true,
    comment: '文章子领域',
  })
  minorField: string | null;

  @ApiPropertyOptional({ description: '文章类型', type: String, isArray: true, nullable: true })
  @Column('jsonb', {
    name: 'sort',
    nullable: true,
    comment: '文章类型',
  })
  sort: string[] | null;

  @ApiPropertyOptional({ description: '摘要', type: String, nullable: true })
  @Column('text', { name: 'abstract', nullable: true, comment: '摘要' })
  abstract: string | null;

  @ApiPropertyOptional({ description: '检索情况', type: String, nullable: true })
  @Column('text', { name: 'search', nullable: true, comment: '检索情况' })
  search: string | null;

  @ApiPropertyOptional({ description: '参考文献', type: String, nullable: true })
  @Column('text', { name: 'references', nullable: true, comment: '参考文献' })
  references: string | null;

  @ApiPropertyOptional({ description: '参考文献量', type: Number, nullable: true })
  @Column('integer', { name: 'references_number', nullable: true, comment: '参考文献量' })
  referencesNumber: number | null;

  @ApiPropertyOptional({ description: '引用情况(次数)/被引频合计', type: Number, nullable: true })
  @Column('integer', { name: 'quote', nullable: true, comment: '引用情况(次数)/被引频合计' })
  quote: number | null;

  @ApiPropertyOptional({ description: '所获得资助项目', type: String, nullable: true })
  @Column('text', { name: 'funded_project', nullable: true, comment: '所获得资助项目' })
  fundedProject: string | null;

  @ApiPropertyOptional({ description: '论文链接', type: String, nullable: true })
  @Column('text', { name: 'url', nullable: true, comment: '论文链接' })
  url: string | null;

  @ApiPropertyOptional({ description: '期刊/会议名', type: String, nullable: true })
  @Column('text', {
    name: 'name',
    comment: '期刊/会议名',
    nullable: true,
  })
  name: string | null;

  @ApiPropertyOptional({ description: '出版商', type: String, nullable: true })
  @Column('text', {
    name: 'publisher',
    nullable: true,
    comment: '出版商',
  })
  publisher: string | null;

  @ApiPropertyOptional({ description: '出版商地址', type: String, nullable: true })
  @Column('text', {
    name: 'publisher_address',
    nullable: true,
    comment: '出版商',
  })
  publisherAddress: string | null;

  @ApiPropertyOptional({ description: '期刊名称', type: String, nullable: true })
  @Column('text', {
    name: 'periodical',
    nullable: true,
    comment: '期刊名称',
  })
  periodical: string | null;

  @ApiPropertyOptional({ description: '期刊简称', type: String, nullable: true })
  @Column('text', {
    name: 'periodical_abbreviation',
    nullable: true,
    comment: '期刊简称',
  })
  periodicalAbbreviation: string | null;

  @ApiPropertyOptional({ description: '出版年', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'released_at',
    nullable: true,
    comment: '出版年',
  })
  releasedAt: Date | null;

  @ApiPropertyOptional({ description: 'doi 论文唯一id', type: String, nullable: true })
  @Column('text', {
    name: 'doi',
    nullable: true,
    comment: 'doi 论文唯一id',
  })
  doi: string | null;

  @ApiPropertyOptional({ description: '研究方向', type: String, nullable: true })
  @Column('text', {
    name: ' study_field',
    nullable: true,
    comment: '研究方向',
  })
  studyField: string | null;

  @ApiProperty({
    description: '栏目id,期刊论文只能选择期刊相关的栏目且不为空',
    type: String,
  })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id,期刊论文只能选择期刊相关的栏目且不为空',
  })
  @Index()
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
  @Column('text', {
    name: 'keyword',
    nullable: true,
    comment: '关键字',
  })
  keyword: string | null;

  @ApiPropertyOptional({ description: '一级主题', type: String, nullable: true })
  @Column('text', {
    name: 'topic',
    nullable: true,
    comment: '一级主题',
  })
  topic: string | null;

  @ApiPropertyOptional({ description: '二级主题', type: String, nullable: true })
  @Column('text', {
    name: 'child_topic',
    nullable: true,
    comment: '二级主题',
  })
  childTopic: string | null;

  @ApiPropertyOptional({ description: '研究目标', type: String, nullable: true })
  @Column('text', {
    name: 'goal',
    nullable: true,
    comment: '研究目标',
  })
  goal: string | null;

  @ApiPropertyOptional({ description: '研究对象,这里会是多个分号隔开', type: String, nullable: true })
  @Column('text', {
    name: 'object',
    nullable: true,
    comment: '研究对象,这里会是多个分号隔开',
  })
  object: string | null;

  @ApiPropertyOptional({ description: '研究范式', type: String, nullable: true })
  @Column('text', {
    name: 'paradigm',
    nullable: true,
    comment: '研究范式',
  })
  paradigm: string | null;


  @ApiPropertyOptional({ description: '数据分析方式,这里会是多个分号隔开', type: String, nullable: true })
  @Column('text', {
    name: 'method',
    nullable: true,
    comment: '数据分析方式,这里会是多个分号隔开',
  })
  method: string | null;

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

  @OneToMany(() => UserFavoriteTreatises, (userFavoriteTreatises) => userFavoriteTreatises.treatise)
  userFavoriteTreatises: UserFavoriteTreatises[];

  @OneToMany(() => UserLabelTreatises, (userLabelTreatises) => userLabelTreatises.treatise)
  userLabelTreatises: UserLabelTreatises[];

  @OneToMany(() => UserNoteTreatises, (userNoteTreatises) => userNoteTreatises.treatise)
  userNoteTreatises: UserNoteTreatises[];

  @OneToMany(() => TreatiseKeywords, (treatiseKeywords) => treatiseKeywords.treatise)
  treatiseKeywords: TreatiseKeywords[];
}
