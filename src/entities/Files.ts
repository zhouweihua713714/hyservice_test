import { Column, Entity, Index } from 'typeorm';

@Index('files_pkey', ['id'], { unique: true })
@Entity('files', { schema: 'public' })
export class Files {
  @Column('text', { primary: true, name: 'id' })
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
