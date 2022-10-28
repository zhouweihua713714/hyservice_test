import { MigrationInterface, QueryRunner } from 'typeorm';

export class HY3011666923458402 implements MigrationInterface {
  name = 'HY3011666923458402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "treatises" ADD "topic" text`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."topic" IS '一级主题'`);
    await queryRunner.query(`ALTER TABLE "treatises" ADD "child_topic" text`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."child_topic" IS '二级主题'`);
    await queryRunner.query(`ALTER TABLE "treatises" ADD "goal" text`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."goal" IS '研究目标'`);
    await queryRunner.query(`ALTER TABLE "treatises" ADD "object" text`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."object" IS '研究对象'`);
    await queryRunner.query(`ALTER TABLE "treatises" ADD "paradigm" text`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."paradigm" IS '研究范式'`);
    await queryRunner.query(`ALTER TABLE "treatises" ADD "method" text`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."method" IS '数据分析方式'`);
    //栏目数据
    await queryRunner.query(`DELETE FROM "columns" WHERE id = 'column_02_16'`);
    await queryRunner.query(`INSERT INTO "columns" ( "id", "name", "parent_id", "sequence_number", "is_hide")
    VALUES
        ( 'column_01_01', '全国教育科学规划项目', 'column_01', '1', '0' ) ON CONFLICT ( "id" ) DO
    UPDATE
        SET "name" = EXCLUDED."name",
        "parent_id" = EXCLUDED."parent_id",
        "sequence_number" = EXCLUDED."sequence_number",
        "is_hide" = EXCLUDED."is_hide", 
        "introduction" = EXCLUDED."introduction";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."method" IS '数据分析方式'`);
    await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "method"`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."paradigm" IS '研究范式'`);
    await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "paradigm"`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."object" IS '研究对象'`);
    await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "object"`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."goal" IS '研究目标'`);
    await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "goal"`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."child_topic" IS '二级主题'`);
    await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "child_topic"`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."topic" IS '一级主题'`);
    await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "topic"`);
    //栏目
    await queryRunner.query(`INSERT INTO "columns" ( "id", "name", "parent_id", "sequence_number", "is_hide","introduction" )
       VALUES
           ( 'column_02_16', '教育生物学', 'column_02', 16, '0','教育生物学' ) ON CONFLICT ( "id" ) DO
       UPDATE
           SET "name" = EXCLUDED."name",
           "parent_id" = EXCLUDED."parent_id",
           "sequence_number" = EXCLUDED."sequence_number",
           "is_hide" = EXCLUDED."is_hide", 
           "introduction" = EXCLUDED."introduction";
       `);
  }
}
