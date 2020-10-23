import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegisterDto, AuthResetPasswordDto, GenerateForgotPasswordDto, ChangePasswordUsingForgotPasswordTokenDto, AuthLoginUsingProviderDto, AuthLoginViaGoogleDto } from './auth.dto';
import { Account } from '../account/account.entity';
export declare class AuthController {
    service: AuthService;
    constructor(service: AuthService);
    login(dto: AuthLoginDto): Promise<any>;
    loginUsingProvider(dto: AuthLoginUsingProviderDto, request: Request): Promise<any>;
    loginViaGoogle(dto: AuthLoginViaGoogleDto, request: Request): Promise<any>;
    register(dto: AuthRegisterDto, request: Request): Promise<Account>;
    refreshToken(request: Request): Promise<Account>;
    resetPassword(dto: AuthResetPasswordDto): Promise<Account>;
    generateForgotPassword(dto: GenerateForgotPasswordDto): Promise<boolean>;
    changePasswordUsingForgotPasswordToken(dto: ChangePasswordUsingForgotPasswordTokenDto): Promise<Account>;
}
