import {MigrationInterface, QueryRunner} from "typeorm";

export class init1655365798113 implements MigrationInterface {
    name = 'init1655365798113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "codes" ("mobile" text NOT NULL, "code" character varying(6) NOT NULL, "sent_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_55409b69c6fb865eb4fcd7f0fd5" PRIMARY KEY ("mobile"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "codes_pkey" ON "codes" ("mobile") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "codes_id_key" ON "codes" ("mobile") `);
        await queryRunner.query(`CREATE TABLE "files" ("id" text NOT NULL, "filename" text NOT NULL, "status" smallint NOT NULL DEFAULT 0, "oss_info" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "files_pkey" ON "files" ("id") `);
        await queryRunner.query(`CREATE TABLE "user_status" ("enum_id" text NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_10f54c9591042e60dd2f0cff485" PRIMARY KEY ("enum_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_status_pkey" ON "user_status" ("enum_id") `);
        await queryRunner.query(`CREATE TABLE "user_types" ("enum_id" text NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_d3010cbf9d5d7ec04345392a8ea" PRIMARY KEY ("enum_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_types_pkey" ON "user_types" ("enum_id") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" text NOT NULL, "mobile" character varying(11) NOT NULL, "name" character varying(20), "info" json NOT NULL DEFAULT '{}', "created_at" date NOT NULL DEFAULT now(), "gender" text, "status" text, "type" text, CONSTRAINT "UQ_d376a9f93bba651f32a2c03a7d3" UNIQUE ("mobile"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_mobile_key" ON "users" ("mobile") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_pkey" ON "users" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_id_key" ON "users" ("id") `);
        await queryRunner.query(`CREATE TABLE "gender_types" ("enum_id" text NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_53ac3fcddf85d7d8efdfdf99a49" PRIMARY KEY ("enum_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "gender_types_pkey" ON "gender_types" ("enum_id") `);
        await queryRunner.query(`CREATE TABLE "logins" ("mobile" character varying(11) NOT NULL, "token" character varying(255) NOT NULL, "provider" character varying(20) NOT NULL, CONSTRAINT "PK_bc46a2fa041e466f0869803f29a" PRIMARY KEY ("mobile", "provider"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "logins_pkey" ON "logins" ("mobile", "provider") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3b810c99fae8b4b46555c8bdfc9" FOREIGN KEY ("gender") REFERENCES "gender_types"("enum_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3676155292d72c67cd4e090514f" FOREIGN KEY ("status") REFERENCES "user_status"("enum_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_94e2000b5f7ee1f9c491f0f8a82" FOREIGN KEY ("type") REFERENCES "user_types"("enum_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_94e2000b5f7ee1f9c491f0f8a82"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3676155292d72c67cd4e090514f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3b810c99fae8b4b46555c8bdfc9"`);
        await queryRunner.query(`DROP INDEX "public"."logins_pkey"`);
        await queryRunner.query(`DROP TABLE "logins"`);
        await queryRunner.query(`DROP INDEX "public"."gender_types_pkey"`);
        await queryRunner.query(`DROP TABLE "gender_types"`);
        await queryRunner.query(`DROP INDEX "public"."users_id_key"`);
        await queryRunner.query(`DROP INDEX "public"."users_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."users_mobile_key"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."user_types_pkey"`);
        await queryRunner.query(`DROP TABLE "user_types"`);
        await queryRunner.query(`DROP INDEX "public"."user_status_pkey"`);
        await queryRunner.query(`DROP TABLE "user_status"`);
        await queryRunner.query(`DROP INDEX "public"."files_pkey"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "public"."codes_id_key"`);
        await queryRunner.query(`DROP INDEX "public"."codes_pkey"`);
        await queryRunner.query(`DROP TABLE "codes"`);
    }

}
