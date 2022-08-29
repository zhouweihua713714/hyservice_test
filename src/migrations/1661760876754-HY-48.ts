import { MigrationInterface, QueryRunner } from "typeorm";

export class HY481661760876754 implements MigrationInterface {
    name = 'HY481661760876754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conferences" ADD "cover_url" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."cover_url" IS '封面链接'`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "conferences" ALTER COLUMN "abbreviation" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."name" IS '会议名称'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "website" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."website" IS '网站'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "email" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."email" IS '联络人邮箱'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."email" IS '联络人邮箱'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "email" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."website" IS '网站'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "website" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."name" IS '会议名称'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conferences" ALTER COLUMN "abbreviation" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."cover_url" IS '封面链接'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "cover_url"`);
    }

}
