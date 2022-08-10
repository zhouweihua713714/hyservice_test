import { MigrationInterface, QueryRunner } from "typeorm";

export class HY191660099128844 implements MigrationInterface {
    name = 'HY191660099128844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "enabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "enabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "enabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "patents" ADD "enabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "terms"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "enabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "enabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "enabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "enabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "owner_id" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "owner_id" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "columns" DROP COLUMN "sequence_number"`);
        await queryRunner.query(`ALTER TABLE "columns" ADD "sequence_number" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "columns"."sequence_number" IS '排序'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "owner_id" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "patents" ADD "owner_id" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "owner_id" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "terms"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "owner_id" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "owner_id" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "owner_id" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."owner_id" IS '录入人id'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "owner_id" character varying(20)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "owner_id" character varying(20)`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "owner_id" character varying(20)`);
        await queryRunner.query(`COMMENT ON COLUMN "terms"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "owner_id" character varying(20)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "patents" ADD "owner_id" character varying(20)`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "owner_id" character varying(20)`);
        await queryRunner.query(`COMMENT ON COLUMN "columns"."sequence_number" IS '排序'`);
        await queryRunner.query(`ALTER TABLE "columns" DROP COLUMN "sequence_number"`);
        await queryRunner.query(`ALTER TABLE "columns" ADD "sequence_number" character varying(64) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "owner_id" character varying(20)`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."owner_id" IS '录入人id'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "owner_id" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "enabled"`);
        await queryRunner.query(`COMMENT ON COLUMN "terms"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "enabled"`);
    }

}
