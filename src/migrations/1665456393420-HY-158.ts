import { MigrationInterface, QueryRunner } from 'typeorm';

export class HY1581665456393420 implements MigrationInterface {
  name = 'HY1581665456393420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "keywords"."frequency" IS '出现内容关键字的频率'`);
    //栏目数据
    await queryRunner.query(`INSERT INTO "columns" ( "id", "name", "parent_id", "sequence_number", "is_hide","introduction" )
    VALUES
        ( 'column_02_02', 'NS教育类论文', 'column_02', '2', '0','Nature/Science两大期刊教育类论文（2010-2020年）' ) ON CONFLICT ( "id" ) DO
    UPDATE
        SET "name" = EXCLUDED."name",
        "parent_id" = EXCLUDED."parent_id",
        "sequence_number" = EXCLUDED."sequence_number",
        "is_hide" = EXCLUDED."is_hide",
        "introduction" = EXCLUDED."introduction";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "keywords"."frequency" IS '出现内容关键字的频数'`);
  }
}
