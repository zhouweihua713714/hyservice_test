import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Users } from './Users';

@Index('gender_types_pkey', ['enumId'], { unique: true })
@Entity('gender_types', { schema: 'public' })
export class GenderTypes {
  @Column('text', { primary: true, name: 'enum_id' })
  enumId: string;

  @Column('text', { name: 'description' })
  description: string;

  @OneToMany(() => Users, (users) => users.gender)
  users: Users[];
}
