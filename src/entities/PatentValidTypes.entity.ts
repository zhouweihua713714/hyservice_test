import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('patent_valid_types_pkey', ['id'], { unique: true })
@Entity('patent_valid_types')
export class PatentValidTypes {
  @ApiProperty({ description: '专利类型id' })
  @Column('character varying', { name: 'id', primary: true, length: 32, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '专利类型名称' })
  @Column('character varying', { name: 'name', length: 128, comment: '专利类型名称' })
  name: string;
}
