import { EGender, ERoles } from '../account/account.enum';
import { EForgotPasswordType } from './auth.enum';
export declare class AuthLoginUsingProviderDto {
    provider: string;
}
export declare class AuthLoginViaGoogleDto {
    id_token: string;
}
export declare class AuthLoginDto {
    username: string;
    password: string;
}
export declare class AuthRegisterDto {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    email: string;
    phone_number: string;
    gender: EGender;
    roles: ERoles[];
}
export declare class AuthResetPasswordDto {
    username: string;
    password: string;
}
export declare class GenerateForgotPasswordDto {
    type: EForgotPasswordType;
    username: string;
    url_forgot_password: string;
}
export declare class ChangePasswordUsingForgotPasswordTokenDto {
    forgot_password_token: string;
    new_password: string;
    confirm_new_password: string;
}
