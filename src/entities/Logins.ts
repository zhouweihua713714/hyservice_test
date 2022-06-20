import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users';

@Index('logins_pkey', ['mobile', 'provider'], { unique: true })
@Entity('logins', { schema: 'public' })
export class Logins {
  @Column('character varying', { primary: true, name: 'mobile', length: 11,comment:'手机号码' })
  mobile: string;

  @Column('character varying', { name: 'token', length: 255 ,comment:'密码'})
  token: string;

  @Column('character varying', { primary: true, name: 'provider', length: 20 ,comment:'来源'})
  provider: string;

  @ManyToOne(() => Users, (users) => users.logins, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mobile', referencedColumnName: 'mobile' }])
  mobile2: Users;
}
