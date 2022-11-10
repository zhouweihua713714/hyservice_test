import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AmericaTerms } from './AmericaTerms.entity';

@Index('america_term_keywords_pkey', ['name', 'awardNumber'], { unique: true })
@Entity('america_term_keywords')
export class AmericaTermKeywords {
  @ApiProperty({ description: '名称' })
  @Column('text', { name: 'name', primary: true, comment: '名称' })
  @Index()
  name: string;

  @ApiProperty({ description: 'awardNumber, 资助编号, 作为id' })
  @Column('character varying', { name: 'award_number', primary: true, length: 128, comment: '资助编号' })
  awardNumber: string;

  @ApiProperty({ description: 'title' })
  @Column('character varying', { name: 'title', comment: 'title' })
  title: string;

  @ApiProperty({ description: '栏目id' })
  @Column('character varying', { name: 'column_id', length: 128, comment: '栏目id' })
  @Index()
  columnId: string;

  @ManyToOne(() => AmericaTerms, (americaTerm) => americaTerm.americaTermKeywords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'award_number', referencedColumnName: 'awardNumber' }])
  americaTerm: AmericaTerms;
}
