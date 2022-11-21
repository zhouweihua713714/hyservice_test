import { MigrationInterface, QueryRunner } from "typeorm";

export class HY4251669020796154 implements MigrationInterface {
    name = 'HY4251669020796154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policies" ALTER COLUMN "institution" TYPE character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."institution" IS '发布机构/部门'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "policies"."institution" IS '发布机构/部门'`);
        await queryRunner.query(`ALTER TABLE "policies" ALTER COLUMN "institution" TYPE character varying(50)`);
    }

}
