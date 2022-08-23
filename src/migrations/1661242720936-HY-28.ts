import { MigrationInterface, QueryRunner } from "typeorm";

export class HY281661242720936 implements MigrationInterface {
    name = 'HY281661242720936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "address" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."address" IS '详细地址'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."address" IS '详细地址'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "address" character varying(50)`);
    }

}
