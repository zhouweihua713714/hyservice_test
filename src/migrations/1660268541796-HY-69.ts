import { MigrationInterface, QueryRunner } from 'typeorm';

export class HY691660268541796 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
         ( 'column_02_02', 'NSC教育类论文', 'column_02', 2, '0' ),
         ( 'column_02_03', 'SSCI期刊论文', 'column_02', 3, '0' ),
         ( 'column_02_04', 'LAK会议论文', 'column_02', 4, '0' ),
         ( 'column_02_05', 'EDM会议论文', 'column_02', 5, '0' ),
         ( 'column_02_06', 'ijAIED国际人工智能教育杂志', 'column_02', 6, '0' ),
         ( 'column_02_07', 'AIED会议论文', 'column_02', 7, '0' ),
         ( 'column_02_08', 'ITS会议论文', 'column_02', 8, '0' ),
         ( 'column_02_09', 'ICLS学习科学国际会议', 'column_02', 9, '0' ),
         ( 'column_02_10', 'JLS学习科学杂志', 'column_02', 10, '0' ),
         ( 'column_02_11', '认知与指导', 'column_02', 11, '0' ),
         ( 'column_02_12', '教学指导', 'column_02', 12, '0' ),
         ( 'column_02_13', 'CSCL计算机协作学习国际会议', 'column_02', 13, '0' ),
         ( 'column_02_14', 'ijCSCL国际计算机支持协作学习杂志', 'column_02', 14, '0' ),
         ( 'column_02_15', '心智、脑与教育', 'column_02', 15, '0' ),
         ( 'column_02_16', '教育生物学', 'column_02', 16, '0' ),
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
}
