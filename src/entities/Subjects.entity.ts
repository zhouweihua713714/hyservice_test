import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('subjects_pkey', ['id'], { unique: true })
@Entity('subjects')
export class Subjects {
  @ApiProperty({ description: '学科id' })
  @Column('character varying', { name: 'id', primary: true, length: 32, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '学科名称' })
  @Column('character varying', { name: 'name', length: 128, comment: '学科名称' })
  name: string;
}
