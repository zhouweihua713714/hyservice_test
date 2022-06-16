import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Users } from './Users';

@Index('user_status_pkey', ['enumId'], { unique: true })
@Entity('user_status', { schema: 'public' })
export class UserStatus {
  @Column('text', { primary: true, name: 'enum_id' })
  enumId: string;

  @Column('text', { name: 'description' })
  description: string;

  @OneToMany(() => Users, (users) => users.status)
  users: Users[];
}
