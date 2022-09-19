import { Content_Types_Enum } from '@/common/enums/common.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Treatises } from './Treatises.entity';

@Index('user_favorite_treatises_pkey', ['userId','treatiseId'], { unique: true })
@Entity('user_favorite_treatises')
export class UserFavoriteTreatises {
  // @ApiProperty({ description: 'id' })
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @ApiProperty({ description: '用户id' })
  @Column('character varying', { name: 'user_id',primary: true, length: 128, comment: '用户id' })
  userId: string;

  @ApiProperty({ description: '论文id' })
  @Column('character varying', {
    name: 'treatise_id',
    primary: true,
    length: 128,
    comment: '论文id',
  })
  treatiseId: string;

  @ApiProperty({ description: '创建时间' })
  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt: Date;

  @ManyToOne(() => Treatises, (treatises) => treatises.userFavoriteTreatises, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'treatise_id', referencedColumnName: 'id' }])
  treatise: Treatises;
}
