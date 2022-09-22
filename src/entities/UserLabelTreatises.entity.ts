import { Content_Types_Enum } from '@/common/enums/common.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Treatises } from './Treatises.entity';

@Index('user_label_treatises_pkey', ['userId','treatiseId'], { unique: true })
@Entity('user_label_treatises')
export class UserLabelTreatises {
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

  @ApiProperty({ description: '标签:label_001 强烈推荐,label_002 写得好,label_003 有深度,label_004 很实用' })
  @Column('character varying', {
    name: 'label',
    length: 128,
    comment: '标签:label_001 强烈推荐,label_002 写得好,label_003 有深度,label_004 很实用',
  })
  label: string;

  @ApiProperty({ description: '创建时间' })
  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @ManyToOne(() => Treatises, (treatises) => treatises.userLabelTreatises, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'treatise_id', referencedColumnName: 'id' }])
  treatise: Treatises;
}
