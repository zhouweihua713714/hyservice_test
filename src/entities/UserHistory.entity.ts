import { Content_Types_Enum } from '@/common/enums/common.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('user_history_pkey', ['id'], { unique: true })
@Entity('user_history')
export class UserHistory {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户id' })
  @Column('character varying', { name: 'user_id', length: 128, comment: '用户id' })
  userId: string;

  @ApiProperty({ description: '关联的id(指的是内容管理相关的项目、论文等id根据类型区分)' })
  @Column('character varying', {
    name: 'related_id',
    length: 128,
    comment: '关联的id(指的是内容管理相关的项目、论文等id根据类型区分)',
  })
  relatedId: string;

  @ApiProperty({
    description:
      '关联的id的类型,方便后续查询具体数据,类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy',
  })
  @Column('character varying', {
    name: 'type',
    length: 64,
    comment:
      '关联的id的类型,方便后续查询具体数据,类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy',
  })
  type: string;

  @ApiProperty({ description: '创建时间' })
  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;
}
