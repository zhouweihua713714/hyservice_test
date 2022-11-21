import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TreatiseLibrary } from './TreatiseLibrary.entity';

@Index('treatise_library_keywords_pkey', ['name', 'treatiseId'], { unique: true })
@Entity('treatise_library_keywords')
export class TreatiseLibraryKeywords {
  @ApiProperty({ description: '名称' })
  @Column('text', { name: 'name', primary: true, comment: '名称' })
  @Index()
  name: string;

  @ApiProperty({ description: '精选文库id' })
  @Column('character varying', {
    name: 'treatise_id',
    primary: true,
    comment: '精选文库id',
  })
  @Index()
  treatiseId: string;

  @ApiProperty({ description: '栏目id' })
  @Column('character varying', { name: 'column_id', length: 128, comment: '栏目id' })
  @Index()
  columnId: string;

  @ApiProperty({ description: '精选文库标题' })
  @Column('text', { name: 'title',comment: '精选文库标题' })
  title: string;

  @ManyToOne(() => TreatiseLibrary, (treatiseLibrary) => treatiseLibrary.treatiseLibraryKeywords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'treatise_id', referencedColumnName: 'id' }])
  treatiseLibrary: TreatiseLibrary;
}
