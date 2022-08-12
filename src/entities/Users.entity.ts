import { User_Status_Enum, User_Types_Enum } from '../common/enums/common.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Logins } from './Logins.entity';

@Index('users_id_key', ['id'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Index('users_mobile_key', ['mobile'], { unique: true })
@Entity('users')
export class Users {
  @ApiProperty({ description: '用户id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户手机号' })
  @Column('character varying', { name: 'mobile', unique: true, length: 11, comment: '手机号码' })
  mobile: string;

  @ApiPropertyOptional({ description: '用户昵称', nullable: true })
  @Column('character varying', { name: 'name', nullable: true, length: 20, comment: '姓名' })
  name: string | null;

  @ApiPropertyOptional({ description: '用户拓展信息' , nullable: true})
  @Column('json', { name: 'info', default: {}, comment: '用户拓展信息' })
  info: object;

  @ApiProperty({ description: '创建时间' })
  @Column('date', { name: 'created_at', default: () => 'now()', comment: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: '性别' })
  @Column('character varying', {
    name: 'gender',
    default: 'unknown',
    length: 10,
    comment: '性别:男:male,女:female,未知:unknown',
  })
  gender: string;

  @ApiProperty({ description: '用户状态 是否有效:enabled,disabled 无效', enum: User_Status_Enum })
  @Column('character varying', {
    name: 'status',
    default: 'enabled',
    length: 10,
    comment: '是否有效:enabled,disabled 无效',
  })
  status: string;

  @ApiProperty({
    description: '用户类型:普通用户user,管理员admin,超级管理员administrator',
    enum: User_Types_Enum,
  })
  @Column('character varying', {
    name: 'type',
    default: 'user',
    length: 20,
    comment: '用户类型:普通用户user,管理员admin,超级管理员administrator',
  })
  type: string;

  @ApiProperty({ description: 'logins 信息' })
  @OneToMany(() => Logins, (logins) => logins.mobile)
  logins: Logins[];
}
