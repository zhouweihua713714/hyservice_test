import { MigrationInterface, QueryRunner } from "typeorm";

export class HY2811666596348761 implements MigrationInterface {
    name = 'HY2811666596348761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "keywords"."search" IS '搜索次数(所有用户),默认0'`);
        //学科分类
    await queryRunner.query(`INSERT INTO "subjects" ( "id", "name", "type" )
    VALUES
        ( 'subject_00008', '教学知识可视化', 'term' ) ON CONFLICT ( "id" ) DO
    UPDATE
        SET "name" = EXCLUDED."name",
        "type" = EXCLUDED."type";`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "keywords"."search" IS '搜索次数(所有用户)'`);
    }

}
