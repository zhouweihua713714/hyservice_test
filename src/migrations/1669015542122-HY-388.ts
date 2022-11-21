import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3881669015542122 implements MigrationInterface {
    name = 'HY3881669015542122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "analysis_policies" DROP COLUMN "introduction"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "analysis_policies" ADD "introduction" text`);
    }

}
