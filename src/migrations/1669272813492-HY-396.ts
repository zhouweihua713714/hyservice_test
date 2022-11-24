import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3961669272813492 implements MigrationInterface {
    name = 'HY3961669272813492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatise_library"."magazine_field" IS '杂志会议所属主领域'`);
        await queryRunner.query(`COMMENT ON COLUMN "treatise_library"."magazine_minor_field" IS '杂志会议所属子领域'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "treatise_library"."magazine_minor_field" IS '杂志文章子领域'`);
        await queryRunner.query(`COMMENT ON COLUMN "treatise_library"."magazine_field" IS '杂志文章主领域'`);
    }

}
