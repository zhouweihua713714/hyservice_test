import { MigrationInterface, QueryRunner } from 'typeorm';

export class HY1311664504462247 implements MigrationInterface {
  name = 'HY1311664504462247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conferences" ALTER COLUMN "delivery_ended_at" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "conferences" ALTER COLUMN "preregister_ended_at" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "conferences" ALTER COLUMN "register_ended_at" DROP DEFAULT`
    );
    //语种
    await queryRunner.query(`INSERT INTO "languages" ( "id", "name", "type" )
    VALUES
        ( 'language_english_01', 'English', 'treatise_periodical' ),
        ( 'language_dutch', '荷兰语', 'periodical' ) ON CONFLICT ( "id" ) DO
    UPDATE 
        SET "name" = EXCLUDED."name",
        "type" = EXCLUDED."type";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conferences" ALTER COLUMN "register_ended_at" SET DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "conferences" ALTER COLUMN "preregister_ended_at" SET DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "conferences" ALTER COLUMN "delivery_ended_at" SET DEFAULT now()`
    );
  }
}
