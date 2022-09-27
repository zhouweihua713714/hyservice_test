import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1551664239283953 implements MigrationInterface {
    name = 'HY1551664239283953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."index_gin_treatise_abstract"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "index_gin_treatise_abstract" ON "treatises" ("abstract") `);
    }

}
