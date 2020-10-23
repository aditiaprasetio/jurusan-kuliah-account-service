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
const crud_typeorm_1 = require("@nestjsx/crud-typeorm");
const typeorm_1 = require("@nestjs/typeorm");
const account_entity_1 = require("./account.entity");
const encrypt_1 = require("../utils/encrypt");
const account_enum_1 = require("./account.enum");
let AccountService = class AccountService extends crud_typeorm_1.TypeOrmCrudService {
    constructor(repo) {
        super(repo);
    }
    getOneAccount(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.repo.findOne({
                    where: {
                        id: account_id,
                    },
                });
                delete res.password;
                return res;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    updateAccount(dto, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldDto = yield this.repo.findOne(id);
                yield this.cekAccount(dto, oldDto);
                let newDto = {};
                if (dto.password !== undefined) {
                    newDto = Object.assign(Object.assign({}, dto), { password: encrypt_1.encryptPassword(dto.password) });
                }
                else {
                    newDto = dto;
                }
                yield this.repo.update(id, newDto);
                const res = yield this.repo.findOne(id);
                delete res.password;
                return res;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    createAccount(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.cekAccount(dto);
                const newDto = Object.assign(Object.assign({}, dto), { password: encrypt_1.encryptPassword(dto.password) });
                const created = yield this.repo.create(newDto);
                const saved = yield this.repo.save(created);
                delete saved.password;
                return saved;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    createInitAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bulkData = [];
                const admin = {
                    id: 'dcea9631-f99c-4c79-8b16-df2822251c0b',
                    first_name: 'admin',
                    last_name: 'admin',
                    username: 'admin',
                    password: encrypt_1.encryptPassword('admin'),
                    email: 'admin@pengenkuliah.com',
                    phone_number: '085000000000',
                    gender: account_enum_1.EGender.MALE,
                    roles: [account_enum_1.ERoles.ADMIN],
                };
                bulkData.push(admin);
                const user = {
                    id: '6010bdbc-2b46-498b-9d95-e67414d47a01',
                    first_name: 'user',
                    last_name: 'user',
                    username: 'user',
                    password: encrypt_1.encryptPassword('user'),
                    email: 'user@pengenkuliah.com',
                    phone_number: '085000000002',
                    gender: account_enum_1.EGender.FEMALE,
                    roles: [account_enum_1.ERoles.USER],
                };
                bulkData.push(user);
                let saved;
                bulkData.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                    const created = yield this.repo.create(element);
                    saved = yield this.repo.save(created);
                }));
                return saved;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    cekAccount(dto, oldDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findAccountByUsername = yield this.repo.findOne({
                    where: {
                        username: dto.username,
                    },
                });
                const findAccountByEmail = yield this.repo.findOne({
                    where: {
                        email: dto.email,
                    },
                });
                const findAccountByPhone = yield this.repo.findOne({
                    where: {
                        phone_number: dto.phone_number,
                    },
                });
                if (oldDto) {
                    if (findAccountByUsername && dto.username !== oldDto.username) {
                        return Promise.reject({
                            status: 400,
                            message: 'Username is already exist',
                        });
                    }
                    if (findAccountByEmail && dto.email !== oldDto.email) {
                        return Promise.reject({
                            status: 400,
                            message: 'Email is already exist',
                        });
                    }
                    if (findAccountByPhone && dto.phone_number !== oldDto.phone_number) {
                        return Promise.reject({
                            status: 400,
                            message: 'Phone number is already exist',
                        });
                    }
                }
                else {
                    if (findAccountByUsername) {
                        return Promise.reject({
                            status: 400,
                            message: 'Username is already exist',
                        });
                    }
                    if (findAccountByEmail) {
                        return Promise.reject({
                            status: 400,
                            message: 'Email is already exist',
                        });
                    }
                    if (findAccountByPhone) {
                        return Promise.reject({
                            status: 400,
                            message: 'Phone number is already exist',
                        });
                    }
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
AccountService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(account_entity_1.Account)),
    __metadata("design:paramtypes", [Object])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map