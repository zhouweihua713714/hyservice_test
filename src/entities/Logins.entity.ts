import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users.entity';

@Index('logins_pkey', ['mobile', 'provider'], { unique: true })
@Entity('logins')
export class Logins {
  @ApiProperty({ description: '手机号码' })
  @Column('character varying', { primary: true, name: 'mobile', length: 11,comment:'手机号码' })
  mobile: string;

  @ApiProperty({ description: '用户密码加密' })
  @Column('character varying', { name: 'token', length: 255 ,comment:'密码'})
  token: string;

  @ApiProperty({ description: '来源' })
  @Column('character varying', { primary: true, name: 'provider', length: 20 ,comment:'来源'})
  provider: string;

  @ApiProperty({ description: 'user info' })
  @ManyToOne(() => Users, (users) => users.logins, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
  mobile_user: Users;
}
