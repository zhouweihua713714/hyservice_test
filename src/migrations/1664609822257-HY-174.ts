import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1741664609822257 implements MigrationInterface {
    name = 'HY1741664609822257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "analysis_policies" ("id" character varying(128) NOT NULL, "column_id" character varying(128) NOT NULL, "title" character varying(200) NOT NULL, "source" character varying(200), "content" text, "url" character varying(200), "announced_at" TIMESTAMP WITH TIME ZONE, "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(128), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "enabled" boolean DEFAULT true, CONSTRAINT "PK_d4e6b507d158e429b94afdc501d" PRIMARY KEY ("id")); COMMENT ON COLUMN "analysis_policies"."id" IS '主键id'; COMMENT ON COLUMN "analysis_policies"."column_id" IS '栏目id,政策解读只能选择政策相关的栏目id'; COMMENT ON COLUMN "analysis_policies"."title" IS '标题'; COMMENT ON COLUMN "analysis_policies"."source" IS '文章来源'; COMMENT ON COLUMN "analysis_policies"."content" IS '简介'; COMMENT ON COLUMN "analysis_policies"."url" IS '链接'; COMMENT ON COLUMN "analysis_policies"."announced_at" IS '发布时间'; COMMENT ON COLUMN "analysis_policies"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "analysis_policies"."owner_id" IS '录入人id'; COMMENT ON COLUMN "analysis_policies"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "analysis_policies"."created_at" IS '创建时间'; COMMENT ON COLUMN "analysis_policies"."updated_at" IS '更新时间'; COMMENT ON COLUMN "analysis_policies"."published_at" IS '发布时间'; COMMENT ON COLUMN "analysis_policies"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "analysis_policies_pkey" ON "analysis_policies" ("id") `);
        await queryRunner.query(`ALTER TABLE "policies" ADD "topic_type" character varying(64)`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."topic_type" IS '主题类型'`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "content" text`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."content" IS '简介'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "policies"."content" IS '简介'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "content"`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."topic_type" IS '主题类型'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "topic_type"`);
        await queryRunner.query(`DROP INDEX "public"."analysis_policies_pkey"`);
        await queryRunner.query(`DROP TABLE "analysis_policies"`);
    }

}
