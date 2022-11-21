import { MigrationInterface, QueryRunner } from "typeorm";

export class HY4161668998986003 implements MigrationInterface {
    name = 'HY4161668998986003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "treatise_library_keywords" ("name" text NOT NULL, "treatise_id" character varying NOT NULL, "column_id" character varying(128) NOT NULL, "title" text NOT NULL, CONSTRAINT "PK_cad4dc3981820af5c04c7afe96d" PRIMARY KEY ("name", "treatise_id")); COMMENT ON COLUMN "treatise_library_keywords"."name" IS '名称'; COMMENT ON COLUMN "treatise_library_keywords"."treatise_id" IS '精选文库id'; COMMENT ON COLUMN "treatise_library_keywords"."column_id" IS '栏目id'; COMMENT ON COLUMN "treatise_library_keywords"."title" IS '精选文库标题'`);
        await queryRunner.query(`CREATE INDEX "IDX_38bfacd9328a69e35974b6db04" ON "treatise_library_keywords" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_37354daf0f4bc8e86040c3c58e" ON "treatise_library_keywords" ("treatise_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5c2b8c7ea8dfe47c2f61877436" ON "treatise_library_keywords" ("column_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "treatise_library_keywords_pkey" ON "treatise_library_keywords" ("name", "treatise_id") `);
        await queryRunner.query(`CREATE TABLE "treatise_library" ("id" character varying(128) NOT NULL, "sort" character varying(128) NOT NULL, "title" text NOT NULL, "delivery_at" TIMESTAMP WITH TIME ZONE, "year" integer, "author" text, "author_unit" text, "corresponding_author" text, "corresponding_author_unit" text, "corresponding_author_email" text, "other_author" text, "other_author_unit" text, "field" text, "minor_field" text, "magazine_field" text, "magazine_minor_field" text, "abstract" text, "url" text, "name" text, "column_id" character varying(128), "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(128), "keyword" text, "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "enabled" boolean DEFAULT true, CONSTRAINT "PK_2b2e07db3693755d0e67ed1927f" PRIMARY KEY ("id")); COMMENT ON COLUMN "treatise_library"."id" IS '主键id'; COMMENT ON COLUMN "treatise_library"."sort" IS '分类'; COMMENT ON COLUMN "treatise_library"."title" IS '论文标题'; COMMENT ON COLUMN "treatise_library"."delivery_at" IS '发表时间,单位:年'; COMMENT ON COLUMN "treatise_library"."year" IS '发表时间,冗余字段便于查询'; COMMENT ON COLUMN "treatise_library"."author" IS '第一作者/作者全称'; COMMENT ON COLUMN "treatise_library"."author_unit" IS '第一作者单位'; COMMENT ON COLUMN "treatise_library"."corresponding_author" IS '通讯作者'; COMMENT ON COLUMN "treatise_library"."corresponding_author_unit" IS '通讯作者单位'; COMMENT ON COLUMN "treatise_library"."corresponding_author_email" IS '通讯作者邮箱'; COMMENT ON COLUMN "treatise_library"."other_author" IS '其他作者'; COMMENT ON COLUMN "treatise_library"."other_author_unit" IS '其他作者单位'; COMMENT ON COLUMN "treatise_library"."field" IS '文章主领域'; COMMENT ON COLUMN "treatise_library"."minor_field" IS '文章子领域'; COMMENT ON COLUMN "treatise_library"."magazine_field" IS '杂志文章主领域'; COMMENT ON COLUMN "treatise_library"."magazine_minor_field" IS '杂志文章子领域'; COMMENT ON COLUMN "treatise_library"."abstract" IS '摘要'; COMMENT ON COLUMN "treatise_library"."url" IS '论文链接'; COMMENT ON COLUMN "treatise_library"."name" IS '期刊/会议名'; COMMENT ON COLUMN "treatise_library"."column_id" IS '栏目id,精选文库只能选择精选文库相关的栏目且不为空'; COMMENT ON COLUMN "treatise_library"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "treatise_library"."owner_id" IS '录入人id'; COMMENT ON COLUMN "treatise_library"."keyword" IS '关键字'; COMMENT ON COLUMN "treatise_library"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "treatise_library"."created_at" IS '创建时间'; COMMENT ON COLUMN "treatise_library"."updated_at" IS '更新时间'; COMMENT ON COLUMN "treatise_library"."published_at" IS '发布时间'; COMMENT ON COLUMN "treatise_library"."deleted_at" IS '删除时间'; COMMENT ON COLUMN "treatise_library"."enabled" IS '是否有效 t是f否'`);
        await queryRunner.query(`CREATE INDEX "IDX_b472576d4b80c0e899993194fc" ON "treatise_library" ("column_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "treatise_library_pkey" ON "treatise_library" ("id") `);
        await queryRunner.query(`CREATE TABLE "treatise_library_types" ("id" character varying(128) NOT NULL, "name" character varying NOT NULL, "column_id" character varying(128), CONSTRAINT "PK_2f45d5376649ee671931fdc8a98" PRIMARY KEY ("id")); COMMENT ON COLUMN "treatise_library_types"."id" IS '主键id'; COMMENT ON COLUMN "treatise_library_types"."name" IS '名称'; COMMENT ON COLUMN "treatise_library_types"."column_id" IS '栏目id,精选文库只能选择精选文库相关的栏目且不为空'`);
        await queryRunner.query(`CREATE INDEX "IDX_1a7708a8f2627442563fe63810" ON "treatise_library_types" ("column_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "treatise_library_types_pkey" ON "treatise_library_types" ("id") `);
        await queryRunner.query(`ALTER TABLE "analysis_policies" ADD "introduction" text`);
        await queryRunner.query(`COMMENT ON COLUMN "analysis_policies"."introduction" IS '简介'`);
        await queryRunner.query(`ALTER TABLE "conferences" ADD "parent_id" character varying(128) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."parent_id" IS '父级会议id,一级为0,默认值0'`);
        await queryRunner.query(`COMMENT ON COLUMN "analysis_policies"."content" IS '正文'`);
        await queryRunner.query(`DROP INDEX "public"."keywords_pkey"`);
        await queryRunner.query(`COMMENT ON COLUMN "keywords"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy,精选文库treatiseLibrary'`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."content" IS '正文'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "keywords_pkey" ON "keywords" ("name", "type") `);
        await queryRunner.query(`ALTER TABLE "treatise_library_keywords" ADD CONSTRAINT "FK_37354daf0f4bc8e86040c3c58e6" FOREIGN KEY ("treatise_id") REFERENCES "treatise_library"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // index
        await queryRunner.query(`CREATE INDEX "index_gin_treatise_library_title" ON "treatise_library" USING gin (title)`);
        await queryRunner.query(`CREATE INDEX "index_gin_treatise_library_keyword" ON "treatise_library" USING gin (keyword)`);
        //栏目数据
        await queryRunner.query(`DELETE FROM "columns" WHERE id in ('column_04_01_01','column_04_01_02','column_04_02_01')`);
        await queryRunner.query(`INSERT INTO "columns" ( "id", "name", "parent_id","sequence_number", "is_hide" )
        VALUES
               ( 'column_08', '精选文库', '0', 8 , 0 ),
               ( 'column_08_01', '知识追踪论文集', 'column_08', 1 , 0 ),
               ( 'column_08_02', '可穿戴设备在教育中应用论文集', 'column_08', 2 , 0 ),
               ( 'column_09', '研究报告', '0', 9 , 0 ),
               ( 'column_09_01', '研究报告', 'column_09', 1 , 0 ) ON CONFLICT ( "id" ) DO
                UPDATE
               SET "name" = EXCLUDED."name",
               "parent_id" = EXCLUDED."parent_id",
               "is_hide" = EXCLUDED."is_hide",
               "sequence_number" = EXCLUDED."sequence_number";
               `);
        // topic_types
        await queryRunner.query(`INSERT INTO "topic_types" ( "id", "name")
        VALUES
               ( 'topic_type_001', '大数据+教育' ), 
               ( 'topic_type_002', '教师教育' ),
               ( 'topic_type_003', '教育评价' ), 
               ( 'topic_type_004', '教育数字化'), 
               ( 'topic_type_005', '人工智能+教育'), 
               ( 'topic_type_006', '乡村教育' ),
               ( 'topic_type_007', '在线教育' ) ON CONFLICT ( "id" ) DO
                UPDATE
               SET "name" = EXCLUDED."name";
               `);
        //treatise_library_types
        await queryRunner.query(`INSERT INTO "treatise_library_types" ( "id", "name","column_id")
        VALUES
               ( 'paper_classification_0001', 'Bayesian Knowledge Tracing','column_08_01' ), 
               ( 'paper_classification_0002', 'Deep Learning Knowledge Tracing','column_08_01' ),
               ( 'paper_classification_0003', 'Factor Analysis Models','column_08_01' ) ON CONFLICT ( "id" ) DO
                UPDATE
               SET "name" = EXCLUDED."name";
               `);
        

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatise_library_keywords" DROP CONSTRAINT "FK_37354daf0f4bc8e86040c3c58e6"`);
        await queryRunner.query(`DROP INDEX "public"."keywords_pkey"`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."content" IS '简介'`);
        await queryRunner.query(`COMMENT ON COLUMN "keywords"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "keywords_pkey" ON "keywords" ("type", "name") `);
        await queryRunner.query(`COMMENT ON COLUMN "analysis_policies"."content" IS '简介'`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."parent_id" IS '父级会议id,一级为0,默认值0'`);
        await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "parent_id"`);
        await queryRunner.query(`COMMENT ON COLUMN "analysis_policies"."introduction" IS '简介'`);
        await queryRunner.query(`ALTER TABLE "analysis_policies" DROP COLUMN "introduction"`);
        await queryRunner.query(`DROP INDEX "public"."treatise_library_types_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a7708a8f2627442563fe63810"`);
        await queryRunner.query(`DROP TABLE "treatise_library_types"`);
        await queryRunner.query(`DROP INDEX "public"."treatise_library_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b472576d4b80c0e899993194fc"`);
        await queryRunner.query(`DROP TABLE "treatise_library"`);
        await queryRunner.query(`DROP INDEX "public"."treatise_library_keywords_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c2b8c7ea8dfe47c2f61877436"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37354daf0f4bc8e86040c3c58e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_38bfacd9328a69e35974b6db04"`);
        await queryRunner.query(`DROP TABLE "treatise_library_keywords"`);
        // data
        await queryRunner.query(`DELETE FROM "topic_types"`);
    }

}
