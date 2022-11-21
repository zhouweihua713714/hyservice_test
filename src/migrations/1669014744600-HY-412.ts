import { MigrationInterface, QueryRunner } from "typeorm";

export class HY4121669014744600 implements MigrationInterface {
    name = 'HY4121669014744600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "research_reports" ("id" character varying(128) NOT NULL, "column_id" character varying(128) NOT NULL, "title" character varying(256) NOT NULL, "author" text NOT NULL, "abstract" text, "downloads" integer NOT NULL DEFAULT '0', "url" text, "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(128), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "enabled" boolean DEFAULT true, CONSTRAINT "PK_38ec3abcb7ea0961441d6b46ced" PRIMARY KEY ("id")); COMMENT ON COLUMN "research_reports"."id" IS '主键id'; COMMENT ON COLUMN "research_reports"."column_id" IS '栏目id'; COMMENT ON COLUMN "research_reports"."title" IS '报告标题'; COMMENT ON COLUMN "research_reports"."author" IS '作者'; COMMENT ON COLUMN "research_reports"."abstract" IS '摘要叙述'; COMMENT ON COLUMN "research_reports"."downloads" IS '下载次数'; COMMENT ON COLUMN "research_reports"."url" IS '下载链接'; COMMENT ON COLUMN "research_reports"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "research_reports"."owner_id" IS '录入人id'; COMMENT ON COLUMN "research_reports"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "research_reports"."created_at" IS '创建时间'; COMMENT ON COLUMN "research_reports"."updated_at" IS '更新时间'; COMMENT ON COLUMN "research_reports"."published_at" IS '发布时间'; COMMENT ON COLUMN "research_reports"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "research_reports_pkey" ON "research_reports" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."research_reports_pkey"`);
        await queryRunner.query(`DROP TABLE "research_reports"`);
    }

}
