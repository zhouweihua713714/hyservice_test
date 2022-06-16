import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GenderTypes } from './GenderTypes';
import { UserStatus } from './UserStatus';
import { UserTypes } from './UserTypes';
import { Logins } from './Logins';

@Index('users_id_key', ['id'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Index('users_mobile_key', ['mobile'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @Column('text', {
    primary: true,
    name: 'id',
    // default: () => 'uuid',
  })
  id: string;

  @Column('character varying', { name: 'mobile', unique: true, length: 11 })
  mobile: string;

  @Column('character varying', { name: 'name', nullable: true, length: 20 })
  name: string | null;

  @Column('json', { name: 'info', default: {} })
  info: object;

  @Column('date', { name: 'created_at', default: () => 'now()' })
  createdAt: string;


  // @OneToMany(() => Logins, (logins) => logins.mobile2)
  // logins: Logins[];


  @ManyToOne(() => GenderTypes, (genderTypes) => genderTypes.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'gender', referencedColumnName: 'enumId' }])
  gender: GenderTypes;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'status', referencedColumnName: 'enumId' }])
  status: UserStatus;

  @ManyToOne(() => UserTypes, (userTypes) => userTypes.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'type', referencedColumnName: 'enumId' }])
  type: UserTypes;
}
