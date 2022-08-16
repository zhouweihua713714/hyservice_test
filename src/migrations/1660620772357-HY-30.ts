import { MigrationInterface, QueryRunner } from "typeorm";

export class HY301660620772357 implements MigrationInterface {
    name = 'HY301660620772357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "classification"`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "picture"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "subject" jsonb`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."subject" IS '学科分类(CNKI中国知网),格式:[string,string]'`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "periodicals" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "region" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."region" IS '地区(刊物国别),国别之间用;隔开'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."field" IS '主领域(大领域之间用“;”隔开)'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."minor_field" IS '子领域,(子领域之间用“;”隔开)'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "url" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."url" IS '网址'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "search"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "search" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."search" IS '检索情况'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "period"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "period" character varying(30)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."period" IS '刊发周期'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."check_fee" IS '审稿费,单位:元'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."page_fee" IS '版面费,单位:元'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."reward" IS '稿酬,单位:元'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "cover_url"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "cover_url" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."cover_url" IS '封面链接'`);
        await queryRunner.query(`ALTER TABLE "periodicals" ALTER COLUMN "enabled" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodicals" ALTER COLUMN "enabled" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."cover_url" IS '封面链接'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "cover_url"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "cover_url" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."reward" IS '稿酬'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."page_fee" IS '版面费'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."check_fee" IS '审稿费'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."period" IS '刊发周期'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "period"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "period" character varying(10)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."search" IS '检索情况'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "search"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "search" character varying(32)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."url" IS '网址'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "url" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."minor_field" IS '子领域,格式 [string,string]'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."field" IS '主领域'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."region" IS '地区(刊物国别),国别之间用;隔开'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "region" jsonb`);
        await queryRunner.query(`ALTER TABLE "periodicals" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."subject" IS '学科分类(CNKI中国知网),格式:[string,string]'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "subject"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "picture" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "content" jsonb`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "classification" jsonb`);
    }

}
