import { Repository } from 'typeorm';
import { Account } from '../account/account.entity';
import { AuthRegisterDto, GenerateForgotPasswordDto, ChangePasswordUsingForgotPasswordTokenDto, AuthLoginViaGoogleDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../services/mail.service';
import { GoogleService } from '../services/google.service';
export declare class AuthService {
    private readonly repo;
    private jwtService;
    private readonly mailService;
    private readonly googleService;
    constructor(repo: Repository<Account>, jwtService: JwtService, mailService: MailService, googleService: GoogleService);
    login(username: string, password: string): Promise<any>;
    loginUsingProvider(dto: any): Promise<any>;
    loginViaGoogle(dto: AuthLoginViaGoogleDto): Promise<any>;
    refreshToken(token: string): Promise<any>;
    register(dto: AuthRegisterDto): Promise<Account>;
    resetPassword(dto: any): Promise<Account>;
    generateForgotPassword(dto: GenerateForgotPasswordDto): Promise<boolean>;
    changePasswordUsingForgotPasswordToken(dto: ChangePasswordUsingForgotPasswordTokenDto): Promise<Account>;
}
