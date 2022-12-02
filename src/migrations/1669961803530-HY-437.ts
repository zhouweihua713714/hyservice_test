import { MigrationInterface, QueryRunner } from "typeorm";

export class HY4371669961803530 implements MigrationInterface {
    name = 'HY4371669961803530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "topic_type"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "topic_type" jsonb`);
        await queryRunner.query(`COMMENT ON COLUMN "policies"."topic_type" IS '主题类型'`);
        // topic_types
        await queryRunner.query(`INSERT INTO "topic_types" ( "id", "name")
        VALUES
               ( 'topic_type_008', '家庭教育' ), 
               ( 'topic_type_009', '教育管理' ),
               ( 'topic_type_010', '教育信息化' ), 
               ( 'topic_type_011', '科普'), 
               ( 'topic_type_012', '人才培养'), 
               ( 'topic_type_013', '新课标' ) ON CONFLICT ( "id" ) DO
                UPDATE
               SET "name" = EXCLUDED."name";
               `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "policies"."topic_type" IS '主题类型'`);
        await queryRunner.query(`ALTER TABLE "policies" DROP COLUMN "topic_type"`);
        await queryRunner.query(`ALTER TABLE "policies" ADD "topic_type" character varying(64)`);
    }

}
