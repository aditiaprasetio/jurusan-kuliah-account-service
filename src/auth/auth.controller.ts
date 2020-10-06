import {
  Controller,
  Post,
  Body,
  HttpException,
  Req,
  Request,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthLoginDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  GenerateForgotPasswordDto,
  ChangePasswordUsingForgotPasswordTokenDto,
  AuthLoginUsingProviderDto,
  AuthLoginViaGoogleDto,
} from './auth.dto';
import { Account } from '../account/account.entity';
import {
  getAccountId,
  getAccountDetail,
  getToken,
  getDataFromProvider,
} from '../utils/auth';

@ApiUseTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(public service: AuthService) {}

  @Post('login')
  async login(@Body() dto: AuthLoginDto): Promise<any> {
    try {
      return this.service.login(dto.username, dto.password);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Post('login-using-provider')
  async loginUsingProvider(
    @Body() dto: AuthLoginUsingProviderDto,
    @Req() request: Request,
  ): Promise<any> {
    try {
      console.info('0');
      const dataFromProvider = await getDataFromProvider(
        (request.headers as any).authorization,
      );
      const newDto: any = {
        ...dto,
        dataFromProvider,
      };
      console.info('1');
      return this.service.loginUsingProvider(dto);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Post('login-via-google')
  async loginViaGoogle(
    @Body() dto: AuthLoginViaGoogleDto,
    @Req() request: Request,
  ): Promise<any> {
    try {
      return this.service.loginViaGoogle(dto);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Post('register')
  async register(
    @Body() dto: AuthRegisterDto,
    @Req() request: Request,
  ): Promise<Account> {
    try {
      let data: any = {};

      if ((request.headers as any).authorization) {
        const created_id = await getAccountId(
          (request.headers as any).authorization,
        );
        const created_meta = await getAccountDetail(
          (request.headers as any).authorization,
        );

        data = {
          ...dto,
          created_by_id: created_id,
          meta_created_by: created_meta,
        };
      } else {
        data = {
          ...dto,
        };
      }

      return this.service.register(data);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Post('refresh-token') // authorization = refresh token
  async refreshToken(@Req() request: Request): Promise<Account> {
    try {
      const refreshToken = await getToken(
        (request.headers as any).authorization,
      );
      return this.service.refreshToken(refreshToken);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: AuthResetPasswordDto): Promise<Account> {
    try {
      return this.service.resetPassword(dto);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Post('forgot-password')
  async generateForgotPassword(
    @Body() dto: GenerateForgotPasswordDto,
  ): Promise<boolean> {
    try {
      return this.service.generateForgotPassword(dto);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Post('change-password-by-token')
  async changePasswordUsingForgotPasswordToken(
    @Body() dto: ChangePasswordUsingForgotPasswordTokenDto,
  ): Promise<Account> {
    try {
      return this.service.changePasswordUsingForgotPasswordToken(dto);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }
}
