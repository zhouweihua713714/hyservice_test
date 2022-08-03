import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index('codes_id_key', ['mobile'], { unique: true })
@Index('codes_pkey', ['mobile'], { unique: true })
@Entity('codes')
export class Codes {
  @ApiProperty({ description: '手机号码' })
  @PrimaryColumn('text', { primary: true, name: 'mobile', comment: '手机号码' })
  mobile: string;

  @ApiProperty({ description: '验证码' })
  @Column('character varying', { name: 'code', length: 6, comment: '验证码' })
  code: string;

  @ApiProperty({ description: '发送时间' })
  @Column('timestamp with time zone', {
    name: 'sent_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '发送时间',
  })
  sentAt: Date;
}
