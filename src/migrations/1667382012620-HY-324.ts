import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3241667382012620 implements MigrationInterface {
    name = 'HY3241667382012620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."america_terms_pkey"`);
        await queryRunner.query(`CREATE TABLE "america_term_keywords" ("name" text NOT NULL, "award_number" character varying(128) NOT NULL, "title" character varying NOT NULL, "column_id" character varying(128) NOT NULL, CONSTRAINT "PK_6be796fd671ac54cfbb66e22b0e" PRIMARY KEY ("name", "award_number")); COMMENT ON COLUMN "america_term_keywords"."name" IS '名称'; COMMENT ON COLUMN "america_term_keywords"."award_number" IS '资助编号'; COMMENT ON COLUMN "america_term_keywords"."title" IS 'title'; COMMENT ON COLUMN "america_term_keywords"."column_id" IS '栏目id'`);
        await queryRunner.query(`CREATE INDEX "IDX_83b0f9a4955c7b1b1c07c0d333" ON "america_term_keywords" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_2232517d072e38bd1b89da3003" ON "america_term_keywords" ("column_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "america_term_keywords_pkey" ON "america_term_keywords" ("name", "award_number") `);
        await queryRunner.query(`CREATE TABLE "nsf_directorate_types" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "PK_8719c8a4427931cbf67a9ce6310" PRIMARY KEY ("id")); COMMENT ON COLUMN "nsf_directorate_types"."id" IS '主键id'; COMMENT ON COLUMN "nsf_directorate_types"."name" IS '学部名称'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "nsf_directorate_types_pkey" ON "nsf_directorate_types" ("id") `);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP CONSTRAINT "PK_f88e73ddc5bf8d627a7ace6ddcf"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "award_id"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "award_title"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "investigator"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "instrument"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "program_officer"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "institution"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "foa_information"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "program_element"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "reference"`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "award_number" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD CONSTRAINT "PK_ee8bc22ab264152650f4afd5f92" PRIMARY KEY ("award_number")`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."award_number" IS '资助编号'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."title" IS 'title'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "program" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."program" IS 'program'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "start_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."start_date" IS '开始时间'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "end_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."end_date" IS '结束时间'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "principal_investigator" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."principal_investigator" IS '项目负责人'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "state" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."state" IS '美国州缩写'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "award_instrument" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."award_instrument" IS '资助方式'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "awarded_amount_to_date" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."awarded_amount_to_date" IS '资助金额'`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "nsf_directorate" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."nsf_directorate" IS '学部'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "organization"`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "organization" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."organization" IS '组织'`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."year" IS '年份'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "america_terms_pkey" ON "america_terms" ("award_number") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."america_terms_pkey"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."year" IS '批准年份'`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."organization" IS '组织'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "organization"`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "organization" character varying(50) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."nsf_directorate" IS '学部'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "nsf_directorate"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."awarded_amount_to_date" IS '资助金额'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "awarded_amount_to_date"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."award_instrument" IS '资助方式'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "award_instrument"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."state" IS '美国州缩写'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "state"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."principal_investigator" IS '项目负责人'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "principal_investigator"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."end_date" IS '结束时间'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "end_date"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."start_date" IS '开始时间'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "start_date"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."program" IS 'program'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "program"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."title" IS 'title'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "title"`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."award_number" IS '资助编号'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP CONSTRAINT "PK_ee8bc22ab264152650f4afd5f92"`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "award_number"`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "reference" text`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "program_element" character varying`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "foa_information" character varying`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "institution" character varying`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "program_officer" character varying`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "instrument" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "investigator" character varying`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "award_title" character varying`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "award_id" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "id" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD CONSTRAINT "PK_f88e73ddc5bf8d627a7ace6ddcf" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "amount" integer`);
        await queryRunner.query(`DROP INDEX "public"."nsf_directorate_types_pkey"`);
        await queryRunner.query(`DROP TABLE "nsf_directorate_types"`);
        await queryRunner.query(`DROP INDEX "public"."america_term_keywords_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2232517d072e38bd1b89da3003"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83b0f9a4955c7b1b1c07c0d333"`);
        await queryRunner.query(`DROP TABLE "america_term_keywords"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "america_terms_pkey" ON "america_terms" ("id") `);
    }

}
