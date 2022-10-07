import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('keywords_pkey', ['id'], { unique: true })
@Entity('keywords')
export class Keywords {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '关键词名称' })
  @Column('character varying', { name: 'name', comment: '关键词名称' })
  name: string;

  @ApiProperty({
    description:
      '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy',
  })
  @Column('character varying', {
    name: 'type',
    length: 32,
    comment:
      '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy',
  })
  type: string;

  @ApiProperty({ description: '用户搜索总频次(所有用户)' })
  @Column('integer', { name: 'search', default: 0, comment: '用户搜索总频次(所有用户)' })
  search: number;

  // @ApiProperty({ description: '用户搜索总频次(所有用户)' })
  // @Column('integer', { name: 'search', default: 0, comment: '用户搜索总频次(所有用户)' })
  // search: number;
}
