import { MigrationInterface, QueryRunner } from "typeorm";

export class New1627761057086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM post`);

    await queryRunner.query(
      `ALTER TABLE "comment" ADD "creatorId" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_b6bf60ecb9f6c398e349adff52f" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(_: QueryRunner): Promise<void> {}
}
