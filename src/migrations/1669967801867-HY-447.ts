import { MigrationInterface, QueryRunner } from "typeorm";

export class HY4471669967801867 implements MigrationInterface {
    name = 'HY4471669967801867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "policies"."topic_type" IS '主题类型:["string"]'`);
        await queryRunner.query(`INSERT INTO "policy_types" ( "id", "name" )
        VALUES
            ( 'policy_type_008', '报告' ) ON CONFLICT ( "id" ) DO
        UPDATE 
            SET "name" = EXCLUDED."name";`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "policies"."topic_type" IS '主题类型'`);
    }

}
