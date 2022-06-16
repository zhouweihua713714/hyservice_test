import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users';

@Index('logins_pkey', ['mobile', 'provider'], { unique: true })
@Entity('logins', { schema: 'public' })
export class Logins {
  @Column('character varying', { primary: true, name: 'mobile', length: 11 })
  mobile: string;

  @Column('character varying', { name: 'token', length: 255 })
  token: string;

  @Column('character varying', { primary: true, name: 'provider', length: 20 })
  provider: string;

  // @ManyToOne(() => Users, (users) => users.logins, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'mobile', referencedColumnName: 'mobile' }])
  // mobile2: Users;
}
