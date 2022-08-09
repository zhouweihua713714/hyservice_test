import { MigrationInterface, QueryRunner } from 'typeorm';

export class HY161660033448702 implements MigrationInterface {
  name = 'HY161660033448702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "america_terms" ADD "owner_id" character varying(128)`);
    await queryRunner.query(`COMMENT ON COLUMN "america_terms"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "columns" DROP COLUMN "sequence_number"`);
    await queryRunner.query(`ALTER TABLE "columns" ADD "sequence_number" integer`);
    await queryRunner.query(`COMMENT ON COLUMN "columns"."sequence_number" IS '排序'`);
    await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "conferences" ADD "owner_id" character varying(128)`);
    await queryRunner.query(`COMMENT ON COLUMN "conferences"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "institutions" ADD "owner_id" character varying(128)`);
    await queryRunner.query(`COMMENT ON COLUMN "institutions"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "patents" ADD "owner_id" character varying(128)`);
    await queryRunner.query(`COMMENT ON COLUMN "patents"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "policies" ADD "owner_id" character varying(128)`);
    await queryRunner.query(`COMMENT ON COLUMN "policies"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "terms" ADD "owner_id" character varying(128)`);
    await queryRunner.query(`COMMENT ON COLUMN "terms"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "periodicals" ADD "owner_id" character varying(128)`);
    await queryRunner.query(`COMMENT ON COLUMN "periodicals"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "treatises" ADD "owner_id" character varying(128)`);
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."owner_id" IS '录入人id'`);
    //栏目数据
    await queryRunner.query(`INSERT INTO "columns" ( "id", "name", "parent_id", "sequence_number", "is_hide" )
    VALUES
        ( 'column_01', '项目', '0', 1, '0' ),
        ( 'column_01_01', '国家社会科学基金项目', 'column_01', 1, '0' ),
        ( 'column_01_02', '教育部人文社科项目', 'column_01', 2, '0' ),
        ( 'column_01_03', '国家自然科学基金项目(F0701)', 'column_01', 3, '0' ),
        ( 'column_01_04', '美国国家科学基金项目', 'column_01', 4, '0' ),
        ( 'column_02', '论文', '0', 2, '0' ),
        ( 'column_02_01', 'CSSCI期刊', 'column_02', 1, '0' ),
        ( 'column_02_02', 'NSC教育论文', 'column_02', 2, '0' ),
        ( 'column_02_03', 'SSCI期刊论文', 'column_02', 3, '0' ),
        ( 'column_02_04', '信息科学与教育交叉研究论文', 'column_02', 4, '0' ),
        ( 'column_02_05', '社会学与教育交叉研究论文', 'column_02', 5, '0' ),
        ( 'column_02_06', '心理学与教育交叉研究论文', 'column_02', 6, '0' ),
        ( 'column_02_07', '脑科学与教育交叉论文', 'column_02', 7, '0' ),
        ( 'column_02_08', 'EDM会议论文', 'column_02', 8, '0' ),
        ( 'column_02_09', 'LAK会议论文', 'column_02', 9, '0' ),
        ( 'column_02_10', 'ITS会议论文', 'column_02', 10, '0' ),
        ( 'column_02_11', 'AIED会议论文', 'column_02', 11, '0' ),
        ( 'column_03', '期刊', '0', 3, '0' ),
        ( 'column_03_01', 'CSSCI期刊', 'column_03', 1, '0' ),
        ( 'column_03_02', 'SSCI期刊', 'column_03', 2, '0' ),
        ( 'column_04', '政策', '0', 4, '0' ),
        ( 'column_04_01', '热点政策', 'column_04', 1, '0' ),
        ( 'column_04_02', '全部政策', 'column_04', 2, '0' ),
        ( 'column_05', '专利', '0', 5, '0' ),
        ( 'column_05_01', '全部专利', 'column_05', 1, '0' ),
        ( 'column_06', '会议', '0', 6, '0' ),
        ( 'column_06_01', '全部会议', 'column_06', 1, '0' ),
        ( 'column_07', '机构', '0', 7, '0' ),
        ( 'column_07_01', '全部机构', 'column_07', 1, '0' ) ON CONFLICT ( "id" ) DO
    UPDATE
        SET "name" = EXCLUDED."name",
        "parent_id" = EXCLUDED."parent_id",
        "sequence_number" = EXCLUDED."sequence_number",
        "is_hide" = EXCLUDED."is_hide";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "treatises"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "treatises" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "treatises" ADD "owner_id" character varying(20)`);
    await queryRunner.query(`COMMENT ON COLUMN "periodicals"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "periodicals" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "periodicals" ADD "owner_id" character varying(20)`);
    await queryRunner.query(`COMMENT ON COLUMN "terms"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "terms" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "terms" ADD "owner_id" character varying(20)`);
    await queryRunner.query(`COMMENT ON COLUMN "policies"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "policies" ADD "owner_id" character varying(20)`);
    await queryRunner.query(`COMMENT ON COLUMN "patents"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "patents" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "patents" ADD "owner_id" character varying(20)`);
    await queryRunner.query(`COMMENT ON COLUMN "institutions"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "institutions" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "institutions" ADD "owner_id" character varying(20)`);
    await queryRunner.query(`COMMENT ON COLUMN "conferences"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "conferences" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "conferences" ADD "owner_id" character varying(20)`);
    await queryRunner.query(`COMMENT ON COLUMN "columns"."sequence_number" IS '排序'`);
    await queryRunner.query(`ALTER TABLE "columns" DROP COLUMN "sequence_number"`);
    await queryRunner.query(
      `ALTER TABLE "columns" ADD "sequence_number" character varying(64)`
    );
    await queryRunner.query(`COMMENT ON COLUMN "america_terms"."owner_id" IS '录入人id'`);
    await queryRunner.query(`ALTER TABLE "america_terms" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "america_terms" ADD "owner_id" character varying(20)`);
    //栏目数据
    await queryRunner.query(`INSERT INTO "columns" ( "id", "name", "parent_id", "sequence_number", "is_hide" )
        VALUES
            ( 'column_01', '项目', '0', '1', '0' ),
            ( 'column_01_01', '国家社会科学基金项目', 'column_01', '1', '0' ),
            ( 'column_01_02', '教育部人文社科项目', 'column_01', '2', '0' ),
            ( 'column_01_03', '国家自然科学基金项目(F0701)', 'column_01', '3', '0' ),
            ( 'column_01_04', '美国国家科学基金项目', 'column_01', '4', '0' ),
            ( 'column_02', '论文', '0', '2', '0' ),
            ( 'column_02_01', 'CSSCI期刊', 'column_02', '1', '0' ),
            ( 'column_02_02', 'NSC教育论文', 'column_02', '2', '0' ),
            ( 'column_02_03', 'SSCI期刊论文', 'column_02', '3', '0' ),
            ( 'column_02_04', '信息科学与教育交叉研究论文', 'column_02', '4', '0' ),
            ( 'column_02_05', '社会学与教育交叉研究论文', 'column_02', '5', '0' ),
            ( 'column_02_06', '心理学与教育交叉研究论文', 'column_02', '6', '0' ),
            ( 'column_02_07', '脑科学与教育交叉论文', 'column_02', '7', '0' ),
            ( 'column_02_08', 'EDM会议论文', 'column_02', '8', '0' ),
            ( 'column_02_09', 'LAK会议论文', 'column_02', '9', '0' ),
            ( 'column_02_10', 'ITS会议论文', 'column_02', '10', '0' ),
            ( 'column_02_11', 'AIED会议论文', 'column_02', '11', '0' ),
            ( 'column_03', '期刊', '0', '3', '0' ),
            ( 'column_03_01', 'CSSCI期刊', 'column_03', '1', '0' ),
            ( 'column_03_02', 'SSCI期刊', 'column_03', '2', '0' ),
            ( 'column_04', '政策', '0', '4', '0' ),
            ( 'column_04_01', '热点政策', 'column_04', '1', '0' ),
            ( 'column_04_02', '全部政策', 'column_04', '2', '0' ),
            ( 'column_05', '专利', '0', '5', '0' ),
            ( 'column_05_01', '全部专利', 'column_05', '1', '0' ),
            ( 'column_06', '会议', '0', '6', '0' ),
            ( 'column_06_01', '全部会议', 'column_06', '1', '0' ),
            ( 'column_07', '机构', '0', '7', '0' ),
            ( 'column_07_01', '全部机构', 'column_07', '1', '0' ) ON CONFLICT ( "id" ) DO
        UPDATE
            SET "name" = EXCLUDED."name",
            "parent_id" = EXCLUDED."parent_id",
            "sequence_number" = EXCLUDED."sequence_number",
            "is_hide" = EXCLUDED."is_hide";
        `);
  }
}
