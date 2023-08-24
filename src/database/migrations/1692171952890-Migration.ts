import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692171952890 implements MigrationInterface {
    name = 'Migration1692171952890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goods_entity" ADD "bookingCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goods_entity" DROP COLUMN "bookingCount"`);
    }

}
