import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('fields_pkey', ['id'], { unique: true })
@Entity('fields')
export class Fields {
  @ApiProperty({ description: 'id' })
  @Column('character varying', { name: 'id', primary: true, length: 32, comment: 'id' })
  id: string;

  @ApiProperty({ description: '领域名称' })
  @Column('character varying', { name: 'name', length: 128, comment: '领域名称' })
  name: string;

  @ApiProperty({
    description:
      '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy,两者共用则用_连接:institution_conference',
  })
  @Column('character varying', {
    name: 'type',
    length: 32,
    comment:
      '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy,两者共用则用_连接:institution_conference',
  })
  type: string;

  @ApiProperty({ description: '是否主领域:1是,0否' })
  @Column('smallint', { name: 'is_main', default: '0', comment: '是否主领域:1是,0否' })
  isMain: number;
}
