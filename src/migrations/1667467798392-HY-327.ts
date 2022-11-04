import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3271667467798392 implements MigrationInterface {
    name = 'HY3271667467798392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "america_terms" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."deleted_at" IS '删除时间'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."deleted_at" IS '删除时间'`);
        await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "deleted_at"`);
    }

}
