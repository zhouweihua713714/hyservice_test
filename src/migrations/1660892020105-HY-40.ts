import { MigrationInterface, QueryRunner } from "typeorm";

export class HY401660892020105 implements MigrationInterface {
    name = 'HY401660892020105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "name" character varying(200) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."name" IS '期刊名称'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "url" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."url" IS '网址'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "publisher"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "publisher" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."publisher" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "cover_url"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "cover_url" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."cover_url" IS '封面链接'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "url" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."url" IS '政策来源(网址)'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "policies"."url" IS '政策来源(网址)'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "url" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."cover_url" IS '封面链接'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "cover_url"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "cover_url" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."publisher" IS '出版商'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "publisher"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "publisher" character varying(50)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."url" IS '网址'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "url" character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."name" IS '期刊名称'`);
        await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "periodicals" ADD "name" character varying(50) NOT NULL`);
    }

}
