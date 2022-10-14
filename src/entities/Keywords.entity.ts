import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('keywords_pkey', ['name','type'], { unique: true })
@Entity('keywords')
export class Keywords {
  @ApiProperty({ description: '名称' })
  @Column('text', { name: 'name', primary: true, comment: '名称' })
  name: string;

  @ApiProperty({
    description:
      '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy',
  })
  @Column('character varying', {
    name: 'type',
    length: 32,
    primary: true,
    comment:
      '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy',
  })
  type: string;

  @ApiProperty({ description: '搜索次数(所有用户)' })
  @Column('integer', { name: 'search', default: 0, comment: '搜索次数(所有用户)' })
  search: number;

  @ApiProperty({ description: '出现内容关键字的频率' })
  @Column('integer', { name: 'frequency', default: 0, comment: '出现内容关键字的频率' })
  frequency: number;
}
