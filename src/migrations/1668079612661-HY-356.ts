import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3561668079612661 implements MigrationInterface {
    name = 'HY3561668079612661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "keyword"`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "keyword" character varying(256)`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."keyword" IS '关键字'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."keyword" IS '关键字'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "keyword"`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "keyword" character varying(100)`);
    }

}
