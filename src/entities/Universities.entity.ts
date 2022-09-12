import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';

@Index('universities_pkey', ['id'], { unique: true })
@Entity('universities')
export class Universities {
  @ApiProperty({ description: '主键id' })
  @Column('character varying', { name: 'id', primary: true, length: 32, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '学校名称' })
  @Column('character varying', { name: 'name', length: 128, comment: '学校名称' })
  name: string;
}
