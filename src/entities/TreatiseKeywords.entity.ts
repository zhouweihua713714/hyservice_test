import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Treatises } from './Treatises.entity';

@Index('treatise_keywords_pkey', ['name', 'treatiseId'], { unique: true })
@Entity('treatise_keywords')
export class TreatiseKeywords {
  @ApiProperty({ description: '名称' })
  @Column('text', { name: 'name', primary: true, comment: '名称' })
  @Index()
  name: string;

  @ApiProperty({ description: '论文id' })
  @Column('character varying', {
    name: 'treatise_id',
    primary: true,
    comment: '论文id',
  })
  @Index()
  treatiseId: string;

  @ApiProperty({ description: '栏目id' })
  @Column('character varying', { name: 'column_id', length: 128, comment: '栏目id' })
  @Index()
  columnId: string;

  @ApiProperty({ description: '论文标题' })
  @Column('text', { name: 'title', default: 0, comment: '论文标题' })
  title: string;

  @JoinColumn([{ name: 'treatise_id', referencedColumnName: 'treatiseId' }])
  treatise: Treatises;
}
