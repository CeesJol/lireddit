import {MigrationInterface, QueryRunner} from "typeorm";

export class New1627799621850 implements MigrationInterface {
    name = 'New1627799621850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "relatedPostId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_070e79a5d3091ba449516d66bca" FOREIGN KEY ("relatedPostId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_070e79a5d3091ba449516d66bca"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "relatedPostId"`);
    }

}
