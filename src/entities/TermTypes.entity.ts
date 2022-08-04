import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('term_types_pkey', ['id'], { unique: true })
@Entity('term_types')
export class TermTypes {
  @ApiProperty({ description: '项目类型id' })
  @Column('character varying', { name: 'id', primary: true, length: 32, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '项目类型名称' })
  @Column('character varying', { name: 'name', length: 128, comment: '项目类型名称' })
  name: string;
}
