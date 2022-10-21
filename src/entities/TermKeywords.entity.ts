import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
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

  @JoinColumn([{ name: 'term_id', referencedColumnName: 'termId' }])
  term: Terms;
}
