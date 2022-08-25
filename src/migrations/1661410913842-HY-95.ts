import { MigrationInterface, QueryRunner } from "typeorm";

export class HY951661410913842 implements MigrationInterface {
    name = 'HY951661410913842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatises" ADD "name" character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."name" IS '期刊/会议名'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."name" IS '期刊/会议名'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "name"`);
    }

}
