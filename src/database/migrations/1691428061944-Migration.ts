import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1691428061944 implements MigrationInterface {
  name = 'Migration1691428061944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "goods_entity" ("goodsId" SERIAL NOT NULL, "userId" integer NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "price" integer NOT NULL, "imgUrl" character varying NOT NULL, "showDate" TIMESTAMP NOT NULL, "bookingLimit" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e9f500eb54208f287e4fd2da831" PRIMARY KEY ("goodsId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "nickname" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "goods_entity" ADD CONSTRAINT "FK_952eed61199d105c38559b842a6" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goods_entity" DROP CONSTRAINT "FK_952eed61199d105c38559b842a6"`,
    );
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TABLE "goods_entity"`);
  }
}
