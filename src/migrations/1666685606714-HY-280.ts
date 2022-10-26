import { MigrationInterface, QueryRunner } from "typeorm";

export class HY2801666685606714 implements MigrationInterface {
    name = 'HY2801666685606714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_keyword_statistics" ("user_id" character varying(128) NOT NULL, "keyword" text NOT NULL, "column_id" character varying(128) NOT NULL, "search" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_006a81b3a8a969ba9d1fad6ed74" PRIMARY KEY ("user_id", "keyword", "column_id")); COMMENT ON COLUMN "user_keyword_statistics"."user_id" IS '用户id'; COMMENT ON COLUMN "user_keyword_statistics"."keyword" IS '关键字'; COMMENT ON COLUMN "user_keyword_statistics"."column_id" IS '栏目id,政策解读只能选择政策相关的栏目id'; COMMENT ON COLUMN "user_keyword_statistics"."search" IS '搜索次数(单个用户)'; COMMENT ON COLUMN "user_keyword_statistics"."created_at" IS '创建时间'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_keyword_statistics"`);
    }

}
