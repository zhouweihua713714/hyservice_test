import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('user_keyword_statistics')
export class UserKeywordStatistics {

  @ApiProperty({ description: '用户id' })
  @Column('character varying', { name: 'user_id',primary: true, length: 128, comment: '用户id' })
  userId: string;

  @ApiProperty({ description: '关键字' })
  @Column('text', { name: 'keyword', primary: true, comment: '关键字' })
  keyword: string;

  @ApiProperty({ description: '栏目id,政策解读只能选择政策相关的栏目id' })
  @Column('character varying', {
    name: 'column_id',
    length: 128,
    primary: true,
    comment: '栏目id,政策解读只能选择政策相关的栏目id',
  })
  columnId: string;

  @ApiProperty({ description: '搜索次数(单个用户)' })
  @Column('integer', { name: 'search', default: 0, comment: '搜索次数(单个用户)' })
  search: number;

  @ApiProperty({ description: '创建时间' })
  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;
}
