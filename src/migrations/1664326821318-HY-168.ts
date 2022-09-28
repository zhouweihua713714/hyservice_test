import { MigrationInterface, QueryRunner } from 'typeorm';

export class HY1681664326821318 implements MigrationInterface {
  name = 'HY1681664326821318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "columns" ADD "introduction" text`);
    await queryRunner.query(`COMMENT ON COLUMN "columns"."introduction" IS '栏目介绍'`);
    //栏目数据
    await queryRunner.query(`INSERT INTO "columns" ( "id", "name", "parent_id", "sequence_number", "is_hide","introduction" )
    VALUES
        ( 'column_02_01', 'CSSCI期刊', 'column_02', '1', '0','中国电化教育、电化教育研究、教育研究、现代教育技术、中国远程教育、开放教育研究期刊论文（2011-2020年）' ),
        ( 'column_02_02', 'NS教育类论文', 'column_02', '2', '0','Nature\Science两大期刊教育类论文（2010-2020年）' ),
        ( 'column_02_03', 'SSCI期刊论文', 'column_02', '3', '0','Web Of Science核心数据库前26个SSCI期刊论文（2007-2020年）' ),   
        ( 'column_02_04', 'LAK会议论文', 'column_02', 4, '0','2016年-2020年LAK会议论文' ),
        ( 'column_02_05', 'EDM会议论文', 'column_02', 5, '0','2016年-2020年EDM会议论文' ),
        ( 'column_02_06', 'ijAIED国际人工智能教育杂志', 'column_02', 6, '0','ijAIED国际人工智能教育杂志' ),
        ( 'column_02_07', 'AIED会议论文', 'column_02', 7, '0','2011年-2021年AIED会议论文' ),
        ( 'column_02_08', 'ITS会议论文', 'column_02', 8, '0','2012年-2020年ITS会议论文' ),
        ( 'column_02_09', 'ICLS学习科学国际会议', 'column_02', 9, '0','ICLS学习科学国际会议' ),
        ( 'column_02_10', 'JLS学习科学杂志', 'column_02', 10, '0','JLS学习科学杂志' ),
        ( 'column_02_11', '认知与指导', 'column_02', 11, '0','认知与指导' ),
        ( 'column_02_12', '教学指导', 'column_02', 12, '0','教学指导' ),
        ( 'column_02_13', 'CSCL计算机协作学习国际会议', 'column_02', 13, '0' ,'CSCL计算机协作学习国际会议'),
        ( 'column_02_14', 'ijCSCL国际计算机支持协作学习杂志', 'column_02', 14, '0','ijCSCL国际计算机支持协作学习杂志' ),
        ( 'column_02_15', '心智、脑与教育', 'column_02', 15, '0','心智、脑与教育' ),
        ( 'column_02_16', '教育生物学', 'column_02', 16, '0','教育生物学' ) ON CONFLICT ( "id" ) DO
    UPDATE
        SET "name" = EXCLUDED."name",
        "parent_id" = EXCLUDED."parent_id",
        "sequence_number" = EXCLUDED."sequence_number",
        "is_hide" = EXCLUDED."is_hide", 
        "introduction" = EXCLUDED."introduction";
    `);
    //语种
    await queryRunner.query(`INSERT INTO "languages" ( "id", "name", "type" )
        VALUES
            ( 'language_english_01', 'English', 'treatise' ),
            ( 'language_spanish_01', 'Spanish', 'treatise' ),
            ( 'language_estonian_01', 'Estonian', 'treatise' ) ON CONFLICT ( "id" ) DO
        UPDATE 
            SET "name" = EXCLUDED."name",
            "type" = EXCLUDED."type";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "columns"."introduction" IS '栏目介绍'`);
    await queryRunner.query(`ALTER TABLE "columns" DROP COLUMN "introduction"`);
  }
}
