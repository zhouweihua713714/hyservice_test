import { MigrationInterface, QueryRunner } from "typeorm";

export class HY981661763336283 implements MigrationInterface {
    name = 'HY981661763336283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "keyword" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."keyword" IS '关键字'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."keyword" IS '关键字'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "keyword" TYPE character varying(100)`);
    }

}
