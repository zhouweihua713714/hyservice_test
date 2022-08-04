import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('languages_pkey', ['id'], { unique: true })
@Entity('languages')
export class Languages {
  @ApiProperty({ description: '主键id' })
  @Column('character varying', { name: 'id', primary: true, length: 32, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '名称' })
  @Column('character varying', { name: 'name', length: 128, comment: '名称' })
  name: string;

}
