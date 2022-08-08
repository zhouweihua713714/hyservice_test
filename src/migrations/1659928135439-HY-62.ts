import { MigrationInterface, QueryRunner } from "typeorm";

export class HY621659928135439 implements MigrationInterface {
    name = 'HY621659928135439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article_types" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, "type" character varying(32) NOT NULL, CONSTRAINT "PK_db378fd9b427c51a33d488b82d3" PRIMARY KEY ("id")); COMMENT ON COLUMN "article_types"."id" IS '主键id'; COMMENT ON COLUMN "article_types"."name" IS '名称'; COMMENT ON COLUMN "article_types"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy,论文下的ssci专用treatise_ssci'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "article_types_pkey" ON "article_types" ("id") `);
        await queryRunner.query(`CREATE TABLE "patent_types" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "PK_539b0011134d0136c5bb92bb5b8" PRIMARY KEY ("id")); COMMENT ON COLUMN "patent_types"."id" IS '主键id'; COMMENT ON COLUMN "patent_types"."name" IS '专利类型名称'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "patent_types_pkey" ON "patent_types" ("id") `);
        await queryRunner.query(`CREATE TABLE "patent_valid_types" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "PK_482bafb1d7211fce02b69b6f081" PRIMARY KEY ("id")); COMMENT ON COLUMN "patent_valid_types"."id" IS '主键id'; COMMENT ON COLUMN "patent_valid_types"."name" IS '专利类型名称'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "patent_valid_types_pkey" ON "patent_valid_types" ("id") `);
        await queryRunner.query(`ALTER TABLE "languages" ADD "type" character varying(32) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "languages"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy,论文下的ssci专用treatise_ssci'`);
        await queryRunner.query(`COMMENT ON COLUMN "fields"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy,两者共用则用_连接:institution_conference'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."peking_unit" IS '中文核心期刊(北大) 类型:核心期刊journals_001,1级权威journals_002,2级权威journals_003 格式 [string,string]'`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."level" IS '政策层级:国家级policy_level_001'`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."channel" IS '发表途径:期刊way_001,会议way_002,EDM会议way003'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."channel" IS '发表途径'`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."level" IS '政策层次'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."peking_unit" IS '中文核心期刊(北大),格式 [string,string]'`);
        await queryRunner.query(`COMMENT ON COLUMN "fields"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy'`);
        await queryRunner.query(`COMMENT ON COLUMN "languages"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy,论文下的ssci专用treatise_ssci'`);
        await queryRunner.query(`ALTER TABLE "languages" DROP COLUMN "type"`);
        await queryRunner.query(`DROP INDEX "public"."patent_valid_types_pkey"`);
        await queryRunner.query(`DROP TABLE "patent_valid_types"`);
        await queryRunner.query(`DROP INDEX "public"."patent_types_pkey"`);
        await queryRunner.query(`DROP TABLE "patent_types"`);
        await queryRunner.query(`DROP INDEX "public"."article_types_pkey"`);
        await queryRunner.query(`DROP TABLE "article_types"`);
    }

}
