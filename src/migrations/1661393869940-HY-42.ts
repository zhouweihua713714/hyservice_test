import { MigrationInterface, QueryRunner } from "typeorm";

export class HY421661393869940 implements MigrationInterface {
    name = 'HY421661393869940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patents" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "patents" ADD "title" character varying(100) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."title" IS '专利标题'`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "institution"`);
        await queryRunner.query(`ALTER TABLE "patents" ADD "institution" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."institution" IS '申请人(单位)'`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "patents" ADD "country" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."country" IS '公开国别'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "patents"."country" IS '公开国别'`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "patents" ADD "country" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."institution" IS '申请人(单位)'`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "institution"`);
        await queryRunner.query(`ALTER TABLE "patents" ADD "institution" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."title" IS '专利标题'`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "patents" ADD "title" character varying(50) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "deleted_at"`);
    }

}
