import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('columns_pkey', ['id'], { unique: true })
@Entity('columns')
export class Columns {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 32, comment: '主键id' })
  id: string;

  @ApiProperty({ description: '栏目名称' })
  @Column('character varying', { name: 'name', length: 128, comment: '栏目名称' })
  name: string;

  @ApiProperty({ description: '父级id' })
  @Column('character varying', { name: 'parent_id', length: 128, comment: '父级id' })
  parentId: string;

  @ApiProperty({ description: '排序', nullable: true, type: Number })
  @Column('integer', { name: 'sequence_number', comment: '排序', nullable: true })
  sequenceNumber: number | null;

  @ApiProperty({ description: '是否隐藏:1是,0否' })
  @Column('smallint', { name: 'is_hide', default: '0', comment: '是否隐藏:1是,0否' })
  isHide: number;

  @ApiPropertyOptional({ description: '栏目介绍', nullable: true, type: String })
  @Column('text', { name: 'introduction', nullable: true, comment: '栏目介绍' })
  introduction: string;
}
