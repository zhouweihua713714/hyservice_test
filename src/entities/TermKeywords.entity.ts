import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Terms } from './Terms.entity';

@Index('term_keywords_pkey', ['name', 'termId'], { unique: true })
@Entity('term_keywords')
export class TermKeywords {
  @ApiProperty({ description: '名称' })
  @Column('text', { name: 'name', primary: true, comment: '名称' })
  @Index()
  name: string;

  @ApiProperty({ description: '项目id' })
  @Column('character varying', {
    name: 'term_id',
    primary: true,
    comment: '项目id',
  })
  @Index()
  termId: string;

  @ApiProperty({ description: '栏目id' })
  @Column('character varying', { name: 'column_id', length: 128, comment: '栏目id' })
  @Index()
  columnId: string;

  @ApiProperty({ description: '标题' })
  @Column('text', { name: 'title',default:'', comment: '标题' })
  title: string;

  @ManyToOne(() => Terms, (terms) => terms.termKeywords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'term_id', referencedColumnName: 'id' }])
  term: Terms;
}
