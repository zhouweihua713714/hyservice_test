import { MigrationInterface, QueryRunner } from 'typeorm';

export class HY1821664959322177 implements MigrationInterface {
  name = 'HY1821664959322177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "topic_types" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "PK_066f2b965d3ad6114c1a7f6f594" PRIMARY KEY ("id")); COMMENT ON COLUMN "topic_types"."id" IS '主键id'; COMMENT ON COLUMN "topic_types"."name" IS '名称'`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "topic_types_pkey" ON "topic_types" ("id") `);
    //栏目数据
    await queryRunner.query(`INSERT INTO "columns" ( "id", "name", "parent_id", "sequence_number", "is_hide" )
    VALUES
    ( 'column_04', '政策', '0', '4', '0' ),
    ( 'column_04_01', '全部政策', 'column_04', '1', '0' ),
    ( 'column_04_02', '政策解读', 'column_04', '2', '0' ),
    ( 'column_04_01_01', '国内政策', 'column_04_01', '1', '0' ),
    ( 'column_04_01_02', '国外政策', 'column_04_01', '2', '0' ),
    ( 'column_04_02_01', '国内政策', 'column_04_02', '1', '0' ) ON CONFLICT ( "id" ) DO
    UPDATE
        SET "name" = EXCLUDED."name",
        "parent_id" = EXCLUDED."parent_id",
        "sequence_number" = EXCLUDED."sequence_number",
        "is_hide" = EXCLUDED."is_hide";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."topic_types_pkey"`);
    await queryRunner.query(`DROP TABLE "topic_types"`);
  }
}
