import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1561668071209590 implements MigrationInterface {
    name = 'HY1561668071209590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "column_id" character varying(128) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."column_id" IS '栏目id'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "keyword" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."keyword" IS '关键字'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."keyword" IS '关键字'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "keyword"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."column_id" IS '栏目id'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "column_id"`);
    }

}
