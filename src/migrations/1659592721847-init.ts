import { MigrationInterface, QueryRunner } from "typeorm";

export class init1659592721847 implements MigrationInterface {
    name = 'init1659592721847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "columns" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, "parent_id" character varying(128) NOT NULL, "sequence_number" character varying(64) NOT NULL, "is_hide" smallint NOT NULL DEFAULT '0', CONSTRAINT "PK_4ac339ccbbfed1dcd96812abbd5" PRIMARY KEY ("id")); COMMENT ON COLUMN "columns"."id" IS '主键id'; COMMENT ON COLUMN "columns"."name" IS '栏目名称'; COMMENT ON COLUMN "columns"."parent_id" IS '父级id'; COMMENT ON COLUMN "columns"."sequence_number" IS '排序'; COMMENT ON COLUMN "columns"."is_hide" IS '是否隐藏:1是,0否'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "columns_pkey" ON "columns" ("id") `);
        await queryRunner.query(`CREATE TABLE "america_terms" ("id" character varying(128) NOT NULL, "award_id" character varying(50), "award_title" character varying, "amount" integer, "investigator" character varying, "instrument" character varying(50), "program_officer" character varying, "institution" character varying, "foa_information" character varying, "organization" character varying(50) NOT NULL, "program_element" character varying, "abstract" text, "reference" text, "year" character varying, "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(20), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f88e73ddc5bf8d627a7ace6ddcf" PRIMARY KEY ("id")); COMMENT ON COLUMN "america_terms"."id" IS '主键id'; COMMENT ON COLUMN "america_terms"."award_id" IS 'AwardID'; COMMENT ON COLUMN "america_terms"."award_title" IS 'AwardTitle'; COMMENT ON COLUMN "america_terms"."amount" IS '数量'; COMMENT ON COLUMN "america_terms"."investigator" IS '研究人'; COMMENT ON COLUMN "america_terms"."instrument" IS '资助方式'; COMMENT ON COLUMN "america_terms"."program_officer" IS '项目负责人'; COMMENT ON COLUMN "america_terms"."institution" IS '所属机构'; COMMENT ON COLUMN "america_terms"."foa_information" IS 'foa信息'; COMMENT ON COLUMN "america_terms"."organization" IS '组织'; COMMENT ON COLUMN "america_terms"."program_element" IS 'ProgramElement'; COMMENT ON COLUMN "america_terms"."abstract" IS '摘要叙述'; COMMENT ON COLUMN "america_terms"."reference" IS 'ProgramReference'; COMMENT ON COLUMN "america_terms"."year" IS '批准年份'; COMMENT ON COLUMN "america_terms"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "america_terms"."owner_id" IS '录入人id'; COMMENT ON COLUMN "america_terms"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "america_terms"."created_at" IS '创建时间'; COMMENT ON COLUMN "america_terms"."updated_at" IS '更新时间'; COMMENT ON COLUMN "america_terms"."published_at" IS '发布时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "america_terms_pkey" ON "america_terms" ("id") `);
        await queryRunner.query(`CREATE TABLE "conferences" ("id" character varying(128) NOT NULL, "column_id" character varying(128) NOT NULL, "abbreviation" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, "conducted_at" TIMESTAMP WITH TIME ZONE, "ended_at" TIMESTAMP WITH TIME ZONE, "period" character varying(50), "location" character varying(50), "introduction" text, "field" jsonb, "minor_field" jsonb, "website" character varying(50), "contact" character varying(50), "email" character varying(50), "unit" character varying(50), "delivery_ended_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "preregister_ended_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "register_ended_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(20), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d28afb89755d548215ce4e7667b" PRIMARY KEY ("id")); COMMENT ON COLUMN "conferences"."id" IS '主键id'; COMMENT ON COLUMN "conferences"."column_id" IS '栏目id,会议只能选择会议相关的栏目id'; COMMENT ON COLUMN "conferences"."abbreviation" IS '会议缩写'; COMMENT ON COLUMN "conferences"."name" IS '会议名称'; COMMENT ON COLUMN "conferences"."conducted_at" IS '举办时间'; COMMENT ON COLUMN "conferences"."ended_at" IS '举办结束时间(个别数据有)'; COMMENT ON COLUMN "conferences"."period" IS '届'; COMMENT ON COLUMN "conferences"."location" IS '地点'; COMMENT ON COLUMN "conferences"."introduction" IS '会议简介/主题'; COMMENT ON COLUMN "conferences"."field" IS '主领域,格式 [string,string]'; COMMENT ON COLUMN "conferences"."minor_field" IS '子领域,格式 [string,string]'; COMMENT ON COLUMN "conferences"."website" IS '网站'; COMMENT ON COLUMN "conferences"."contact" IS '联络人'; COMMENT ON COLUMN "conferences"."email" IS '联络人邮箱'; COMMENT ON COLUMN "conferences"."unit" IS '举办单位'; COMMENT ON COLUMN "conferences"."delivery_ended_at" IS '送稿截止时间'; COMMENT ON COLUMN "conferences"."preregister_ended_at" IS '提前注册截止时间'; COMMENT ON COLUMN "conferences"."register_ended_at" IS '注册截止时间'; COMMENT ON COLUMN "conferences"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "conferences"."owner_id" IS '录入人id'; COMMENT ON COLUMN "conferences"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "conferences"."created_at" IS '创建时间'; COMMENT ON COLUMN "conferences"."updated_at" IS '更新时间'; COMMENT ON COLUMN "conferences"."published_at" IS '发布时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "conferences_pkey" ON "conferences" ("id") `);
        await queryRunner.query(`CREATE TABLE "codes" ("mobile" text NOT NULL, "code" character varying(6) NOT NULL, "sent_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_55409b69c6fb865eb4fcd7f0fd5" PRIMARY KEY ("mobile")); COMMENT ON COLUMN "codes"."mobile" IS '手机号码'; COMMENT ON COLUMN "codes"."code" IS '验证码'; COMMENT ON COLUMN "codes"."sent_at" IS '发送时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "codes_pkey" ON "codes" ("mobile") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "codes_id_key" ON "codes" ("mobile") `);
        await queryRunner.query(`CREATE TABLE "countries" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id")); COMMENT ON COLUMN "countries"."id" IS '主键id'; COMMENT ON COLUMN "countries"."name" IS '名称'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "countries_pkey" ON "countries" ("id") `);
        await queryRunner.query(`CREATE TABLE "fields" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, "type" character varying(32) NOT NULL, "is_main" smallint NOT NULL DEFAULT '0', CONSTRAINT "PK_ee7a215c6cd77a59e2cb3b59d41" PRIMARY KEY ("id")); COMMENT ON COLUMN "fields"."id" IS 'id'; COMMENT ON COLUMN "fields"."name" IS '领域名称'; COMMENT ON COLUMN "fields"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy'; COMMENT ON COLUMN "fields"."is_main" IS '是否主领域:1是,0否'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "fields_pkey" ON "fields" ("id") `);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" text NOT NULL, "status" smallint NOT NULL DEFAULT '0', "oss_info" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id")); COMMENT ON COLUMN "files"."filename" IS '文件名'; COMMENT ON COLUMN "files"."status" IS '文件状态默认0,1已上传'; COMMENT ON COLUMN "files"."oss_info" IS 'oss 信息'; COMMENT ON COLUMN "files"."created_at" IS '创建时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "files_pkey" ON "files" ("id") `);
        await queryRunner.query(`CREATE TABLE "institutions" ("id" character varying(128) NOT NULL, "column_id" character varying(128) NOT NULL, "name" character varying(50) NOT NULL, "foreign_name" character varying(50) NOT NULL, "address" character varying(50) NOT NULL, "introduction" text, "website" character varying(50) NOT NULL, "unit" character varying(50), "field" jsonb, "minor_field" jsonb, "longitude" numeric(10,6), "latitude" numeric(10,6), "url" character varying(64), "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(20), "keyword" character varying(100), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_0be7539dcdba335470dc05e9690" PRIMARY KEY ("id")); COMMENT ON COLUMN "institutions"."id" IS '主键id'; COMMENT ON COLUMN "institutions"."column_id" IS '栏目id,机构只能选择机构相关的栏目id'; COMMENT ON COLUMN "institutions"."name" IS '中文机构名称'; COMMENT ON COLUMN "institutions"."foreign_name" IS '外文机构名称'; COMMENT ON COLUMN "institutions"."address" IS '详细地址'; COMMENT ON COLUMN "institutions"."introduction" IS '简介'; COMMENT ON COLUMN "institutions"."website" IS '网站'; COMMENT ON COLUMN "institutions"."unit" IS '主办单位'; COMMENT ON COLUMN "institutions"."field" IS '主领域,格式 [string,string]'; COMMENT ON COLUMN "institutions"."minor_field" IS '子领域,格式 [string,string]'; COMMENT ON COLUMN "institutions"."longitude" IS '子领域'; COMMENT ON COLUMN "institutions"."latitude" IS '子领域'; COMMENT ON COLUMN "institutions"."url" IS '图片链接'; COMMENT ON COLUMN "institutions"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "institutions"."owner_id" IS '录入人id'; COMMENT ON COLUMN "institutions"."keyword" IS '关键字'; COMMENT ON COLUMN "institutions"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "institutions"."created_at" IS '创建时间'; COMMENT ON COLUMN "institutions"."updated_at" IS '更新时间'; COMMENT ON COLUMN "institutions"."published_at" IS '发布时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "institutions_pkey" ON "institutions" ("id") `);
        await queryRunner.query(`CREATE TABLE "languages" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id")); COMMENT ON COLUMN "languages"."id" IS '主键id'; COMMENT ON COLUMN "languages"."name" IS '名称'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "languages_pkey" ON "languages" ("id") `);
        await queryRunner.query(`CREATE TABLE "periodicals" ("id" character varying(128) NOT NULL, "column_id" character varying(128) NOT NULL, "name" character varying(50) NOT NULL, "type" character varying(64) NOT NULL, "introduction" text, "language" jsonb, "region" jsonb, "field" character varying(128), "minor_field" character varying(128), "url" character varying(50), "address" character varying(50), "search" character varying(32), "impact_factor" numeric(5,3), "established_at" TIMESTAMP WITH TIME ZONE, "publisher" character varying(50), "period" character varying(10), "manager" character varying(50), "organizer" character varying(50), "issn" character varying(50), "cn" character varying(50), "peking_unit" jsonb, "honor" character varying(50), "article_number" integer, "quote" integer, "downloads" integer, "classification" jsonb, "composite_impact_factor" numeric(5,3), "check_period" character varying(50), "release_period" character varying(50), "record_rate" numeric(5,2), "check_fee" numeric(10,2), "page_fee" numeric(10,2), "reward" numeric(10,2), "cover_url" character varying(50), "cite_score" numeric(10,1), "cite_rate" integer, "content" jsonb, "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(20), "picture" character varying(128), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8995eaf2fb5597b7fb0874394e6" PRIMARY KEY ("id")); COMMENT ON COLUMN "periodicals"."id" IS '主键id'; COMMENT ON COLUMN "periodicals"."column_id" IS '栏目id,期刊只能选择期刊相关的栏目id'; COMMENT ON COLUMN "periodicals"."name" IS '期刊名称'; COMMENT ON COLUMN "periodicals"."type" IS '期刊类型'; COMMENT ON COLUMN "periodicals"."introduction" IS '简介'; COMMENT ON COLUMN "periodicals"."language" IS '语种,格式:[string,string]'; COMMENT ON COLUMN "periodicals"."region" IS '地区(刊物国别)格式 [string,string]'; COMMENT ON COLUMN "periodicals"."field" IS '主领域'; COMMENT ON COLUMN "periodicals"."minor_field" IS '子领域,格式 [string,string]'; COMMENT ON COLUMN "periodicals"."url" IS '网址'; COMMENT ON COLUMN "periodicals"."address" IS '详细地址'; COMMENT ON COLUMN "periodicals"."search" IS '检索情况'; COMMENT ON COLUMN "periodicals"."impact_factor" IS '影响因子'; COMMENT ON COLUMN "periodicals"."established_at" IS '创刊时间'; COMMENT ON COLUMN "periodicals"."publisher" IS '出版商'; COMMENT ON COLUMN "periodicals"."period" IS '刊发周期'; COMMENT ON COLUMN "periodicals"."manager" IS '主管单位'; COMMENT ON COLUMN "periodicals"."organizer" IS '主办单位'; COMMENT ON COLUMN "periodicals"."issn" IS 'ISSN,国际标准期刊编号'; COMMENT ON COLUMN "periodicals"."cn" IS '国内统一刊号'; COMMENT ON COLUMN "periodicals"."peking_unit" IS '中文核心期刊(北大),格式 [string,string]'; COMMENT ON COLUMN "periodicals"."honor" IS '期刊荣誉'; COMMENT ON COLUMN "periodicals"."article_number" IS '载文量'; COMMENT ON COLUMN "periodicals"."quote" IS '引用量'; COMMENT ON COLUMN "periodicals"."downloads" IS '下载次数(统计CNKI中国知网)'; COMMENT ON COLUMN "periodicals"."classification" IS '学科分类(CNKI中国知网),格式:[string,string]'; COMMENT ON COLUMN "periodicals"."composite_impact_factor" IS '综合影响因子'; COMMENT ON COLUMN "periodicals"."check_period" IS '审稿周期'; COMMENT ON COLUMN "periodicals"."release_period" IS '发稿周期'; COMMENT ON COLUMN "periodicals"."record_rate" IS '录用率'; COMMENT ON COLUMN "periodicals"."check_fee" IS '审稿费'; COMMENT ON COLUMN "periodicals"."page_fee" IS '版面费'; COMMENT ON COLUMN "periodicals"."reward" IS '稿酬'; COMMENT ON COLUMN "periodicals"."cover_url" IS '封面链接'; COMMENT ON COLUMN "periodicals"."cite_score" IS '引用分'; COMMENT ON COLUMN "periodicals"."cite_rate" IS '被引用率'; COMMENT ON COLUMN "periodicals"."content" IS '详情'; COMMENT ON COLUMN "periodicals"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "periodicals"."owner_id" IS '录入人id'; COMMENT ON COLUMN "periodicals"."picture" IS '栏目图片'; COMMENT ON COLUMN "periodicals"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "periodicals"."created_at" IS '创建时间'; COMMENT ON COLUMN "periodicals"."updated_at" IS '更新时间'; COMMENT ON COLUMN "periodicals"."published_at" IS '发布时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "periodicals_pkey" ON "periodicals" ("id") `);
        await queryRunner.query(`CREATE TABLE "periodical_periods" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "PK_c1ccd8ca6902fcb0899d40ba375" PRIMARY KEY ("id")); COMMENT ON COLUMN "periodical_periods"."id" IS '主键id'; COMMENT ON COLUMN "periodical_periods"."name" IS '名称'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "periodical_periods_pkey" ON "periodical_periods" ("id") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mobile" character varying(11) NOT NULL, "name" character varying(20), "info" json NOT NULL DEFAULT '{}', "created_at" date NOT NULL DEFAULT now(), "gender" character varying(10) NOT NULL DEFAULT 'unknown', "status" character varying(10) NOT NULL DEFAULT 'enabled', "type" character varying(10) NOT NULL DEFAULT 'user', CONSTRAINT "UQ_d376a9f93bba651f32a2c03a7d3" UNIQUE ("mobile"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."mobile" IS '手机号码'; COMMENT ON COLUMN "users"."name" IS '姓名'; COMMENT ON COLUMN "users"."info" IS '用户拓展信息'; COMMENT ON COLUMN "users"."created_at" IS '创建时间'; COMMENT ON COLUMN "users"."gender" IS '性别:男:male,女:female,未知:unknown'; COMMENT ON COLUMN "users"."status" IS '是否有效:enabled,disabled 无效'; COMMENT ON COLUMN "users"."type" IS '用户类型:普通用户user,管理员admin,超级管理员administrator'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_mobile_key" ON "users" ("mobile") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_pkey" ON "users" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_id_key" ON "users" ("id") `);
        await queryRunner.query(`CREATE TABLE "logins" ("mobile" character varying(11) NOT NULL, "token" character varying(255) NOT NULL, "provider" character varying(20) NOT NULL, "id" uuid, CONSTRAINT "PK_bc46a2fa041e466f0869803f29a" PRIMARY KEY ("mobile", "provider")); COMMENT ON COLUMN "logins"."mobile" IS '手机号码'; COMMENT ON COLUMN "logins"."token" IS '密码'; COMMENT ON COLUMN "logins"."provider" IS '来源'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "logins_pkey" ON "logins" ("mobile", "provider") `);
        await queryRunner.query(`CREATE TABLE "patents" ("id" character varying(128) NOT NULL, "title" character varying(50) NOT NULL, "keyword" character varying(100), "abstract" text, "institution" character varying(50), "announced_no" character varying(128), "announced_at" TIMESTAMP WITH TIME ZONE, "applied_no" character varying(128), "applied_at" TIMESTAMP WITH TIME ZONE, "type" character varying(64), "country" character varying(32), "agency" character varying(128), "agent" character varying(64), "valid_status" character varying(64), "column_id" character varying(128) NOT NULL, "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(20), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_dfe8b87e137b6c078c97483e5ee" PRIMARY KEY ("id")); COMMENT ON COLUMN "patents"."id" IS '主键id'; COMMENT ON COLUMN "patents"."title" IS '专利标题'; COMMENT ON COLUMN "patents"."keyword" IS '关键字'; COMMENT ON COLUMN "patents"."abstract" IS '摘要'; COMMENT ON COLUMN "patents"."institution" IS '申请人(单位)'; COMMENT ON COLUMN "patents"."announced_no" IS '公开(公告)号'; COMMENT ON COLUMN "patents"."announced_at" IS '公开(公告)日'; COMMENT ON COLUMN "patents"."applied_no" IS '申请号'; COMMENT ON COLUMN "patents"."applied_at" IS '申请日'; COMMENT ON COLUMN "patents"."type" IS '专利类型'; COMMENT ON COLUMN "patents"."country" IS '公开国别'; COMMENT ON COLUMN "patents"."agency" IS '代理机构'; COMMENT ON COLUMN "patents"."agent" IS '代理人'; COMMENT ON COLUMN "patents"."valid_status" IS '专利有效性'; COMMENT ON COLUMN "patents"."column_id" IS '栏目id,专利只能选择专利相关的栏目id'; COMMENT ON COLUMN "patents"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "patents"."owner_id" IS '录入人id'; COMMENT ON COLUMN "patents"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "patents"."created_at" IS '创建时间'; COMMENT ON COLUMN "patents"."updated_at" IS '更新时间'; COMMENT ON COLUMN "patents"."published_at" IS '发布时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "patents_pkey" ON "patents" ("id") `);
        await queryRunner.query(`CREATE TABLE "policies" ("id" character varying(128) NOT NULL, "column_id" character varying(128) NOT NULL, "name" character varying(50) NOT NULL, "type" character varying(64), "level" character varying(64), "institution" character varying(50), "announce_no" character varying(50), "education_level" jsonb, "keyword" character varying(100), "announced_at" TIMESTAMP WITH TIME ZONE, "introduction" text, "url" character varying(10), "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(20), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_603e09f183df0108d8695c57e28" PRIMARY KEY ("id")); COMMENT ON COLUMN "policies"."id" IS '主键id'; COMMENT ON COLUMN "policies"."column_id" IS '栏目id,政策只能选择政策相关的栏目id'; COMMENT ON COLUMN "policies"."name" IS '政策名称'; COMMENT ON COLUMN "policies"."type" IS '政策类型'; COMMENT ON COLUMN "policies"."level" IS '政策层次'; COMMENT ON COLUMN "policies"."institution" IS '发布机构'; COMMENT ON COLUMN "policies"."announce_no" IS '发文号'; COMMENT ON COLUMN "policies"."education_level" IS '教育层次:基础教育,高等教育,职业教育'; COMMENT ON COLUMN "policies"."keyword" IS '关键字'; COMMENT ON COLUMN "policies"."announced_at" IS '政策发布时间(出台时间)'; COMMENT ON COLUMN "policies"."introduction" IS '简介'; COMMENT ON COLUMN "policies"."url" IS '政策来源(网址)'; COMMENT ON COLUMN "policies"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "policies"."owner_id" IS '录入人id'; COMMENT ON COLUMN "policies"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "policies"."created_at" IS '创建时间'; COMMENT ON COLUMN "policies"."updated_at" IS '更新时间'; COMMENT ON COLUMN "policies"."published_at" IS '发布时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "policies_pkey" ON "policies" ("id") `);
        await queryRunner.query(`CREATE TABLE "subjects" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, "type" character varying(32) NOT NULL, CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id")); COMMENT ON COLUMN "subjects"."id" IS '主键id'; COMMENT ON COLUMN "subjects"."name" IS '学科名称'; COMMENT ON COLUMN "subjects"."type" IS '类型:项目term,论文treatise,会议:conference,期刊periodical,机构institution,专利patent,政策policy'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "subjects_pkey" ON "subjects" ("id") `);
        await queryRunner.query(`CREATE TABLE "terms" ("id" character varying(128) NOT NULL, "term_number" character varying(50), "principal" character varying(50), "unit" character varying(50), "province" character varying(50), "money" numeric(10,2), "type" character varying(64) NOT NULL, "department" character varying(64), "authorized_at" TIMESTAMP WITH TIME ZONE, "name" character varying(50) NOT NULL, "subject" character varying(50), "subject_no" character varying(50), "started_at" TIMESTAMP WITH TIME ZONE, "ended_at" TIMESTAMP WITH TIME ZONE, "keyword" character varying(100), "column_id" character varying(128) NOT NULL, "content" jsonb, "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(20), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_33b6fe77d6ace7ff43cc8a65958" PRIMARY KEY ("id")); COMMENT ON COLUMN "terms"."id" IS '主键id'; COMMENT ON COLUMN "terms"."term_number" IS '项目编号'; COMMENT ON COLUMN "terms"."principal" IS '负责人'; COMMENT ON COLUMN "terms"."unit" IS '依托单位'; COMMENT ON COLUMN "terms"."province" IS '省份'; COMMENT ON COLUMN "terms"."money" IS '金额(万元)'; COMMENT ON COLUMN "terms"."type" IS '项目类型'; COMMENT ON COLUMN "terms"."department" IS '学部'; COMMENT ON COLUMN "terms"."authorized_at" IS '批准时间(年份)'; COMMENT ON COLUMN "terms"."name" IS '项目名称'; COMMENT ON COLUMN "terms"."subject" IS '学科分类'; COMMENT ON COLUMN "terms"."subject_no" IS '学科代码'; COMMENT ON COLUMN "terms"."started_at" IS '执行时间,开始时间'; COMMENT ON COLUMN "terms"."ended_at" IS '执行时间,结束时间'; COMMENT ON COLUMN "terms"."keyword" IS '关键字'; COMMENT ON COLUMN "terms"."column_id" IS '栏目id,项目只能选择相关的栏目id'; COMMENT ON COLUMN "terms"."content" IS '详情'; COMMENT ON COLUMN "terms"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "terms"."owner_id" IS '录入人id'; COMMENT ON COLUMN "terms"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "terms"."created_at" IS '创建时间'; COMMENT ON COLUMN "terms"."updated_at" IS '更新时间'; COMMENT ON COLUMN "terms"."published_at" IS '发布时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "terms_pkey" ON "terms" ("id") `);
        await queryRunner.query(`CREATE TABLE "policy_types" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "PK_244e80fae5940d7e668e6a930c9" PRIMARY KEY ("id")); COMMENT ON COLUMN "policy_types"."id" IS '主键id'; COMMENT ON COLUMN "policy_types"."name" IS '名称'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "policy_types_pkey" ON "policy_types" ("id") `);
        await queryRunner.query(`CREATE TABLE "term_types" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "PK_2320bff03ed575f196ac0c15d20" PRIMARY KEY ("id")); COMMENT ON COLUMN "term_types"."id" IS '主键id'; COMMENT ON COLUMN "term_types"."name" IS '项目类型名称'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "term_types_pkey" ON "term_types" ("id") `);
        await queryRunner.query(`CREATE TABLE "treatises" ("id" character varying(128) NOT NULL, "title" character varying(50) NOT NULL, "year" character varying(32), "region" character varying(32), "channel" character varying(32), "language" character varying(10) DEFAULT 'CN', "author" character varying(32), "author_unit" character varying(128), "corresponding_author" character varying(32), "corresponding_author_unit" character varying(128), "corresponding_author_email" character varying(128), "other_author" character varying(128), "other_author_unit" character varying(128), "field" character varying(64), "minor_field" character varying(64), "sort" character varying(32), "abstract" text, "search" character varying(32), "references" text, "quote" integer, "funded_project" integer, "url" character varying(128), "name" character varying(128), "conference_field" character varying(64), "conference_minor_field" character varying(64), "type" character varying(64) NOT NULL DEFAULT 'treatise', "column_id" character varying(128), "content" jsonb, "status" character varying(10) NOT NULL DEFAULT 'ready', "owner_id" character varying(20), "keyword" character varying(100), "clicks" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8b2210d938f36de9c69550d09d2" PRIMARY KEY ("id")); COMMENT ON COLUMN "treatises"."id" IS '主键id'; COMMENT ON COLUMN "treatises"."title" IS '论文标题'; COMMENT ON COLUMN "treatises"."year" IS '发表时间,单位:年'; COMMENT ON COLUMN "treatises"."region" IS '科研人员所属国家或地区'; COMMENT ON COLUMN "treatises"."channel" IS '发表途径'; COMMENT ON COLUMN "treatises"."language" IS '语种'; COMMENT ON COLUMN "treatises"."author" IS '第一作者'; COMMENT ON COLUMN "treatises"."author_unit" IS '第一作者单位'; COMMENT ON COLUMN "treatises"."corresponding_author" IS '通讯作者'; COMMENT ON COLUMN "treatises"."corresponding_author_unit" IS '通讯作者单位'; COMMENT ON COLUMN "treatises"."corresponding_author_email" IS '通讯作者邮箱'; COMMENT ON COLUMN "treatises"."other_author" IS '其他作者'; COMMENT ON COLUMN "treatises"."other_author_unit" IS '其他作者单位'; COMMENT ON COLUMN "treatises"."field" IS '文章主领域'; COMMENT ON COLUMN "treatises"."minor_field" IS '文章子领域'; COMMENT ON COLUMN "treatises"."sort" IS '文章类型'; COMMENT ON COLUMN "treatises"."abstract" IS '摘要'; COMMENT ON COLUMN "treatises"."search" IS '检索情况'; COMMENT ON COLUMN "treatises"."references" IS '参考文献'; COMMENT ON COLUMN "treatises"."quote" IS '引用情况(次数)'; COMMENT ON COLUMN "treatises"."funded_project" IS '所获得资助项目'; COMMENT ON COLUMN "treatises"."url" IS '论文链接'; COMMENT ON COLUMN "treatises"."name" IS '期刊/会议名称,根据论文的类型区分'; COMMENT ON COLUMN "treatises"."conference_field" IS '杂志会议所属主领域'; COMMENT ON COLUMN "treatises"."conference_minor_field" IS '杂志会议所属子领域'; COMMENT ON COLUMN "treatises"."type" IS '论文类型:会议论文conference、期刊论文treatise'; COMMENT ON COLUMN "treatises"."column_id" IS '栏目id,期刊论文只能选择期刊相关的栏目且不为空'; COMMENT ON COLUMN "treatises"."content" IS '详情'; COMMENT ON COLUMN "treatises"."status" IS '状态:待发布ready,已发布active,已下架inactive'; COMMENT ON COLUMN "treatises"."owner_id" IS '录入人id'; COMMENT ON COLUMN "treatises"."keyword" IS '关键字'; COMMENT ON COLUMN "treatises"."clicks" IS '点击量,暂时不做'; COMMENT ON COLUMN "treatises"."created_at" IS '创建时间'; COMMENT ON COLUMN "treatises"."updated_at" IS '更新时间'; COMMENT ON COLUMN "treatises"."published_at" IS '发布时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "treatises_pkey" ON "treatises" ("id") `);
        await queryRunner.query(`CREATE TABLE "website" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "ipc" character varying(128) NOT NULL, "cdn" character varying(128), "version_no" character varying(64), "blacklist" character varying(100), "title" character varying(20) NOT NULL, "description" character varying(20), "ownership" character varying(50) NOT NULL, "bottom_description" character varying(50) NOT NULL, "links" jsonb NOT NULL, "logo" character varying(256) NOT NULL, "qr_code" character varying(256), CONSTRAINT "PK_979e53e64186ccd315cf09b3b14" PRIMARY KEY ("id")); COMMENT ON COLUMN "website"."name" IS '站点名称'; COMMENT ON COLUMN "website"."ipc" IS '网站备案号'; COMMENT ON COLUMN "website"."cdn" IS 'CND地址'; COMMENT ON COLUMN "website"."version_no" IS '版本号'; COMMENT ON COLUMN "website"."blacklist" IS '黑名单:ip分号隔开'; COMMENT ON COLUMN "website"."title" IS '标题'; COMMENT ON COLUMN "website"."description" IS '首页描述'; COMMENT ON COLUMN "website"."ownership" IS '版权所有'; COMMENT ON COLUMN "website"."bottom_description" IS '底部描述'; COMMENT ON COLUMN "website"."links" IS '友情链接 数组[{url:,title:xxx }]'; COMMENT ON COLUMN "website"."logo" IS 'logo'; COMMENT ON COLUMN "website"."qr_code" IS '手机二维码'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "website_pkey" ON "website" ("id") `);
        await queryRunner.query(`ALTER TABLE "logins" ADD CONSTRAINT "FK_edaf0bf87d9dd178f7a00cc801f" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logins" DROP CONSTRAINT "FK_edaf0bf87d9dd178f7a00cc801f"`);
        await queryRunner.query(`DROP INDEX "public"."website_pkey"`);
        await queryRunner.query(`DROP TABLE "website"`);
        await queryRunner.query(`DROP INDEX "public"."treatises_pkey"`);
        await queryRunner.query(`DROP TABLE "treatises"`);
        await queryRunner.query(`DROP INDEX "public"."term_types_pkey"`);
        await queryRunner.query(`DROP TABLE "term_types"`);
        await queryRunner.query(`DROP INDEX "public"."policy_types_pkey"`);
        await queryRunner.query(`DROP TABLE "policy_types"`);
        await queryRunner.query(`DROP INDEX "public"."terms_pkey"`);
        await queryRunner.query(`DROP TABLE "terms"`);
        await queryRunner.query(`DROP INDEX "public"."subjects_pkey"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP INDEX "public"."policies_pkey"`);
        await queryRunner.query(`DROP TABLE "policies"`);
        await queryRunner.query(`DROP INDEX "public"."patents_pkey"`);
        await queryRunner.query(`DROP TABLE "patents"`);
        await queryRunner.query(`DROP INDEX "public"."logins_pkey"`);
        await queryRunner.query(`DROP TABLE "logins"`);
        await queryRunner.query(`DROP INDEX "public"."users_id_key"`);
        await queryRunner.query(`DROP INDEX "public"."users_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."users_mobile_key"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."periodical_periods_pkey"`);
        await queryRunner.query(`DROP TABLE "periodical_periods"`);
        await queryRunner.query(`DROP INDEX "public"."periodicals_pkey"`);
        await queryRunner.query(`DROP TABLE "periodicals"`);
        await queryRunner.query(`DROP INDEX "public"."languages_pkey"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP INDEX "public"."institutions_pkey"`);
        await queryRunner.query(`DROP TABLE "institutions"`);
        await queryRunner.query(`DROP INDEX "public"."files_pkey"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "public"."fields_pkey"`);
        await queryRunner.query(`DROP TABLE "fields"`);
        await queryRunner.query(`DROP INDEX "public"."countries_pkey"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP INDEX "public"."codes_id_key"`);
        await queryRunner.query(`DROP INDEX "public"."codes_pkey"`);
        await queryRunner.query(`DROP TABLE "codes"`);
        await queryRunner.query(`DROP INDEX "public"."conferences_pkey"`);
        await queryRunner.query(`DROP TABLE "conferences"`);
        await queryRunner.query(`DROP INDEX "public"."america_terms_pkey"`);
        await queryRunner.query(`DROP TABLE "america_terms"`);
        await queryRunner.query(`DROP INDEX "public"."columns_pkey"`);
        await queryRunner.query(`DROP TABLE "columns"`);
    }

}