import { MigrationInterface, QueryRunner } from "typeorm"

export class seeds1659514378901 implements MigrationInterface {
    name = 'seeds1659514378901';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "term_types" ( "id", "name" )
                    VALUES
                        ( 'term_type_001', '地区科学基金项目' ),
                        ( 'term_type_002', '规划基金项目' ),
                        ( 'term_type_003', '国家青年' ),
                        ( 'term_type_004', '国家一般' ),
                        ( 'term_type_005', '国家重大' ),
                        ( 'term_type_006', '国家重点' ),
                        ( 'term_type_007', '国家重点(委托)' ),
                        ( 'term_type_008', '教育部青年' ),
                        ( 'term_type_009', '教育部重点' ),
                        ( 'term_type_010', '教育部专项' ),
                        ( 'term_type_011', '面上项目' ),
                        ( 'term_type_012', '青年基金项目' ),
                        ( 'term_type_013', '青年科学基金项目' ),
                        ( 'term_type_014', '西部项目' ),
                        ( 'term_type_015', '优秀青年基金项目' ),
                        ( 'term_type_016', '重点项目' ),
                        ( 'term_type_017', '自筹经费项目' ) ON CONFLICT ( "id" ) DO
                    UPDATE
                        SET "name" = EXCLUDED."name";`);
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
        await queryRunner.query(`INSERT INTO "subjects" ( "id", "name" )
                        VALUES
                            ( 'subject_00001', '交叉学科/综合研究' ),
                            ( 'subject_00002', '教育大数据分析与应用' ),
                            ( 'subject_00003', '教育机器人' ),
                            ( 'subject_00004', '教育认知工具' ),
                            ( 'subject_00005', '教育信息科学基础理论与方法' ),
                            ( 'subject_00006', '教育信息科学与技术' ),
                            ( 'subject_00007', '教育学' ),
                            ( 'subject_00008', '教育知识可视化' ),
                            ( 'subject_00009', '教育智能体' ),
                            ( 'subject_00010', '社会学' ),
                            ( 'subject_00011', '心理学' ),
                            ( 'subject_00012', '虚拟与增强现实学习环境' ),
                            ( 'subject_00013', '学习分析与评测' ),
                            ( 'subject_00014', '语言学' ),
                            ( 'subject_00015', '在线与移动交互学习环境构建' ),
                            ( 'subject_00016', '自适应个性化辅助学习' ) ON CONFLICT ( "id" ) DO
                        UPDATE
                            SET "name" = EXCLUDED."name";`);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "term_types"`);
        await queryRunner.query(`DELETE FROM "columns"`);
        await queryRunner.query(`DELETE FROM "subjects"`);
      }

}
