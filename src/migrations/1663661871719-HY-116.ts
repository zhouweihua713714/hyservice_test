import { MigrationInterface, QueryRunner } from "typeorm";

export class HY1161663661871719 implements MigrationInterface {
    name = 'HY1161663661871719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_note_treatises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(128) NOT NULL, "treatise_id" character varying(128) NOT NULL, "content" text NOT NULL, "comment" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "commented_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8865e5fbb426bd31cb45bbe1d75" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_note_treatises"."user_id" IS '用户id'; COMMENT ON COLUMN "user_note_treatises"."treatise_id" IS '论文id'; COMMENT ON COLUMN "user_note_treatises"."content" IS '笔记内容'; COMMENT ON COLUMN "user_note_treatises"."comment" IS '评论'; COMMENT ON COLUMN "user_note_treatises"."created_at" IS '创建时间'; COMMENT ON COLUMN "user_note_treatises"."updated_at" IS '更新时间'; COMMENT ON COLUMN "user_note_treatises"."commented_at" IS '评论时间'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_note_treatises_pkey" ON "user_note_treatises" ("id") `);
        await queryRunner.query(`ALTER TABLE "user_note_treatises" ADD CONSTRAINT "FK_809546ffc1931eb2b695c18d402" FOREIGN KEY ("treatise_id") REFERENCES "treatises"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_note_treatises" DROP CONSTRAINT "FK_809546ffc1931eb2b695c18d402"`);
        await queryRunner.query(`DROP INDEX "public"."user_note_treatises_pkey"`);
        await queryRunner.query(`DROP TABLE "user_note_treatises"`);
    }

}
