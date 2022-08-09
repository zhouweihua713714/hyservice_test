import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('treatises_pkey', ['id'], { unique: true })
@Entity('treatises')
export class Treatises {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '论文标题' })
  @Column('character varying', { name: 'title', length: 50, comment: '论文标题' })
  title: string;

  @ApiPropertyOptional({ description: '发表时间,单位:年' })
  @Column('timestamp with time zone', {
    name: 'delivery_at',
    nullable: true,
    comment: '发表时间,单位:年',
  })
  deliveryAt: string | null;

  @ApiPropertyOptional({ description: '科研人员所属国家或地区' })
  @Column('character varying', {
    name: 'region',
    nullable: true,
    length: 50,
    comment: '科研人员所属国家或地区',
  })
  region: string | null;

  @ApiPropertyOptional({ description: '发表途径:期刊way_001,会议way_002,EDM会议way003,书way_004' })
  @Column('character varying', { name: 'channel', nullable: true, length: 32, comment: '发表途径:期刊way_001,会议way_002,EDM会议way003' })
  channel: string | null;

  @ApiPropertyOptional({ description: '语种' })
  @Column('character varying', {
    name: 'language',
    length: 10,
    nullable: true,
    default: 'CN',
    comment: '语种',
  })
  language: string | null;

  @ApiPropertyOptional({ description: '第一作者' })
  @Column('character varying', { name: 'author', nullable: true, length: 32, comment: '第一作者' })
  author: string | null;

  @ApiPropertyOptional({ description: '第一作者单位' })
  @Column('character varying', {
    name: 'author_unit',
    nullable: true,
    length: 128,
    comment: '第一作者单位',
  })
  authorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者' })
  @Column('character varying', {
    name: 'corresponding_author',
    nullable: true,
    length: 32,
    comment: '通讯作者',
  })
  correspondingAuthor: string | null;

  @ApiPropertyOptional({ description: '通讯作者单位' })
  @Column('character varying', {
    name: 'corresponding_author_unit',
    nullable: true,
    length: 128,
    comment: '通讯作者单位',
  })
  correspondingAuthorUnit: string | null;

  @ApiPropertyOptional({ description: '通讯作者邮箱' })
  @Column('character varying', {
    name: 'corresponding_author_email',
    nullable: true,
    length: 128,
    comment: '通讯作者邮箱',
  })
  correspondingAuthorEmail: string | null;

  @ApiPropertyOptional({ description: '其他作者' })
  @Column('character varying', {
    name: 'other_author',
    nullable: true,
    length: 128,
    comment: '其他作者',
  })
  otherAuthor: string | null;

  @ApiPropertyOptional({ description: '其他作者单位' })
  @Column('character varying', {
    name: 'other_author_unit',
    nullable: true,
    length: 128,
    comment: '其他作者单位',
  })
  otherAuthorUnit: string | null;

  @ApiPropertyOptional({ description: '文章主领域' })
  @Column('character varying', { name: 'field', length: 50, nullable: true, comment: '文章主领域' })
  field: string | null;

  @ApiPropertyOptional({ description: '文章子领域' })
  @Column('character varying', {
    name: 'minor_field',
    length: 50,
    nullable: true,
    comment: '文章子领域',
  })
  minorField: string | null;

  @ApiPropertyOptional({ description: '文章类型' })
  @Column('character varying', {
    name: 'sort',
    length: 32,
    nullable: true,
    comment: '文章类型',
  })
  sort: string | null;

  @ApiPropertyOptional({ description: '摘要' })
  @Column('text', { name: 'abstract', nullable: true, comment: '摘要' })
  abstract: string | null;

  @ApiPropertyOptional({ description: '检索情况' })
  @Column('character varying', { name: 'search', nullable: true, length: 32, comment: '检索情况' })
  search: string | null;

  @ApiPropertyOptional({ description: '参考文献' })
  @Column('text', { name: 'references', nullable: true, comment: '参考文献' })
  references: string | null;

  @ApiPropertyOptional({ description: '引用情况(次数)' })
  @Column('integer', { name: 'quote', nullable: true, comment: '引用情况(次数)' })
  quote: number | null;

  @ApiPropertyOptional({ description: '所获得资助项目' })
  @Column('integer', { name: 'funded_project', nullable: true, comment: '所获得资助项目' })
  fundedProject: number | null;

  @ApiPropertyOptional({ description: '论文链接' })
  @Column('character varying', { name: 'url', nullable: true, length: 128, comment: '论文链接' })
  url: number | null;

  @ApiPropertyOptional({ description: '期刊/会议名称,根据论文的类型区分' })
  @Column('character varying', {
    name: 'name',
    length: 128,
    nullable: true,
    comment: '期刊/会议名称,根据论文的类型区分',
  })
  name: string | null;

  @ApiPropertyOptional({ description: '杂志会议所属主领域' })
  @Column('character varying', {
    name: 'conference_field',
    length: 64,
    nullable: true,
    comment: '杂志会议所属主领域',
  })
  conferenceField: string | null;

  @ApiPropertyOptional({ description: '杂志会议所属文章子领域' })
  @Column('character varying', {
    name: 'conference_minor_field',
    length: 64,
    nullable: true,
    comment: '杂志会议所属子领域',
  })
  conferenceMinorField: string | null;

  @ApiProperty({ description: '论文类型:会议论文conference、期刊论文treatise' })
  @Column('character varying', {
    name: 'type',
    length: 64,
    default: 'treatise',
    comment: '论文类型:会议论文conference、期刊论文treatise',
  })
  type: string;

  @ApiPropertyOptional({ description: '栏目id,期刊论文只能选择期刊相关的栏目且不为空' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    nullable: true,
    comment: '栏目id,期刊论文只能选择期刊相关的栏目且不为空',
  })
  columnId: string | null;

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

  @ApiPropertyOptional({ description: '录入人id' })
  @Column('character varying', {
    name: 'owner_id',
    length:128,
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
