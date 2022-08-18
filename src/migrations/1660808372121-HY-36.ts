import { MigrationInterface, QueryRunner } from "typeorm";

export class HY361660808372121 implements MigrationInterface {
    name = 'HY361660808372121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policies" ADD "region" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."region" IS '国家'`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "policies" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "url" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."url" IS '政策来源(网址)'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "policies"."url" IS '政策来源(网址)'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "url" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "policies" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."region" IS '国家'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "region"`);
    }

}
