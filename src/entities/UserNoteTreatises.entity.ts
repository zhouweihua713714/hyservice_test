import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Treatises } from './Treatises.entity';

@Index('user_note_treatises_pkey', ['id'], { unique: true })
@Entity('user_note_treatises')
export class UserNoteTreatises {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户id' })
  @Column('character varying', { name: 'user_id', length: 128, comment: '用户id' })
  userId: string;

  @ApiProperty({ description: '论文id' })
  @Column('character varying', {
    name: 'treatise_id',
    length: 128,
    comment: '论文id',
  })
  treatiseId: string;

  @ApiProperty({ description: '笔记内容' })
  @Column('text', { name: 'content', comment: '笔记内容' })
  content: string;

  @ApiPropertyOptional({ description: '评论', type: String, nullable: true })
  @Column('text', { name: 'comment', nullable: true, comment: '评论' })
  comment: string | null;

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

  @ApiPropertyOptional({ description: '评论时间', type: Date, nullable: true })
  @Column('timestamp with time zone', {
    name: 'commented_at',
    nullable: true,
    comment: '评论时间',
  })
  commentedAt: Date | null;

  @ManyToOne(() => Treatises, (treatises) => treatises.userNoteTreatises, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'treatise_id', referencedColumnName: 'id' }])
  treatise: Treatises;
}
