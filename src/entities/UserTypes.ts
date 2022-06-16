import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Users } from './Users';

@Index('user_types_pkey', ['enumId'], { unique: true })
@Entity('user_types', { schema: 'public' })
export class UserTypes {
  @Column('text', { primary: true, name: 'enum_id' })
  enumId: string;

  @Column('text', { name: 'description' })
  description: string;

  @OneToMany(() => Users, (users) => users.type)
  users: Users[];
}
