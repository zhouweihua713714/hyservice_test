import { MigrationInterface, QueryRunner } from "typeorm";

export class HY4141670575186582 implements MigrationInterface {
    name = 'HY4141670575186582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assembly_policies" ("id" character varying(128) NOT NULL, "column_id" character varying(128) NOT NULL, "title" character varying(256) NOT NULL, "downloads" integer NOT NULL DEFAULT '0', "url" text, "page" integer NOT NULL DEFAULT '0', "cover_url" text, "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(128), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "enabled" boolean DEFAULT true, CONSTRAINT "PK_afa63b7177de922b0e4f66167f6" PRIMARY KEY ("id")); COMMENT ON COLUMN "assembly_policies"."id" IS '主键id'; COMMENT ON COLUMN "assembly_policies"."column_id" IS '栏目id'; COMMENT ON COLUMN "assembly_policies"."title" IS '名称'; COMMENT ON COLUMN "assembly_policies"."downloads" IS '下载次数'; COMMENT ON COLUMN "assembly_policies"."url" IS '下载链接'; COMMENT ON COLUMN "assembly_policies"."page" IS '页数'; COMMENT ON COLUMN "assembly_policies"."cover_url" IS '封面链接'; COMMENT ON COLUMN "assembly_policies"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "assembly_policies"."owner_id" IS '录入人id'; COMMENT ON COLUMN "assembly_policies"."clicks" IS '点击量'; COMMENT ON COLUMN "assembly_policies"."created_at" IS '创建时间'; COMMENT ON COLUMN "assembly_policies"."updated_at" IS '更新时间'; COMMENT ON COLUMN "assembly_policies"."published_at" IS '发布时间'; COMMENT ON COLUMN "assembly_policies"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "assembly_policies_pkey" ON "assembly_policies" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."assembly_policies_pkey"`);
        await queryRunner.query(`DROP TABLE "assembly_policies"`);
    }

}
