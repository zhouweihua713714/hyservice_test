import { MigrationInterface, QueryRunner } from "typeorm";

export class HY411663141962377 implements MigrationInterface {
    name = 'HY411663141962377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "terms" ADD "year" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "terms"."year" IS '批准时间(年份),冗余字段便于查询'`);
        await queryRunner.query(`CREATE INDEX "IDX_79b56b84207dc3c5510bb093d3" ON "terms" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_ecf0a869a138256d6cd1966547" ON "terms" ("keyword") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ecf0a869a138256d6cd1966547"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_79b56b84207dc3c5510bb093d3"`);
        await queryRunner.query(`COMMENT ON COLUMN "terms"."year" IS '批准时间(年份),冗余字段便于查询'`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "year"`);
    }

}
