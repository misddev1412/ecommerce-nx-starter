import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirebaseFieldsToUser1750152240477 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "firebaseUid" character varying,
            ADD COLUMN "provider" character varying
        `);
        
        await queryRunner.query(`
            UPDATE "users" 
            SET "status" = 'ACTIVE' 
            WHERE "status" = 'active'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "firebaseUid",
            DROP COLUMN "provider"
        `);
        
        await queryRunner.query(`
            UPDATE "users" 
            SET "status" = 'active' 
            WHERE "status" = 'ACTIVE'
        `);
    }

}
