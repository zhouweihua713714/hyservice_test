import { MigrationInterface, QueryRunner } from "typeorm";

export class HY681660016296651 implements MigrationInterface {
    name = 'HY681660016296651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "money"`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "money" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "terms"."money" IS '金额(万元)'`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "ipc" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "ownership" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "bottom_description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "links" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "logo" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "logo" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "links" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "bottom_description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "ownership" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "ipc" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "website" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "terms"."money" IS '金额(万元)'`);
        await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "money"`);
        await queryRunner.query(`ALTER TABLE "terms" ADD "money" numeric(10,2)`);
    }

}
