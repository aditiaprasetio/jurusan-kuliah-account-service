"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./auth.dto");
const auth_1 = require("../utils/auth");
let AuthController = class AuthController {
    constructor(service) {
        this.service = service;
    }
    login(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.login(dto.username, dto.password);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    loginUsingProvider(dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.info('0');
                const dataFromProvider = yield auth_1.getDataFromProvider(request.headers.authorization);
                const newDto = Object.assign(Object.assign({}, dto), { dataFromProvider });
                console.info('1');
                return this.service.loginUsingProvider(dto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    loginViaGoogle(dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.loginViaGoogle(dto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    register(dto, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = {};
                if (request.headers.authorization) {
                    const created_id = yield auth_1.getAccountId(request.headers.authorization);
                    const created_meta = yield auth_1.getAccountDetail(request.headers.authorization);
                    data = Object.assign(Object.assign({}, dto), { created_by_id: created_id, meta_created_by: created_meta });
                }
                else {
                    data = Object.assign({}, dto);
                }
                return this.service.register(data);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    refreshToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = yield auth_1.getToken(request.headers.authorization);
                return this.service.refreshToken(refreshToken);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    resetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.resetPassword(dto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    generateForgotPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.generateForgotPassword(dto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    changePasswordUsingForgotPasswordToken(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.changePasswordUsingForgotPasswordToken(dto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
};
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.Post('login-using-provider'),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthLoginUsingProviderDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUsingProvider", null);
__decorate([
    common_1.Post('login-via-google'),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthLoginViaGoogleDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginViaGoogle", null);
__decorate([
    common_1.Post('register'),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthRegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    common_1.Post('refresh-token'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    common_1.Post('reset-password'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    common_1.Post('forgot-password'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.GenerateForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateForgotPassword", null);
__decorate([
    common_1.Post('change-password-by-token'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ChangePasswordUsingForgotPasswordTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePasswordUsingForgotPasswordToken", null);
AuthController = __decorate([
    swagger_1.ApiUseTags('Auth'),
    common_1.Controller('auth'),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map