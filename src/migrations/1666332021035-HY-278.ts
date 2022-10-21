import { MigrationInterface, QueryRunner } from "typeorm";

export class HY2781666332021035 implements MigrationInterface {
    name = 'HY2781666332021035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "term_keywords" ("name" text NOT NULL, "term_id" character varying NOT NULL, "column_id" character varying(128) NOT NULL, CONSTRAINT "PK_4267d0312ad2dbfe8dff47c486e" PRIMARY KEY ("name", "term_id")); COMMENT ON COLUMN "term_keywords"."name" IS '名称'; COMMENT ON COLUMN "term_keywords"."term_id" IS '项目id'; COMMENT ON COLUMN "term_keywords"."column_id" IS '栏目id'`);
        await queryRunner.query(`CREATE INDEX "IDX_151f3f513d8bd9fa773fa2a469" ON "term_keywords" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_16c4b051b26de6a0e44ced820b" ON "term_keywords" ("term_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac517abcd875f338cc9414a4b4" ON "term_keywords" ("column_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "term_keywords_pkey" ON "term_keywords" ("name", "term_id") `);
        await queryRunner.query(`CREATE TABLE "treatise_keywords" ("name" text NOT NULL, "treatise_id" character varying NOT NULL, "column_id" character varying(128) NOT NULL, "title" text NOT NULL DEFAULT '0', CONSTRAINT "PK_09386881e9a4bd08539a6d92ec2" PRIMARY KEY ("name", "treatise_id")); COMMENT ON COLUMN "treatise_keywords"."name" IS '名称'; COMMENT ON COLUMN "treatise_keywords"."treatise_id" IS '论文id'; COMMENT ON COLUMN "treatise_keywords"."column_id" IS '栏目id'; COMMENT ON COLUMN "treatise_keywords"."title" IS '论文标题'`);
        await queryRunner.query(`CREATE INDEX "IDX_e7999eda1ed40e394cee000076" ON "treatise_keywords" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_05e8e47224a995d7782e203c1a" ON "treatise_keywords" ("treatise_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c37fb15f3a6288ac5e6e818fe7" ON "treatise_keywords" ("column_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "treatise_keywords_pkey" ON "treatise_keywords" ("name", "treatise_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."treatise_keywords_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c37fb15f3a6288ac5e6e818fe7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_05e8e47224a995d7782e203c1a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e7999eda1ed40e394cee000076"`);
        await queryRunner.query(`DROP TABLE "treatise_keywords"`);
        await queryRunner.query(`DROP INDEX "public"."term_keywords_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac517abcd875f338cc9414a4b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16c4b051b26de6a0e44ced820b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_151f3f513d8bd9fa773fa2a469"`);
        await queryRunner.query(`DROP TABLE "term_keywords"`);
    }

}
