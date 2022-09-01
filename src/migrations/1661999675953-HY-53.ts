import { MigrationInterface, QueryRunner } from "typeorm";

export class HY531661999675953 implements MigrationInterface {
    name = 'HY531661999675953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "keyword"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "foreign_name"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "foreign_name" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."foreign_name" IS '外文机构名称'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "address" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."address" IS '详细地址'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "website" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."website" IS '网站'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "unit" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."unit" IS '主办单位'`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "longitude" TYPE numeric(9,6)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."longitude" IS '经度'`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "latitude" TYPE numeric(9,6)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."latitude" IS '纬度'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "url" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."url" IS '图片链接'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."url" IS '图片链接'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "url" character varying(64)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."latitude" IS '子领域'`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "latitude" TYPE numeric(10,6)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."longitude" IS '子领域'`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "longitude" TYPE numeric(10,6)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."unit" IS '主办单位'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "unit" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."website" IS '网站'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "website" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."address" IS '详细地址'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "address" character varying(50) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."foreign_name" IS '外文机构名称'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "foreign_name"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "foreign_name" character varying(50) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "institutions" ADD "keyword" character varying(100)`);
    }

}
