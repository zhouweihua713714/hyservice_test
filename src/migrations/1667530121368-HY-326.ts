import { MigrationInterface, QueryRunner } from 'typeorm';

export class HY3261667530121368 implements MigrationInterface {
  name = 'HY3261667530121368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "treatises"."object" IS '研究对象,这里会是多个分号隔开'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "treatises"."method" IS '数据分析方式,这里会是多个分号隔开'`
    );
    //栏目数据
    await queryRunner.query(`INSERT INTO "columns" ( "id", "name", "parent_id", "introduction" )
    VALUES
    ( 'column_02_12', 'IS教育科学期刊', 'column_02', 'Instructional Science杂志' ) ON CONFLICT ( "id" ) DO
    UPDATE
        SET "name" = EXCLUDED."name",
        "parent_id" = EXCLUDED."parent_id",
        "introduction" = EXCLUDED."introduction";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."method" IS '数据分析方式'`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."object" IS '研究对象'`);
  }
}
