import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1471663914930943 implements MigrationInterface {
    name = 'HY1471663914930943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "title" TYPE text`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."title" IS '专利标题'`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "keyword" TYPE text`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "agent" TYPE text`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "institution" TYPE text`);
        await queryRunner.query(`ALTER TABLE  "institutions"  ALTER COLUMN  "url" TYPE character varying(255)`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."url" IS '图片链接'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."url" IS '图片链接'`);
        await queryRunner.query(`ALTER TABLE  "institutions"  ALTER COLUMN  "url" TYPE character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."title" IS '专利标题'`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "agent" TYPE character varying(100)`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "institution" TYPE character varying(100)`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "keyword" TYPE character varying(100)`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "title" TYPE character varying(300)`);
    }

}
