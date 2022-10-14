import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1631665716828950 implements MigrationInterface {
    name = 'HY1631665716828950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."keywords_pkey"`);
        await queryRunner.query(`ALTER TABLE "keywords" DROP CONSTRAINT "PK_2b14d429b4ec7cfe3a2bc5a4a0e"`);
        await queryRunner.query(`ALTER TABLE "keywords" ADD CONSTRAINT "PK_5f1f83efb667d98cc74acbed850" PRIMARY KEY ("type")`);
        await queryRunner.query(`ALTER TABLE "keywords" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "keywords" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "keywords" DROP CONSTRAINT "PK_5f1f83efb667d98cc74acbed850"`);
        await queryRunner.query(`ALTER TABLE "keywords" ADD CONSTRAINT "PK_2b14d429b4ec7cfe3a2bc5a4a0e" PRIMARY KEY ("type", "name")`);
        await queryRunner.query(`COMMENT ON COLUMN "keywords"."name" IS '名称'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "keywords_pkey" ON "keywords" ("name", "type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."keywords_pkey"`);
        await queryRunner.query(`COMMENT ON COLUMN "keywords"."name" IS '名称'`);
        await queryRunner.query(`ALTER TABLE "keywords" DROP CONSTRAINT "PK_2b14d429b4ec7cfe3a2bc5a4a0e"`);
        await queryRunner.query(`ALTER TABLE "keywords" ADD CONSTRAINT "PK_5f1f83efb667d98cc74acbed850" PRIMARY KEY ("type")`);
        await queryRunner.query(`ALTER TABLE "keywords" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "keywords" ADD "name" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "keywords" DROP CONSTRAINT "PK_5f1f83efb667d98cc74acbed850"`);
        await queryRunner.query(`ALTER TABLE "keywords" ADD CONSTRAINT "PK_2b14d429b4ec7cfe3a2bc5a4a0e" PRIMARY KEY ("name", "type")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "keywords_pkey" ON "keywords" ("name", "type") `);
    }

}
