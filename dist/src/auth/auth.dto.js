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
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = require("@nestjs/swagger");
const account_enum_1 = require("../account/account.enum");
const auth_enum_1 = require("./auth.enum");
class AuthLoginUsingProviderDto {
}
__decorate([
    swagger_1.ApiModelProperty({ description: 'Available values: [ GOOGLE ]' }),
    __metadata("design:type", String)
], AuthLoginUsingProviderDto.prototype, "provider", void 0);
exports.AuthLoginUsingProviderDto = AuthLoginUsingProviderDto;
class AuthLoginViaGoogleDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AuthLoginViaGoogleDto.prototype, "id_token", void 0);
exports.AuthLoginViaGoogleDto = AuthLoginViaGoogleDto;
class AuthLoginDto {
}
__decorate([
    swagger_1.ApiModelProperty({ description: 'Username or email or phone number' }),
    __metadata("design:type", String)
], AuthLoginDto.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AuthLoginDto.prototype, "password", void 0);
exports.AuthLoginDto = AuthLoginDto;
class AuthRegisterDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AuthRegisterDto.prototype, "first_name", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", String)
], AuthRegisterDto.prototype, "last_name", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AuthRegisterDto.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AuthRegisterDto.prototype, "password", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AuthRegisterDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AuthRegisterDto.prototype, "phone_number", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AuthRegisterDto.prototype, "gender", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Array)
], AuthRegisterDto.prototype, "roles", void 0);
exports.AuthRegisterDto = AuthRegisterDto;
class AuthResetPasswordDto {
}
__decorate([
    swagger_1.ApiModelProperty({ description: 'Username or email or phone number' }),
    __metadata("design:type", String)
], AuthResetPasswordDto.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], AuthResetPasswordDto.prototype, "password", void 0);
exports.AuthResetPasswordDto = AuthResetPasswordDto;
class GenerateForgotPasswordDto {
}
__decorate([
    swagger_1.ApiModelProperty({
        description: `Available values: [${Object.keys(auth_enum_1.EForgotPasswordType).join(', ')}]`,
        example: auth_enum_1.EForgotPasswordType.SEND_LINK,
    }),
    __metadata("design:type", String)
], GenerateForgotPasswordDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiModelProperty({ description: 'Username / email / phone number' }),
    __metadata("design:type", String)
], GenerateForgotPasswordDto.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: 'https://example.com/forgot-password' }),
    __metadata("design:type", String)
], GenerateForgotPasswordDto.prototype, "url_forgot_password", void 0);
exports.GenerateForgotPasswordDto = GenerateForgotPasswordDto;
class ChangePasswordUsingForgotPasswordTokenDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ChangePasswordUsingForgotPasswordTokenDto.prototype, "forgot_password_token", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ChangePasswordUsingForgotPasswordTokenDto.prototype, "new_password", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], ChangePasswordUsingForgotPasswordTokenDto.prototype, "confirm_new_password", void 0);
exports.ChangePasswordUsingForgotPasswordTokenDto = ChangePasswordUsingForgotPasswordTokenDto;
//# sourceMappingURL=auth.dto.js.map