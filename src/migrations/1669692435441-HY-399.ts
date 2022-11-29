import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3991669692435441 implements MigrationInterface {
    name = 'HY3991669692435441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "institutions" ADD "sequence_number" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."sequence_number" IS '排序(这里c端使用该字段自主排序)'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."sequence_number" IS '排序(这里c端使用该字段自主排序)'`);
        await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "sequence_number"`);
    }

}
