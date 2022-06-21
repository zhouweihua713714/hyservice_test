import {MigrationInterface, QueryRunner} from "typeorm";

export class init1655776948453 implements MigrationInterface {
    name = 'init1655776948453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "codes" ("mobile" text NOT NULL, "code" character varying(6) NOT NULL, "sent_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_55409b69c6fb865eb4fcd7f0fd5" PRIMARY KEY ("mobile"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "codes_pkey" ON "codes" ("mobile") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "codes_id_key" ON "codes" ("mobile") `);
        await queryRunner.query(`CREATE TABLE "files" ("id" text NOT NULL DEFAULT uuid_generate_v4(), "filename" text NOT NULL, "status" smallint NOT NULL DEFAULT 0, "oss_info" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "files_pkey" ON "files" ("id") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" text NOT NULL DEFAULT uuid_generate_v4(), "mobile" character varying(11) NOT NULL, "name" character varying(20), "info" json NOT NULL DEFAULT '{}', "created_at" date NOT NULL DEFAULT now(), "gender" character varying(10) NOT NULL DEFAULT 'unknown', "status" character varying(10) NOT NULL DEFAULT 'enabled', CONSTRAINT "UQ_d376a9f93bba651f32a2c03a7d3" UNIQUE ("mobile"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."id" IS '主键id'; COMMENT ON COLUMN "users"."mobile" IS '手机号码'; COMMENT ON COLUMN "users"."name" IS '姓名'; COMMENT ON COLUMN "users"."info" IS '用户拓展信息'; COMMENT ON COLUMN "users"."created_at" IS '创建时间'; COMMENT ON COLUMN "users"."gender" IS '性别:男:male,女:female,未知:unknown'; COMMENT ON COLUMN "users"."status" IS '是否有效:enabled,disabled 无效'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_mobile_key" ON "users" ("mobile") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_pkey" ON "users" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_id_key" ON "users" ("id") `);
        await queryRunner.query(`CREATE TABLE "logins" ("mobile" character varying(11) NOT NULL, "token" character varying(255) NOT NULL, "provider" character varying(20) NOT NULL, CONSTRAINT "PK_bc46a2fa041e466f0869803f29a" PRIMARY KEY ("mobile", "provider")); COMMENT ON COLUMN "logins"."mobile" IS '手机号码'; COMMENT ON COLUMN "logins"."token" IS '密码'; COMMENT ON COLUMN "logins"."provider" IS '来源'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "logins_pkey" ON "logins" ("mobile", "provider") `);
        await queryRunner.query(`ALTER TABLE "logins" ADD CONSTRAINT "FK_625eaaca336f666b4f606567c56" FOREIGN KEY ("mobile") REFERENCES "users"("mobile") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logins" DROP CONSTRAINT "FK_625eaaca336f666b4f606567c56"`);
        await queryRunner.query(`DROP INDEX "public"."logins_pkey"`);
        await queryRunner.query(`DROP TABLE "logins"`);
        await queryRunner.query(`DROP INDEX "public"."users_id_key"`);
        await queryRunner.query(`DROP INDEX "public"."users_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."users_mobile_key"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."files_pkey"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "public"."codes_id_key"`);
        await queryRunner.query(`DROP INDEX "public"."codes_pkey"`);
        await queryRunner.query(`DROP TABLE "codes"`);
    }

}
