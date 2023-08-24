import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1691503216146 implements MigrationInterface {
  name = 'Migration1691503216146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "goods_entity" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "price" integer NOT NULL, "imgUrl" character varying NOT NULL, "showDate" TIMESTAMP NOT NULL, "bookingLimit" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93e3fc0a8d7ad6fd4468f0247a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "nickname" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking_entity" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "goodsId" integer NOT NULL, CONSTRAINT "PK_ab285d4d9e829aa0fc5f679c7e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "goods_entity" ADD CONSTRAINT "FK_952eed61199d105c38559b842a6" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_entity" ADD CONSTRAINT "FK_c9615481da7a085320adc676471" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_entity" ADD CONSTRAINT "FK_70a1aa3a3c1ba406c738576eab2" FOREIGN KEY ("goodsId") REFERENCES "goods_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_entity" DROP CONSTRAINT "FK_70a1aa3a3c1ba406c738576eab2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_entity" DROP CONSTRAINT "FK_c9615481da7a085320adc676471"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goods_entity" DROP CONSTRAINT "FK_952eed61199d105c38559b842a6"`,
    );
    await queryRunner.query(`DROP TABLE "booking_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TABLE "goods_entity"`);
  }
}
