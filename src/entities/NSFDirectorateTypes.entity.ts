import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';

@Index('nsf_directorate_types_pkey', ['id'], { unique: true })
@Entity('nsf_directorate_types')
export class NSFDirectorateTypes {
  @ApiProperty({ description: '主键id' })
  @Column('character varying', { name: 'id', primary: true, length: 32, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '学部名称' })
  @Column('character varying', { name: 'name', length: 128, comment: '学部名称' })
  name: string;
}
