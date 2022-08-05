import { MigrationInterface, QueryRunner } from "typeorm";

export class HY641659686734435 implements MigrationInterface {
    name = 'HY641659686734435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "delivery_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."delivery_at" IS '发表时间,单位:年'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "period"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "period" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."period" IS '届'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "type" character varying(20) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."type" IS '用户类型:普通用户user,管理员admin,超级管理员administrator'`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "policies" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."institution" IS '发布机构/部门'`);
        await queryRunner.query(`ALTER TABLE "terms" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "region" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."region" IS '科研人员所属国家或地区'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "field"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "field" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."field" IS '文章主领域'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "minor_field"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "minor_field" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."minor_field" IS '文章子领域'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."minor_field" IS '文章子领域'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "minor_field"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "minor_field" character varying(64)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."field" IS '文章主领域'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "field"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "field" character varying(64)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."region" IS '科研人员所属国家或地区'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "region" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "terms" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."institution" IS '发布机构'`);
        await queryRunner.query(`ALTER TABLE "policies" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."type" IS '用户类型:普通用户user,管理员admin,超级管理员administrator'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "type" character varying(10) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."period" IS '届'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "period"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "period" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."delivery_at" IS '发表时间,单位:年'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "delivery_at"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "content" jsonb`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "year" character varying(32)`);
    }

}
