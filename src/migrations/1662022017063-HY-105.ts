import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1051662022017063 implements MigrationInterface {
    name = 'HY1051662022017063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conferences" ADD "picker" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."picker" IS '日期格式:year、month、date'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."picker" IS '日期格式:year、month、date'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "picker"`);
    }

}
