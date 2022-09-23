import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1481663921899153 implements MigrationInterface {
    name = 'HY1481663921899153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodicals" ALTER COLUMN "url" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."url" IS '网址'`);
        await queryRunner.query(`ALTER TABLE "periodicals" ALTER COLUMN "search" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."search" IS '检索情况'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."search" IS '检索情况'`);
        await queryRunner.query(`ALTER TABLE "periodicals" ALTER COLUMN "search" TYPE character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."url" IS '网址'`);
        await queryRunner.query(`ALTER TABLE "periodicals" ALTER COLUMN "url" TYPE character varying(200)`);
    }

}
