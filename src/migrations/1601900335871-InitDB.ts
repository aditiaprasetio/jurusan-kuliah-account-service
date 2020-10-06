import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1601900335871 implements MigrationInterface {
  name = 'InitDB1601900335871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `accounts` (`id` varchar(255) NOT NULL, `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `photo_url` text NULL, `phone_number` varchar(255) NULL, `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NULL, `gender` varchar(255) NULL, `roles` text NULL, `created_by_id` varchar(255) NULL, `meta_created_by` json NULL, `forgot_password_token` varchar(255) NULL, UNIQUE INDEX `IDX_477e3187cedfb5a3ac121e899c` (`username`), UNIQUE INDEX `IDX_ee66de6cdc53993296d1ceb8aa` (`email`), UNIQUE INDEX `IDX_31719ad17bc34678f49decea7d` (`phone_number`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_31719ad17bc34678f49decea7d` ON `accounts`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_ee66de6cdc53993296d1ceb8aa` ON `accounts`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_477e3187cedfb5a3ac121e899c` ON `accounts`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `accounts`', undefined);
  }
}
