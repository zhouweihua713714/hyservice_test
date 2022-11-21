import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('treatise_library_types_pkey', ['id'], { unique: true })
@Entity('treatise_library_types')
export class TreatiseLibraryTypes {
  @ApiProperty({ description: '主键id' })
  @Column('character varying', { name: 'id', primary: true, length: 128, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '名称' })
  @Column('character varying', { name: 'name',  comment: '名称' })
  name: string;

  @ApiPropertyOptional({
    description: '栏目id,精选文库只能选择精选文库相关的栏目且不为空',
    type: String,
  })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    nullable: true,
    comment: '栏目id,精选文库只能选择精选文库相关的栏目且不为空',
  })
  @Index()
  columnId: string;

}
