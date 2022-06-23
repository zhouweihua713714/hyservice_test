import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('files_pkey', ['id'], { unique: true })
@Entity('files')
export class Files {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'filename' })
  filename: string;

  @Column('smallint', { name: 'status', default: () => '0' })
  status: number;

  @Column('jsonb', { name: 'oss_info', nullable: true })
  ossInfo: object | null;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
