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
const crud_1 = require("@nestjsx/crud");
const account_entity_1 = require("./account.entity");
const swagger_1 = require("@nestjs/swagger");
const account_service_1 = require("./account.service");
const auth_1 = require("../utils/auth");
let AccountController = class AccountController {
    constructor(service) {
        this.service = service;
    }
    get base() {
        return this;
    }
    createOne(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.service.createAccount(dto);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    updateOne(dto, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = req.parsed.paramsFilter.find((item) => item.field === 'id');
                const id = find.value;
                delete dto.username;
                return yield this.service.updateAccount(dto, id);
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    getOne(req, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = req.parsed.paramsFilter.find((item) => item.field === 'id');
                console.info('find', find);
                if (!find) {
                    throw new common_1.HttpException('Id not found', 400);
                }
                const id = find.value;
                if (id === 'my') {
                    if (request.headers.authorization) {
                        const accountId = yield auth_1.getAccountId(request.headers.authorization);
                        return yield this.service.getOneAccount(accountId);
                    }
                    else {
                        throw new common_1.UnauthorizedException();
                    }
                }
                else {
                    return yield this.service.getOneAccount(id);
                }
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    getMany(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.base.getManyBase(req);
                if (res && res.data && Array.isArray(res.data)) {
                    res.data = res.data.map((item) => {
                        delete item.password;
                        return item;
                    });
                }
                else if (res && Array.isArray(res)) {
                    res = res.map((item) => {
                        delete item.password;
                        return item;
                    });
                }
                return res;
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
    setInitAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.service.createInitAccount();
            }
            catch (err) {
                throw new common_1.HttpException(err.message || err.response, err.status);
            }
        });
    }
};
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [account_entity_1.Account]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "createOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedBody()),
    __param(1, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [account_entity_1.Account, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "updateOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getOne", null);
__decorate([
    crud_1.Override(),
    __param(0, crud_1.ParsedRequest()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getMany", null);
__decorate([
    common_1.Post('/setInitAccount'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "setInitAccount", null);
AccountController = __decorate([
    crud_1.Crud({
        model: {
            type: account_entity_1.Account,
        },
        params: {
            id: {
                field: 'id',
                type: 'string',
                primary: true,
            },
        },
    }),
    swagger_1.ApiUseTags('Account'),
    common_1.Controller('account'),
    swagger_1.ApiBearerAuth(),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map