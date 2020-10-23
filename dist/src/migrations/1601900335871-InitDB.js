"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class InitDB1601900335871 {
    constructor() {
        this.name = 'InitDB1601900335871';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('CREATE TABLE `accounts` (`id` varchar(255) NOT NULL, `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `photo_url` text NULL, `phone_number` varchar(255) NULL, `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NULL, `gender` varchar(255) NULL, `roles` text NULL, `created_by_id` varchar(255) NULL, `meta_created_by` json NULL, `forgot_password_token` varchar(255) NULL, UNIQUE INDEX `IDX_477e3187cedfb5a3ac121e899c` (`username`), UNIQUE INDEX `IDX_ee66de6cdc53993296d1ceb8aa` (`email`), UNIQUE INDEX `IDX_31719ad17bc34678f49decea7d` (`phone_number`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('DROP INDEX `IDX_31719ad17bc34678f49decea7d` ON `accounts`', undefined);
            yield queryRunner.query('DROP INDEX `IDX_ee66de6cdc53993296d1ceb8aa` ON `accounts`', undefined);
            yield queryRunner.query('DROP INDEX `IDX_477e3187cedfb5a3ac121e899c` ON `accounts`', undefined);
            yield queryRunner.query('DROP TABLE `accounts`', undefined);
        });
    }
}
exports.InitDB1601900335871 = InitDB1601900335871;
//# sourceMappingURL=1601900335871-InitDB.js.map