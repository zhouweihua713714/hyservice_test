import { MigrationInterface, QueryRunner } from "typeorm";

export class HY901661218731343 implements MigrationInterface {
    name = 'HY901661218731343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policies" ADD "picker" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."picker" IS '日期格式:year、month、date'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "policies"."picker" IS '日期格式:year、month、date'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "picker"`);
    }

}
