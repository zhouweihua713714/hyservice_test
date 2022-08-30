import { MigrationInterface, QueryRunner } from "typeorm";

export class HY991661823665822 implements MigrationInterface {
    name = 'HY991661823665822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "region" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."region" IS '科研人员所属国家或地区'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "field" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."field" IS '文章主领域'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "minor_field" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."minor_field" IS '文章子领域'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "search" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."search" IS '检索情况'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "name" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."name" IS '期刊/会议名'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "publisher" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."publisher" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "publisher_address" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."publisher_address" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "periodical" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."periodical" IS '期刊名称'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "periodical_abbreviation" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."periodical_abbreviation" IS '期刊简称'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "doi" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."doi" IS 'doi 论文唯一id'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN " study_field" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"." study_field" IS '研究方向'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "title" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."title" IS '论文标题'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "url" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."url" IS '论文链接'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatises"." study_field" IS '研究方向'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN " study_field" TYPE character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."doi" IS 'doi 论文唯一id'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "doi" TYPE character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."periodical_abbreviation" IS '期刊简称'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "periodical_abbreviation" TYPE character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."periodical" IS '期刊名称'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "periodical" TYPE character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."publisher_address" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "publisher_address" TYPE character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."publisher" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "publisher" TYPE character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."name" IS '期刊/会议名'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "name" TYPE character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."search" IS '检索情况'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "search" TYPE character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."minor_field" IS '文章子领域'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "minor_field" TYPE character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."field" IS '文章主领域'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "field" TYPE character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."region" IS '科研人员所属国家或地区'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "region" TYPE character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."url" IS '论文链接'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "url" TYPE character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."title" IS '论文标题'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "title" TYPE character varying(300)`);
    }

}
