import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3121667897534318 implements MigrationInterface {
    name = 'HY3121667897534318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "term_keywords" ADD "title" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`COMMENT ON COLUMN "term_keywords"."title" IS '标题'`);
        await queryRunner.query(`ALTER TABLE "treatise_keywords" ALTER COLUMN "title" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "term_keywords" ADD CONSTRAINT "FK_16c4b051b26de6a0e44ced820b0" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "treatise_keywords" ADD CONSTRAINT "FK_05e8e47224a995d7782e203c1a6" FOREIGN KEY ("treatise_id") REFERENCES "treatises"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatise_keywords" DROP CONSTRAINT "FK_05e8e47224a995d7782e203c1a6"`);
        await queryRunner.query(`ALTER TABLE "term_keywords" DROP CONSTRAINT "FK_16c4b051b26de6a0e44ced820b0"`);
        await queryRunner.query(`ALTER TABLE "treatise_keywords" ALTER COLUMN "title" SET DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "term_keywords"."title" IS '标题'`);
        await queryRunner.query(`ALTER TABLE "term_keywords" DROP COLUMN "title"`);
    }

}
