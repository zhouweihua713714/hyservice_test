import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1351663827633686 implements MigrationInterface {
    name = 'HY1351663827633686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_label_treatises" DROP COLUMN "updated_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_label_treatises" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

}
