"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const dotenv = require("dotenv");
const core_1 = require("@nestjs/core");
const timeout_interceptor_1 = require("./timeout.interceptor");
const otp_module_1 = require("./otp/otp.module");
const account_module_1 = require("./account/account.module");
const auth_module_1 = require("./auth/auth.module");
const migrations = require("./migrations");
const { parsed } = dotenv.config({
    path: process.cwd() +
        '/.env' +
        (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = Object.assign(Object.assign({}, process.env), parsed);
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.TYPEORM_HOST,
                password: process.env.TYPEORM_PASSWORD,
                username: process.env.TYPEORM_USERNAME,
                database: process.env.TYPEORM_DATABASE,
                port: Number(process.env.TYPEORM_PORT),
                entities: [
                    __dirname + '/**/*.entity{.ts,.js}',
                    __dirname + '/**/**/*.entity{.ts,.js}',
                    __dirname + '/**/**/**/*.entity{.ts,.js}',
                ],
                logging: Boolean(process.env.TYPEORM_LOGGING),
                synchronize: false,
                migrationsRun: true,
                dropSchema: false,
                cli: {
                    migrationsDir: __dirname + '/migrations',
                },
                migrations: [migrations.InitDB1601900335871],
            }),
            account_module_1.AccountModule,
            auth_module_1.AuthModule,
            otp_module_1.OTPModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useValue: timeout_interceptor_1.TimeoutInterceptor,
            },
            app_service_1.AppService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map