import { MigrationInterface, QueryRunner } from "typeorm";

export class HY241661156517120 implements MigrationInterface {
    name = 'HY241661156517120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "name" character varying(200) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."name" IS '政策名称'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "title" character varying(200) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."title" IS '论文标题'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "region" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."region" IS '科研人员所属国家或地区'`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."channel" IS '发表途径:期刊way_001,会议way_002,EDM会议way003,书way_004'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "language" character varying(20)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."language" IS '语种'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author" IS '第一作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author_unit" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author_unit" IS '第一作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author" IS '通讯作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author_unit" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_unit" IS '通讯作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author_email"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author_email" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_email" IS '通讯作者邮箱'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "other_author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "other_author" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."other_author" IS '其他作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "other_author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "other_author_unit" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."other_author_unit" IS '其他作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "sort"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "sort" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."sort" IS '文章类型'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "search"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "search" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."search" IS '检索情况'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "funded_project"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "funded_project" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."funded_project" IS '所获得资助项目'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "url" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."url" IS '论文链接'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."url" IS '论文链接'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "url" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."funded_project" IS '所获得资助项目'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "funded_project"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "funded_project" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."search" IS '检索情况'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "search"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "search" character varying(32)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."sort" IS '文章类型'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "sort"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "sort" character varying(32)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."other_author_unit" IS '其他作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "other_author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "other_author_unit" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."other_author" IS '其他作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "other_author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "other_author" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_email" IS '通讯作者邮箱'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author_email"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author_email" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_unit" IS '通讯作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author_unit" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author" IS '通讯作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author" character varying(32)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author_unit" IS '第一作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author_unit" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author" IS '第一作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author" character varying(32)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."language" IS '语种'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "language" character varying(10) DEFAULT 'CN'`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."channel" IS '发表途径:期刊way_001,会议way_002,EDM会议way003'`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."region" IS '科研人员所属国家或地区'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "region" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."title" IS '论文标题'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "title" character varying(50) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."name" IS '政策名称'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "type" character varying(64) NOT NULL DEFAULT 'treatise'`);
    }

}
