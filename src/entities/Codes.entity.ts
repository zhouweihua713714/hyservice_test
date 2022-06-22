import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index('codes_id_key', ['mobile'], { unique: true })
@Index('codes_pkey', ['mobile'], { unique: true })
@Entity('codes', { schema: 'public' })
export class Codes {
  @PrimaryColumn('text', { primary: true, name: 'mobile' })
  mobile: string;

  @Column('character varying', { name: 'code', length: 6 })
  code: string;

  @Column('timestamp with time zone', {
    name: 'sent_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sentAt: Date;
}
