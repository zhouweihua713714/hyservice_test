import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('files_pkey', ['id'], { unique: true })
@Entity('files')
export class Files {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '文件名' })
  @Column('text', { name: 'filename', comment: '文件名' })
  filename: string;

  @ApiProperty({ description: '文件状态默认0,1已上传' })
  @Column('smallint', { name: 'status', default: 0, comment: '文件状态默认0,1已上传' })
  status: number;

  @ApiPropertyOptional({ description: 'oss 信息', nullable: true })
  @Column('jsonb', { name: 'oss_info', nullable: true, comment: 'oss 信息' })
  ossInfo: object | null;

  @ApiProperty({ description: '创建时间' })
  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;
}
