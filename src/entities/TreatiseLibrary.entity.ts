import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { TreatiseLibraryKeywords } from './TreatiseLibraryKeywords.entity';

@Index('treatise_library_pkey', ['id'], { unique: true })
@Index('index_gin_treatise_library_title', { synchronize: false })
@Index('index_gin_treatise_library_keyword', { synchronize: false })
@Entity('treatise_library')
export class TreatiseLibrary {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '分类' })
  @Column('character varying', { name: 'sort', length: 128, comment: '分类' })
  sort: string;

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

  @ApiPropertyOptional({ description: '第一作者/作者全称', type: String, nullable: true })
  @Column('text', { name: 'author', nullable: true, comment: '第一作者/作者全称' })
  author: string | null;

  @ApiPropertyOptional({ description: '第一作者单位', type: String, nullable: true })
  @Column('text', {
    name: 'author_unit',
    nullable: true,
    comment: '第一作者单位',
  })
  authorUnit: string | null;

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

  @ApiPropertyOptional({ description: '杂志会议所属主领域', type: String, nullable: true })
  @Column('text', { name: 'magazine_field', nullable: true, comment: '杂志会议所属主领域' })
  magazineField: string | null;

  @ApiPropertyOptional({ description: '杂志会议所属子领域', type: String, nullable: true })
  @Column('text', {
    name: 'magazine_minor_field',
    nullable: true,
    comment: '杂志会议所属子领域',
  })
  magazineMinorField: string | null;

  @ApiPropertyOptional({ description: '摘要', type: String, nullable: true })
  @Column('text', { name: 'abstract', nullable: true, comment: '摘要' })
  abstract: string | null;

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

  @ApiProperty({
    description: '栏目id,精选文库只能选择精选文库相关的栏目且不为空',
    type: String,
  })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    comment: '栏目id,精选文库只能选择精选文库相关的栏目且不为空',
  })
  @Index()
  columnId: string;

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
  @Column('boolean', { name: 'enabled', nullable: true, default: true, comment: '是否有效 t是f否' })
  enabled: boolean;

  @OneToMany(() => TreatiseLibraryKeywords, (treatiseLibraryKeywords) => treatiseLibraryKeywords.treatiseLibrary)
  treatiseLibraryKeywords: TreatiseLibraryKeywords[];
}
