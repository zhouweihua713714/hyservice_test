import { MigrationInterface, QueryRunner } from "typeorm";

export class HY971661480998263 implements MigrationInterface {
    name = 'HY971661480998263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author_abbreviation" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author_abbreviation" IS '第一作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author_address" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author_address" IS '作者地址'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author_address" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_address" IS '通讯作者地址'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "references_number" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."references_number" IS '参考文献量'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "publisher" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."publisher" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "publisher_address" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."publisher_address" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "periodical" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."periodical" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "periodical_abbreviation" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."periodical_abbreviation" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "released_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."released_at" IS '出版年'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "doi" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."doi" IS 'doi 论文唯一id'`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD " study_field" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"." study_field" IS '研究方向'`);
        // await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "title" TYPE character varying(300)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."title" IS '论文标题'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author" IS '第一作者/作者全称'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author_unit" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author_unit" IS '第一作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author" IS '通讯作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author_unit" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_unit" IS '通讯作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author_email"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author_email" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_email" IS '通讯作者邮箱'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "other_author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "other_author" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."other_author" IS '其他作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "other_author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "other_author_unit" text`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."other_author_unit" IS '其他作者单位'`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."quote" IS '引用情况(次数)/被引频合计'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."quote" IS '引用情况(次数)'`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."other_author_unit" IS '其他作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "other_author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "other_author_unit" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."other_author" IS '其他作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "other_author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "other_author" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_email" IS '通讯作者邮箱'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author_email"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author_email" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_unit" IS '通讯作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author_unit" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author" IS '通讯作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "corresponding_author" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author_unit" IS '第一作者单位'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author_unit"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author_unit" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author" IS '第一作者/作者全称'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "treatises" ADD "author" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."title" IS '论文标题'`);
        // await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "title" TYPE character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"." study_field" IS '研究方向'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN " study_field"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."doi" IS 'doi 论文唯一id'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "doi"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."released_at" IS '出版年'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "released_at"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."periodical_abbreviation" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "periodical_abbreviation"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."periodical" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "periodical"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."publisher_address" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "publisher_address"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."publisher" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "publisher"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."references_number" IS '参考文献量'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "references_number"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."corresponding_author_address" IS '通讯作者地址'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "corresponding_author_address"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author_address" IS '作者地址'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author_address"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."author_abbreviation" IS '第一作者'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "author_abbreviation"`);
    }

}
