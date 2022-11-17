import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3561668079612661 implements MigrationInterface {
    name = 'HY3561668079612661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "america_terms" ALTER COLUMN "keyword" TYPE character varying(256)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "america_terms" ALTER COLUMN "keyword" TYPE character varying(100)`);
    }

}
