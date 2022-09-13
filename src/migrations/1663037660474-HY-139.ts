import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1391663037660474 implements MigrationInterface {
    name = 'HY1391663037660474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(128) NOT NULL, "related_id" character varying(128) NOT NULL, "type" character varying(64) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_777252b9045d8011ab83c5b0834" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_history"."user_id" IS '用户id'; COMMENT ON COLUMN "user_history"."related_id" IS '关联的id(指的是内容管理相关的项目、论文等id根据类型区分)'; COMMENT ON COLUMN "user_history"."type" IS '关联的id的类型,方便后续查询具体数据,类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy'; COMMENT ON COLUMN "user_history"."created_at" IS '创建时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_history_pkey" ON "user_history" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."user_history_pkey"`);
        await queryRunner.query(`DROP TABLE "user_history"`);
    }

}
