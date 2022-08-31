import { MigrationInterface, QueryRunner } from 'typeorm';

export class seeds1659928224903 implements MigrationInterface {
  name = 'seeds1659928224903';
  public async up(queryRunner: QueryRunner): Promise<void> {
    //项目类型
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
    //学科分类
    await queryRunner.query(`INSERT INTO "subjects" ( "id", "name", "type" )
                            VALUES
                                ( 'subject_00001', '交叉学科/综合研究', 'term' ),
                                ( 'subject_00002', '教育大数据分析与应用', 'term' ),
                                ( 'subject_00003', '教育机器人', 'term' ),
                                ( 'subject_00004', '教育认知工具', 'term' ),
                                ( 'subject_00005', '教育信息科学基础理论与方法', 'term' ),
                                ( 'subject_00006', '教育信息科学与技术', 'term' ),
                                ( 'subject_00007', '教育学', 'term' ),
                                ( 'subject_00008', '教育知识可视化', 'term' ),
                                ( 'subject_00009', '教育智能体', 'term' ),
                                ( 'subject_00010', '社会学', 'term' ),
                                ( 'subject_00011', '心理学', 'term' ),
                                ( 'subject_00012', '虚拟与增强现实学习环境', 'term' ),
                                ( 'subject_00013', '学习分析与评测', 'term' ),
                                ( 'subject_00014', '语言学', 'term' ),
                                ( 'subject_00015', '在线与移动交互学习环境构建', 'term' ),
                                ( 'subject_00016', '自适应个性化辅助学习', 'term' ),
                                ( 'subject_00017', '高等教育', 'periodical' ), 
                                ( 'subject_00018', '教育', 'periodical' ),
                                ( 'subject_00019', '教育科学', 'periodical' ) ON CONFLICT ( "id" ) DO
                            UPDATE
                                SET "name" = EXCLUDED."name",
                                "type" = EXCLUDED."type";`);
    // 期刊周期
    await queryRunner.query(`INSERT INTO "periodical_periods" ( "id", "name" )
                                VALUES
                                    ( 'cycle_01', '半年刊' ),
                                    ( 'cycle_02', '半月刊' ),
                                    ( 'cycle_03', '季刊' ),
                                    ( 'cycle_04', '年刊' ),
                                    ( 'cycle_05', '三年1期' ),
                                    ( 'cycle_06', '双月刊' ),
                                    ( 'cycle_07', '月刊' ),
                                    ( 'cycle_08', '一年1期' ),
                                    ( 'cycle_09', '一年2期' ),
                                    ( 'cycle_10', '一年3期' ),
                                    ( 'cycle_11', '一年4期' ),
                                    ( 'cycle_12', '一年5期' ),
                                    ( 'cycle_13', '一年6期' ),
                                    ( 'cycle_14', '一年7期' ),
                                    ( 'cycle_15', '一年8期' ),
                                    ( 'cycle_16', '一年9期' ),
                                    ( 'cycle_17', '一年10期' ),
                                    ( 'cycle_18', '一年12期' ),
                                    ( 'cycle_19', '一年14期' ),
                                    ( 'cycle_20', '一年18期' ) ON CONFLICT ( "id" ) DO
                                UPDATE 
                                    SET "name" = EXCLUDED."name"`);
    //语种
    await queryRunner.query(`INSERT INTO "languages" ( "id", "name", "type" )
                                VALUES
                                    ( 'language_chinese', '中文', 'treatise_periodical' ),
                                    ( 'language_english', '英语', 'treatise_periodical' ),
                                    ( 'language_german ', '德语', 'periodical' ),
                                    ( 'language_spanish', '西班牙语', 'periodical' ),
                                    ( 'language_french', '法语', 'periodical' ),
                                    ( 'language_portuguese', '葡萄牙语', 'periodical' ),
                                    ( 'language_english_01', 'English', 'treatise_ssci' ),
                                    ( 'language_spanish_01', 'Spanish', 'treatise_ssci' ),
                                    ( 'language_estonian_01', 'Estonian', 'treatise_ssci' ) ON CONFLICT ( "id" ) DO
                                UPDATE 
                                    SET "name" = EXCLUDED."name",
                                    "type" = EXCLUDED."type";`);
    //领域数据
    await queryRunner.query(`INSERT INTO "fields" ( "id", "name", "type", "is_main" )
                                VALUES
                                    ( 'big_field_001', '教育', 'institution_conference', '1' ),
                                    ( 'big_field_002', '计算机', 'institution_conference', '1' ),
                                    ( 'big_field_003', '科学', 'institution_conference', '1' ),
                                    ( 'big_field_004', '文化', 'institution_conference', '1' ),
                                    ( 'big_field_005', '人工智能', 'institution_conference', '1' ),
                                    ( 'big_field_006', '神经科学', 'institution_conference', '1' ),
                                    ( 'big_field_007', '哲学', 'institution_conference', '1' ),
                                    ( 'big_field_008', '社会学', 'institution_conference', '1' ),
                                    ( 'small_field_0001', '感官动力学习', 'institution_conference', '0' ),
                                    ( 'small_field_0002', '高等教育', 'institution_conference', '0' ),
                                    ( 'small_field_0003', '互联网教育', 'institution_conference', '0' ),
                                    ( 'small_field_0004', '基于认知过程与学习', 'institution_conference', '0' ),
                                    ( 'small_field_0005', '计算表示', 'institution_conference', '0' ),
                                    ( 'small_field_0006', '计算机教育', 'institution_conference', '0' ),
                                    ( 'small_field_0007', '计算教育', 'institution_conference', '0' ),
                                    ( 'small_field_0008', '技术增强学习', 'institution_conference', '0' ),
                                    ( 'small_field_0009', '技术职业教育', 'institution_conference', '0' ),
                                    ( 'small_field_0010', '交互式自适应学习', 'institution_conference', '0' ),
                                    ( 'small_field_0011', '教学技术', 'institution_conference', '0' ),
                                    ( 'small_field_0012', '教学设计', 'institution_conference', '0' ),
                                    ( 'small_field_0013', '教育大数据', 'institution_conference', '0' ),
                                    ( 'small_field_0014', '教育技术', 'institution_conference', '0' ),
                                    ( 'small_field_0015', '教育社会科学', 'institution_conference', '0' ),
                                    ( 'small_field_0016', '教育数据挖掘', 'institution_conference', '0' ),
                                    ( 'small_field_0017', '教育信息化', 'institution_conference', '0' ),
                                    ( 'small_field_0018', '空间学习', 'institution_conference', '0' ),
                                    ( 'small_field_0019', '人工智能', 'institution_conference', '0' ),
                                    ( 'small_field_0020', '人工智能教育应用', 'institution_conference', '0' ),
                                    ( 'small_field_0021', '认知学习', 'institution_conference', '0' ),
                                    ( 'small_field_0022', '视觉感知与再认', 'institution_conference', '0' ),
                                    ( 'small_field_0023', '视觉学习', 'institution_conference', '0' ),
                                    ( 'small_field_0024', '视觉语言', 'institution_conference', '0' ),
                                    ( 'small_field_0025', '数学化学习', 'institution_conference', '0' ),
                                    ( 'small_field_0026', '心理发展与脑发育', 'institution_conference', '0' ),
                                    ( 'small_field_0027', '信息', 'institution_conference', '0' ),
                                    ( 'small_field_0028', '学习分析', 'institution_conference', '0' ),
                                    ( 'small_field_0029', '学习科学', 'institution_conference', '0' ),
                                    ( 'small_field_0030', '学习迁移', 'institution_conference', '0' ),
                                    ( 'small_field_0031', '语言认知', 'institution_conference', '0' ),
                                    ( 'small_field_0032', '在线学习', 'institution_conference', '0' ),
                                    ( 'small_field_0033', '战略规划', 'institution_conference', '0' ),
                                    ( 'small_field_0034', '智能辅导系统', 'institution_conference', '0' ) ON CONFLICT ( "id" ) DO
                                UPDATE 
                                    SET "name" = EXCLUDED."name",
                                    "type" = EXCLUDED."type",
                                    "is_main" = EXCLUDED."is_main";`);
    //专利类型
    await queryRunner.query(`INSERT INTO "patent_types" ( "id", "name" )
                                    VALUES
                                        ( 'patent_type_001', '发明申请' ),
                                        ( 'patent_type_002', '发明授权' ),
                                        ( 'patent_type_003', '检索报告' ),
                                        ( 'patent_type_004', '其他' ),
                                        ( 'patent_type_005', '实用新型' ),
                                        ( 'patent_type_006', '外观设计' ) ON CONFLICT ( "id" ) DO
                                    UPDATE 
                                        SET "name" = EXCLUDED."name";`);
    //专利有效性
    await queryRunner.query(`INSERT INTO "patent_valid_types" ( "id", "name" )
                                    VALUES
                                        ( 'patent_validity_001', 'PCT-有效期满' ),
                                        ( 'patent_validity_002', 'PCT-有效期内' ),
                                        ( 'patent_validity_003', '驳回' ),
                                        ( 'patent_validity_004', '部分进入指定国家' ),
                                        ( 'patent_validity_005', '部分专利在指定国家失效' ),
                                        ( 'patent_validity_006', '撤回' ),
                                        ( 'patent_validity_007', '放弃' ),
                                        ( 'patent_validity_008', '公开' ),
                                        ( 'patent_validity_009', '审中' ),
                                        ( 'patent_validity_010', '失效' ),
                                        ( 'patent_validity_011', '实质审查' ),
                                        ( 'patent_validity_012', '授权' ),
                                        ( 'patent_validity_013', '授权后放弃' ),
                                        ( 'patent_validity_014', '授权后失效' ),
                                        ( 'patent_validity_015', '未缴年费' ),
                                        ( 'patent_validity_016', '未确认' ),
                                        ( 'patent_validity_017', '未授权放弃' ),
                                        ( 'patent_validity_018', '未授权失效' ),
                                        ( 'patent_validity_019', '有效' ),
                                        ( 'patent_validity_020', '暂缺' ) ON CONFLICT ( "id" ) DO
                                    UPDATE 
                                        SET "name" = EXCLUDED."name";`);
    //政策类型
    await queryRunner.query(`INSERT INTO "policy_types" ( "id", "name" )
                                        VALUES
                                            ( 'policy_type_001', '国家计划' ),
                                            ( 'policy_type_002', '计划' ),
                                            ( 'policy_type_003', '文件' ),
                                            ( 'policy_type_004', '项目征集' ),
                                            ( 'policy_type_005', '战略报告' ),
                                            ( 'policy_type_006', '政策报告' ),
                                            ( 'policy_type_007', '政策文件' ) ON CONFLICT ( "id" ) DO
                                        UPDATE 
                                            SET "name" = EXCLUDED."name";`);
    //文章类型
    await queryRunner.query(`INSERT INTO "article_types" ( "id", "name", "type" )
                                    VALUES
                                        ( 'article_type_00001', '研究型', 'treatise' ),
                                        ( 'article_type_00002', '综述型', 'treatise' ),
                                        ( 'article_type_00003', '描述型', 'treatise' ),
                                        ( 'article_type_00004', '新闻型', 'treatise' ),
                                        ( 'article_type_00005', '其他', 'treatise' ),
                                        ( 'article_type_00006', '观点型与社论', 'treatise' ),
                                        ( 'article_type_00007', '50th Anniversary Article', 'treatise_ssci' ),
                                        ( 'article_type_00008', 'Article', 'treatise_ssci' ),
                                        ( 'article_type_00009', 'Biographical-Item', 'treatise_ssci' ),
                                        ( 'article_type_00010', 'Book Review', 'treatise_ssci' ),
                                        ( 'article_type_00011', 'Case Reports', 'treatise_ssci' ),
                                        ( 'article_type_00012', 'Correction', 'treatise_ssci' ),
                                        ( 'article_type_00013', 'Corrigenda', 'treatise_ssci' ),
                                        ( 'article_type_00014', 'Cultural and Regional Perspectives', 'treatise_ssci' ),
                                        ( 'article_type_00015', 'Development Article', 'treatise_ssci' ),
                                        ( 'article_type_00016', 'Early Access', 'treatise_ssci' ),
                                        ( 'article_type_00017', 'Editorial', 'treatise_ssci' ),
                                        ( 'article_type_00018', 'Editorial Material', 'treatise_ssci' ),
                                        ( 'article_type_00019', 'Errata', 'treatise_ssci' ),
                                        ( 'article_type_00020', 'Featured Papers', 'treatise_ssci' ),
                                        ( 'article_type_00021', 'Guest Editorial', 'treatise_ssci' ),
                                        ( 'article_type_00022', 'Hardware Review', 'treatise_ssci' ),
                                        ( 'article_type_00023', 'Letter', 'treatise_ssci' ),
                                        ( 'article_type_00024', 'Miscellany', 'treatise_ssci' ),
                                        ( 'article_type_00025', 'Mobile Learning Article', 'treatise_ssci' ),
                                        ( 'article_type_00026', 'News Item', 'treatise_ssci' ),
                                        ( 'article_type_00027', 'Note', 'treatise_ssci' ),
                                        ( 'article_type_00028', 'Open Access', 'treatise_ssci' ),
                                        ( 'article_type_00029', 'Original Article', 'treatise_ssci' ),
                                        ( 'article_type_00030', 'Original Manuscript', 'treatise_ssci' ),
                                        ( 'article_type_00031', 'Other', 'treatise_ssci' ),
                                        ( 'article_type_00032', 'Other Article', 'treatise_ssci' ),
                                        ( 'article_type_00033', 'Proceedings Paper', 'treatise_ssci' ),
                                        ( 'article_type_00034', 'Published: 01 July 2020', 'treatise_ssci' ),
                                        ( 'article_type_00035', 'Published: 06 October 2020', 'treatise_ssci' ),
                                        ( 'article_type_00036', 'Published: 13 July 2020', 'treatise_ssci' ),
                                        ( 'article_type_00037', 'Published: 14 April 2020', 'treatise_ssci' ),
                                        ( 'article_type_00038', 'Published: 14 February 2020', 'treatise_ssci' ),
                                        ( 'article_type_00039', 'Published: 14 July 2020', 'treatise_ssci' ),
                                        ( 'article_type_00040', 'Published: 15 June 2020', 'treatise_ssci' ),
                                        ( 'article_type_00041', 'Published: 16 June 2020', 'treatise_ssci' ),
                                        ( 'article_type_00042', 'Published: 17 June 2020', 'treatise_ssci' ),
                                        ( 'article_type_00043', 'Published: 18 June 2020', 'treatise_ssci' ),
                                        ( 'article_type_00044', 'Published: 20 July 2020', 'treatise_ssci' ),
                                        ( 'article_type_00045', 'Published: 21 January 2020', 'treatise_ssci' ),
                                        ( 'article_type_00046', 'Published: 22 June 2020', 'treatise_ssci' ),
                                        ( 'article_type_00047', 'Published: 23 July 2020', 'treatise_ssci' ),
                                        ( 'article_type_00048', 'Published: 25 June 2020', 'treatise_ssci' ),
                                        ( 'article_type_00049', 'Published: 26 July 2020', 'treatise_ssci' ),
                                        ( 'article_type_00050', 'Published: 26 March 2020', 'treatise_ssci' ),
                                        ( 'article_type_00051', 'Published: 27 July 2020', 'treatise_ssci' ),
                                        ( 'article_type_00052', 'Reflection', 'treatise_ssci' ),
                                        ( 'article_type_00053', 'Reports and Reviews', 'treatise_ssci' ),
                                        ( 'article_type_00054', 'Reprint', 'treatise_ssci' ),
                                        ( 'article_type_00055', 'Research', 'treatise_ssci' ),
                                        ( 'article_type_00056', 'Research Article', 'treatise_ssci' ),
                                        ( 'article_type_00057', 'Research Section', 'treatise_ssci' ),
                                        ( 'article_type_00058', 'Retractions', 'treatise_ssci' ),
                                        ( 'article_type_00059', 'Review', 'treatise_ssci' ),
                                        ( 'article_type_00060', 'Software Review', 'treatise_ssci' ),
                                        ( 'article_type_00061', 'Special Interests', 'treatise_ssci' ) ON CONFLICT ( "id" ) DO
                                    UPDATE 
                                        SET "name" = EXCLUDED."name",
                                        "type" = EXCLUDED."type";`);
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
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "term_types"`);
    await queryRunner.query(`DELETE FROM "columns"`);
    await queryRunner.query(`DELETE FROM "subjects"`);
    await queryRunner.query(`DELETE FROM "periodical_periods"`);
    await queryRunner.query(`DELETE FROM "languages"`);
    await queryRunner.query(`DELETE FROM "fields"`);
    await queryRunner.query(`DELETE FROM "patent_types"`);
    await queryRunner.query(`DELETE FROM "patent_valid_types"`);
    await queryRunner.query(`DELETE FROM "policy_types"`);
    await queryRunner.query(`DELETE FROM "article_types"`);
  }
}
