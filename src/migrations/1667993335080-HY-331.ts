import { MigrationInterface, QueryRunner } from "typeorm";

export class HY3311667993335080 implements MigrationInterface {
    name = 'HY3311667993335080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "america_term_keywords" ADD CONSTRAINT "FK_bbf4e37e1805ba7f32986c28628" FOREIGN KEY ("award_number") REFERENCES "america_terms"("award_number") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "america_term_keywords" DROP CONSTRAINT "FK_bbf4e37e1805ba7f32986c28628"`);
    }

}
