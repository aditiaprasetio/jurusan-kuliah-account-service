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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const account_entity_1 = require("../account/account.entity");
const jwt_1 = require("@nestjs/jwt");
const encrypt_1 = require("../utils/encrypt");
const uuid = require("uuid");
const mail_service_1 = require("../services/mail.service");
const mail_dto_1 = require("../services/mail.dto");
const auth_enum_1 = require("./auth.enum");
const account_enum_1 = require("../account/account.enum");
const google_service_1 = require("../services/google.service");
let AuthService = class AuthService {
    constructor(repo, jwtService, mailService, googleService) {
        this.repo = repo;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.googleService = googleService;
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                username = username.trim().toLowerCase();
                password = encrypt_1.encryptPassword(password);
                let findAccount = yield this.repo.findOne({
                    where: {
                        username,
                        password,
                    },
                });
                if (!findAccount) {
                    findAccount = yield this.repo.findOne({
                        where: {
                            email: username,
                            password,
                        },
                    });
                }
                if (!findAccount) {
                    findAccount = yield this.repo.findOne({
                        where: {
                            phone_number: username,
                            password,
                        },
                    });
                }
                if (!findAccount) {
                    return Promise.reject({
                        status: 404,
                        message: 'Username and password is not valid',
                    });
                }
                delete findAccount.password;
                delete findAccount.created_at;
                delete findAccount.updated_at;
                const payloadAccessToken = Object.assign(Object.assign({}, findAccount), { sub: findAccount.id, typ: 'Bearer' });
                delete payloadAccessToken.id;
                const payloadRefreshToken = {
                    sub: findAccount.id,
                    typ: 'Refresh',
                };
                const res = {
                    access_token: yield this.jwtService.sign(payloadAccessToken),
                    refresh_token: yield this.jwtService.sign(payloadRefreshToken),
                };
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    loginUsingProvider(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let email;
                let first_name;
                let last_name;
                let phone_number;
                let photo_url;
                console.info('11', dto);
                if (dto.provider === 'GOOGLE') {
                    console.info('1a');
                    email = dto.dataFromProvider.additionalUserInfo.profile.email;
                    first_name = dto.dataFromProvider.additionalUserInfo.profile.given_name;
                    last_name = dto.dataFromProvider.additionalUserInfo.profile.family_name;
                    console.info('1g', email, first_name, last_name);
                    phone_number = dto.dataFromProvider.user.phoneNumber;
                    photo_url = dto.dataFromProvider.user.photoURL;
                }
                else {
                    throw new common_1.UnauthorizedException();
                }
                email = email.trim().toLowerCase();
                console.info('2');
                let findAccount = yield this.repo.findOne({
                    where: {
                        email,
                    },
                });
                if (!findAccount) {
                    findAccount = yield this.repo.findOne({
                        where: {
                            username: email,
                        },
                    });
                }
                if (!findAccount) {
                    const created = yield this.repo.create({
                        username: email,
                        email,
                        first_name,
                        last_name,
                        password: encrypt_1.encryptPassword(encrypt_1.generateRandomString(6)),
                        phone_number,
                        photo_url,
                        roles: [account_enum_1.ERoles.USER],
                    });
                    findAccount = yield this.repo.save(created);
                }
                delete findAccount.password;
                delete findAccount.created_at;
                delete findAccount.updated_at;
                const payloadAccessToken = Object.assign(Object.assign({}, findAccount), { sub: findAccount.id, typ: 'Bearer' });
                delete payloadAccessToken.id;
                const payloadRefreshToken = {
                    sub: findAccount.id,
                    typ: 'Refresh',
                };
                const res = {
                    access_token: yield this.jwtService.sign(payloadAccessToken),
                    refresh_token: yield this.jwtService.sign(payloadRefreshToken),
                };
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    loginViaGoogle(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkToken = yield this.googleService.checkToken(dto.id_token);
                let email;
                let first_name;
                let last_name;
                let phone_number;
                let photo_url;
                console.info('11', checkToken);
                email = checkToken.email;
                first_name = checkToken.given_name;
                last_name = checkToken.family_name;
                console.info('1g', email, first_name, last_name);
                phone_number = null;
                photo_url = checkToken.picture;
                email = email.trim().toLowerCase();
                console.info('2');
                let findAccount = yield this.repo.findOne({
                    where: {
                        email,
                    },
                });
                if (!findAccount) {
                    findAccount = yield this.repo.findOne({
                        where: {
                            username: email,
                        },
                    });
                }
                if (!findAccount) {
                    const created = yield this.repo.create({
                        username: email,
                        email,
                        first_name,
                        last_name,
                        password: encrypt_1.encryptPassword(encrypt_1.generateRandomString(6)),
                        phone_number,
                        photo_url,
                        roles: [account_enum_1.ERoles.USER],
                    });
                    findAccount = yield this.repo.save(created);
                }
                delete findAccount.password;
                delete findAccount.created_at;
                delete findAccount.updated_at;
                const payloadAccessToken = Object.assign(Object.assign({}, findAccount), { sub: findAccount.id, typ: 'Bearer' });
                delete payloadAccessToken.id;
                const payloadRefreshToken = {
                    sub: findAccount.id,
                    typ: 'Refresh',
                };
                const res = {
                    access_token: yield this.jwtService.sign(payloadAccessToken),
                    refresh_token: yield this.jwtService.sign(payloadRefreshToken),
                };
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    refreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.info('refresh token', token);
                const parsedToken = this.jwtService.decode(token);
                const accountId = parsedToken.sub;
                const findAccount = yield this.repo.findOne(accountId);
                if (!findAccount) {
                    return Promise.reject({
                        status: 404,
                        message: 'Refresh token is not valid',
                    });
                }
                delete findAccount.password;
                delete findAccount.created_at;
                delete findAccount.updated_at;
                const payloadAccessToken = Object.assign(Object.assign({}, findAccount), { sub: findAccount.id, typ: 'Bearer' });
                delete payloadAccessToken.id;
                const payloadRefreshToken = {
                    sub: findAccount.id,
                    typ: 'Refresh',
                };
                const res = {
                    access_token: yield this.jwtService.sign(payloadAccessToken),
                    refresh_token: yield this.jwtService.sign(payloadRefreshToken),
                };
                return res;
            }
            catch (err) {
                console.error(JSON.stringify(err));
                return Promise.reject(err);
            }
        });
    }
    register(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                dto.username = dto.username.trim().toLowerCase();
                const findAccountByUsername = yield this.repo.findOne({
                    where: {
                        username: dto.username,
                    },
                });
                if (findAccountByUsername) {
                    return Promise.reject({
                        status: 400,
                        message: 'Username is already exist',
                    });
                }
                const findAccountByEmail = yield this.repo.findOne({
                    where: {
                        email: dto.email,
                    },
                });
                if (findAccountByEmail) {
                    return Promise.reject({
                        status: 400,
                        message: 'Email is already exist',
                    });
                }
                const findAccountByPhone = yield this.repo.findOne({
                    where: {
                        email: dto.phone_number,
                    },
                });
                if (findAccountByPhone) {
                    return Promise.reject({
                        status: 400,
                        message: 'Phone number is already exist',
                    });
                }
                console.info('before encrypt');
                dto.password = encrypt_1.encryptPassword(dto.password);
                console.info('encrypt', dto.password);
                const created = yield this.repo.create(dto);
                const saved = yield this.repo.save(created);
                delete saved.password;
                return saved;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    resetPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = dto.username.trim().toLowerCase();
                let findAccount = yield this.repo.findOne({
                    where: {
                        username,
                    },
                });
                if (!findAccount) {
                    findAccount = yield this.repo.findOne({
                        where: {
                            email: username,
                        },
                    });
                }
                if (!findAccount) {
                    findAccount = yield this.repo.findOne({
                        where: {
                            phone_number: username,
                        },
                    });
                }
                if (!findAccount) {
                    return Promise.reject({
                        status: 404,
                        message: 'Account is not found',
                    });
                }
                const newPasswordEncrypted = encrypt_1.encryptPassword(dto.password);
                yield this.repo.update(findAccount.id, {
                    password: newPasswordEncrypted,
                });
                const res = yield this.repo.findOne(findAccount.id);
                delete res.password;
                delete res.created_at;
                delete res.updated_at;
                delete res.forgot_password_token;
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    generateForgotPassword(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = dto.username.trim().toLowerCase();
                let findAccount = yield this.repo.findOne({
                    where: {
                        username,
                    },
                });
                if (!findAccount) {
                    findAccount = yield this.repo.findOne({
                        where: {
                            email: username,
                        },
                    });
                }
                if (!findAccount) {
                    findAccount = yield this.repo.findOne({
                        where: {
                            phone_number: username,
                        },
                    });
                }
                if (!findAccount) {
                    return Promise.reject({
                        status: 404,
                        message: 'Account is not found',
                    });
                }
                if (dto.type === auth_enum_1.EForgotPasswordType.RANDOM) {
                    const newPassword = encrypt_1.generateRandomString(6);
                    const encryptedNewPassword = encrypt_1.encryptPassword(newPassword);
                    yield this.repo.update(findAccount.id, {
                        password: encryptedNewPassword,
                    });
                    const mailData = {
                        feature: mail_dto_1.EFeatureList.FORGOT_PASSWORD_RANDOM_PASSWORD,
                        emails: [findAccount.email],
                        subject: 'Forgot Password - Random Password',
                        data: {
                            new_password: newPassword,
                            fullname: findAccount.first_name + ' ' + findAccount.last_name,
                        },
                    };
                    yield this.mailService.sendMail(mailData);
                }
                else {
                    const forgot_password_token = uuid.v4();
                    const encryptedForgotPasswordToken = encrypt_1.encryptPassword(forgot_password_token);
                    yield this.repo.update(findAccount.id, {
                        forgot_password_token: encryptedForgotPasswordToken,
                    });
                    let url_forgot_password;
                    if (dto.url_forgot_password) {
                        url_forgot_password =
                            dto.url_forgot_password + '?token=' + encryptedForgotPasswordToken;
                    }
                    else {
                        url_forgot_password =
                            process.env.URL_WEB_APP_FORGOT_PASSWORD +
                                '?token=' +
                                encryptedForgotPasswordToken;
                    }
                    console.info('url_forgot_password', url_forgot_password);
                    const mailData = {
                        feature: mail_dto_1.EFeatureList.FORGOT_PASSWORD_LINK_RESET_PASSWORD,
                        emails: [findAccount.email],
                        subject: 'Forgot Password - Link Reset Password',
                        data: {
                            url_forgot_password,
                            fullname: findAccount.first_name + ' ' + findAccount.last_name,
                        },
                    };
                    yield this.mailService.sendMail(mailData);
                }
                return true;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    changePasswordUsingForgotPasswordToken(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (dto.new_password !== dto.confirm_new_password) {
                    return Promise.reject({
                        status: 400,
                        message: 'New password not same',
                    });
                }
                const findAccount = yield this.repo.findOne({
                    where: {
                        forgot_password_token: dto.forgot_password_token,
                    },
                });
                if (!findAccount) {
                    return Promise.reject({
                        status: 400,
                        message: 'Token is not valid',
                    });
                }
                const newPasswordEncrypted = encrypt_1.encryptPassword(dto.new_password);
                yield this.repo.update(findAccount.id, {
                    password: newPasswordEncrypted,
                });
                const res = yield this.repo.findOne(findAccount.id);
                delete res.password;
                delete res.created_at;
                delete res.updated_at;
                delete res.forgot_password_token;
                return res;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(account_entity_1.Account)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mail_service_1.MailService,
        google_service_1.GoogleService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map