import { MigrationInterface, QueryRunner } from 'typeorm';

export class HY411663138888243 implements MigrationInterface {
  name = 'HY411663138888243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "terms" ADD "year" integer`);
    await queryRunner.query(
      `COMMENT ON COLUMN "terms"."year" IS '批准时间(年份),冗余字段便于查询'`
    );
    await queryRunner.query(`CREATE EXTENSION pg_trgm`);
    await queryRunner.query(`CREATE EXTENSION btree_gin`);
    await queryRunner.query(`CREATE INDEX "index_gin_name" ON "terms" USING gin (name)`);
    await queryRunner.query(`CREATE INDEX "index_gin_keyword" ON "terms" USING gin (keyword)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "terms"."year" IS '批准时间(年份),冗余字段便于查询'`
    );
    await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "year"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "index_gin_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "index_gin_keyword"`);
  }
}
