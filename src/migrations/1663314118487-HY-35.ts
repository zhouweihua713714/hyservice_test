import { MigrationInterface, QueryRunner } from "typeorm";

export class HY351663314118487 implements MigrationInterface {
    name = 'HY351663314118487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatises" ADD "year" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."year" IS '发表时间,冗余字段便于查询'`);
        await queryRunner.query(`CREATE INDEX "IDX_8da757a18cc1c3f774c66e03e7" ON "treatises" ("column_id") `);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS btree_gin`);
        await queryRunner.query(`CREATE INDEX "index_gin_treatise_title" ON "treatises" USING gin (title)`);
        await queryRunner.query(`CREATE INDEX "index_gin_treatise_keyword" ON "treatises" USING gin (keyword)`);
        await queryRunner.query(`CREATE INDEX "index_gin_treatise_abstract" ON "treatises" USING gin (abstract)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8da757a18cc1c3f774c66e03e7"`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."year" IS '发表时间,冗余字段便于查询'`);
        await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "year"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "index_gin_treatise_title"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "index_gin_treatise_keyword"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "index_gin_treatise_abstract"`);
    }

}
