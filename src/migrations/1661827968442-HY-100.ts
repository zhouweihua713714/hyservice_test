import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1001661827968442 implements MigrationInterface {
    name = 'HY1001661827968442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "sort"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "sort" jsonb`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."sort" IS '文章类型'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."sort" IS '文章类型'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "sort"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "sort" character varying(50)`);
    }

}
