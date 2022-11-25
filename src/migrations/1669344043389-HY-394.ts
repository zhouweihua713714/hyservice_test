import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3941669344043389 implements MigrationInterface {
    name = 'HY3941669344043389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."clicks" IS '点击量'`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."clicks" IS '点击量'`);
        await queryRunner.query(`COMMENT ON COLUMN "analysis_policies"."clicks" IS '点击量'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."clicks" IS '点击量'`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."clicks" IS '点击量'`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."clicks" IS '点击量'`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."clicks" IS '点击量'`);
        await queryRunner.query(`COMMENT ON COLUMN "research_reports"."clicks" IS '点击量'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "column_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."clicks" IS '点击量'`);
        await queryRunner.query(`ALTER TABLE "treatise_library" ALTER COLUMN "column_id" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "treatise_library"."clicks" IS '点击量'`);
        await queryRunner.query(`COMMENT ON COLUMN "terms"."clicks" IS '点击量'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "terms"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`COMMENT ON COLUMN "treatise_library"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`ALTER TABLE "treatise_library" ALTER COLUMN "column_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "treatises"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`ALTER TABLE "treatises" ALTER COLUMN "column_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "research_reports"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`COMMENT ON COLUMN "patents"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`COMMENT ON COLUMN "institutions"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`COMMENT ON COLUMN "periodicals"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`COMMENT ON COLUMN "analysis_policies"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`COMMENT ON COLUMN "conferences"."clicks" IS '点击量,暂时不做'`);
        await queryRunner.query(`COMMENT ON COLUMN "america_terms"."clicks" IS '点击量,暂时不做'`);
    }

}
