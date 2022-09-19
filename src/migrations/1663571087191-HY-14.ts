import { MigrationInterface, QueryRunner } from "typeorm";

export class HY141663571087191 implements MigrationInterface {
    name = 'HY141663571087191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorite_treatises" ("user_id" character varying(128) NOT NULL, "treatise_id" character varying(128) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_21744818456c68c56f2711d4133" PRIMARY KEY ("user_id", "treatise_id")); COMMENT ON COLUMN "user_favorite_treatises"."user_id" IS '用户id'; COMMENT ON COLUMN "user_favorite_treatises"."treatise_id" IS '论文id'; COMMENT ON COLUMN "user_favorite_treatises"."created_at" IS '创建时间'; COMMENT ON COLUMN "user_favorite_treatises"."updated_at" IS '更新时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_favorite_treatises_pkey" ON "user_favorite_treatises" ("user_id", "treatise_id") `);
        await queryRunner.query(`CREATE TABLE "user_label_treatises" ("user_id" character varying(128) NOT NULL, "treatise_id" character varying(128) NOT NULL, "label" character varying(128) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_254f5cf26fecfc95a919be53ea9" PRIMARY KEY ("user_id", "treatise_id")); COMMENT ON COLUMN "user_label_treatises"."user_id" IS '用户id'; COMMENT ON COLUMN "user_label_treatises"."treatise_id" IS '论文id'; COMMENT ON COLUMN "user_label_treatises"."label" IS '标签:label_001 强烈推荐,label_002 写得好,label_003 有深度,label_004 很实用'; COMMENT ON COLUMN "user_label_treatises"."created_at" IS '创建时间'; COMMENT ON COLUMN "user_label_treatises"."updated_at" IS '更新时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_label_treatises_pkey" ON "user_label_treatises" ("user_id", "treatise_id") `);
        await queryRunner.query(`ALTER TABLE "user_favorite_treatises" ADD CONSTRAINT "FK_5ac22a428a8539f6109456a164c" FOREIGN KEY ("treatise_id") REFERENCES "treatises"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_label_treatises" ADD CONSTRAINT "FK_63987a350cf49104338abb1a739" FOREIGN KEY ("treatise_id") REFERENCES "treatises"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_label_treatises" DROP CONSTRAINT "FK_63987a350cf49104338abb1a739"`);
        await queryRunner.query(`ALTER TABLE "user_favorite_treatises" DROP CONSTRAINT "FK_5ac22a428a8539f6109456a164c"`);
        await queryRunner.query(`DROP INDEX "public"."user_label_treatises_pkey"`);
        await queryRunner.query(`DROP TABLE "user_label_treatises"`);
        await queryRunner.query(`DROP INDEX "public"."user_favorite_treatises_pkey"`);
        await queryRunner.query(`DROP TABLE "user_favorite_treatises"`);
    }

}
