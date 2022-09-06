import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1091662452559169 implements MigrationInterface {
    name = 'HY1091662452559169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "title" TYPE character varying(300)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."title" IS '专利标题'`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "agency"  TYPE character varying(300)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."agency" IS '代理机构'`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "agent" TYPE character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."agent" IS '代理人'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "patents"."agent" IS '代理人'`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "agent" TYPE character varying(64)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."agency" IS '代理机构'`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "agency" TYPE character varying(128)`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."title" IS '专利标题'`);
        await queryRunner.query(`ALTER TABLE "patents" ALTER COLUMN "title" TYPE character varying(100) NOT NULL`);
    }

}
