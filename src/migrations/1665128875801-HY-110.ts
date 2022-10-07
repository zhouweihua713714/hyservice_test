import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1101665128875801 implements MigrationInterface {
    name = 'HY1101665128875801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "keywords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "type" character varying(32) NOT NULL, "search" integer NOT NULL DEFAULT '0', "frequency" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_4aa660a7a585ed828da68f3c28e" PRIMARY KEY ("id")); COMMENT ON COLUMN "keywords"."name" IS '名称'; COMMENT ON COLUMN "keywords"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy'; COMMENT ON COLUMN "keywords"."search" IS '搜索次数(所有用户)'; COMMENT ON COLUMN "keywords"."frequency" IS '出现内容关键字的频数'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "keywords_pkey" ON "keywords" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."keywords_pkey"`);
        await queryRunner.query(`DROP TABLE "keywords"`);
    }

}
