import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Logins } from './Logins.entity';

@Index('users_id_key', ['id'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Index('users_mobile_key', ['mobile'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'mobile', unique: true, length: 11 , comment:'手机号码'})
  mobile: string;

  @Column('character varying', { name: 'name', nullable: true, length: 20 ,comment:'姓名'})
  name: string | null;

  @Column('json', { name: 'info', default: {},comment:'用户拓展信息' })
  info: object;

  @Column('date', { name: 'created_at', default: () => 'now()',comment:'创建时间' })
  createdAt: string;

  @Column('character varying', { name: 'gender',default: () => '\'unknown\'', length: 10 ,comment:'性别:男:male,女:female,未知:unknown'})
  gender: string ;

  @Column('character varying', { name: 'status',default: () => '\'enabled\'', length: 10 ,comment:'是否有效:enabled,disabled 无效'})
  status: string;

  @OneToMany(() => Logins, (logins) => logins.mobile)
  logins: Logins[];
}
