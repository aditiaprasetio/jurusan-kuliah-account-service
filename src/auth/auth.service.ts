import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../account/account.entity';
import {
  AuthRegisterDto,
  GenerateForgotPasswordDto,
  ChangePasswordUsingForgotPasswordTokenDto,
  AuthLoginViaGoogleDto,
} from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword, generateRandomString } from '../utils/encrypt';
import { getAccountId, getAccountDetail } from '../utils/auth';
import * as uuid from 'uuid';
import { MailService, SendMailDto } from '../services/mail.service';
import { EFeatureList } from '../services/mail.dto';
import { EForgotPasswordType } from './auth.enum';
import { ERoles } from '../account/account.enum';
import { last } from 'rxjs/operators';
import { GoogleService } from '../services/google.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly googleService: GoogleService,
  ) {}

  async login(username: string, password: string): Promise<any> {
    try {
      username = username.trim().toLowerCase();
      password = encryptPassword(password);

      let findAccount = await this.repo.findOne({
        where: {
          username,
          password,
        },
      });

      if (!findAccount) {
        findAccount = await this.repo.findOne({
          where: {
            email: username,
            password,
          },
        });
      }

      if (!findAccount) {
        findAccount = await this.repo.findOne({
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

      const payloadAccessToken = {
        ...findAccount,
        sub: findAccount.id,
        typ: 'Bearer',
      };
      delete payloadAccessToken.id;

      const payloadRefreshToken = {
        sub: findAccount.id,
        typ: 'Refresh',
      };

      const res: any = {
        access_token: await this.jwtService.sign(payloadAccessToken),
        refresh_token: await this.jwtService.sign(payloadRefreshToken),
      };

      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async loginUsingProvider(dto: any): Promise<any> {
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
      } else {
        throw new UnauthorizedException();
      }
      email = email.trim().toLowerCase();

      console.info('2');
      let findAccount = await this.repo.findOne({
        where: {
          email,
        },
      });

      if (!findAccount) {
        findAccount = await this.repo.findOne({
          where: {
            username: email,
          },
        });
      }

      if (!findAccount) {
        // register
        const created = await this.repo.create({
          username: email,
          email,
          first_name,
          last_name,
          password: encryptPassword(generateRandomString(6)),
          phone_number,
          photo_url,
          roles: [ERoles.USER],
        });
        // replace findAccount with new saved account
        findAccount = await this.repo.save(created);
      }

      delete findAccount.password;
      delete findAccount.created_at;
      delete findAccount.updated_at;

      const payloadAccessToken = {
        ...findAccount,
        sub: findAccount.id,
        typ: 'Bearer',
      };
      delete payloadAccessToken.id;

      const payloadRefreshToken = {
        sub: findAccount.id,
        typ: 'Refresh',
      };

      const res: any = {
        access_token: await this.jwtService.sign(payloadAccessToken),
        refresh_token: await this.jwtService.sign(payloadRefreshToken),
      };

      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async loginViaGoogle(dto: AuthLoginViaGoogleDto): Promise<any> {
    try {
      const checkToken = await this.googleService.checkToken(dto.id_token);

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
      let findAccount = await this.repo.findOne({
        where: {
          email,
        },
      });

      if (!findAccount) {
        findAccount = await this.repo.findOne({
          where: {
            username: email,
          },
        });
      }

      if (!findAccount) {
        // register
        const created = await this.repo.create({
          username: email,
          email,
          first_name,
          last_name,
          password: encryptPassword(generateRandomString(6)),
          phone_number,
          photo_url,
          roles: [ERoles.USER],
        });
        // replace findAccount with new saved account
        findAccount = await this.repo.save(created);
      }

      delete findAccount.password;
      delete findAccount.created_at;
      delete findAccount.updated_at;

      const payloadAccessToken = {
        ...findAccount,
        sub: findAccount.id,
        typ: 'Bearer',
      };
      delete payloadAccessToken.id;

      const payloadRefreshToken = {
        sub: findAccount.id,
        typ: 'Refresh',
      };

      const res: any = {
        access_token: await this.jwtService.sign(payloadAccessToken),
        refresh_token: await this.jwtService.sign(payloadRefreshToken),
      };

      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async refreshToken(token: string): Promise<any> {
    try {
      console.info('refresh token', token);
      const parsedToken = this.jwtService.decode(token);
      const accountId = parsedToken.sub;

      const findAccount = await this.repo.findOne(accountId);

      if (!findAccount) {
        return Promise.reject({
          status: 404,
          message: 'Refresh token is not valid',
        });
      }

      delete findAccount.password;
      delete findAccount.created_at;
      delete findAccount.updated_at;

      const payloadAccessToken = {
        ...findAccount,
        sub: findAccount.id,
        typ: 'Bearer',
      };
      delete payloadAccessToken.id;

      const payloadRefreshToken = {
        sub: findAccount.id,
        typ: 'Refresh',
      };

      const res: any = {
        access_token: await this.jwtService.sign(payloadAccessToken),
        refresh_token: await this.jwtService.sign(payloadRefreshToken),
      };

      return res;
    } catch (err) {
      console.error(JSON.stringify(err));
      return Promise.reject(err);
    }
  }

  async register(dto: AuthRegisterDto): Promise<Account> {
    try {
      dto.username = dto.username.trim().toLowerCase();
      const findAccountByUsername = await this.repo.findOne({
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

      const findAccountByEmail = await this.repo.findOne({
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

      const findAccountByPhone = await this.repo.findOne({
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
      dto.password = encryptPassword(dto.password);
      console.info('encrypt', dto.password);

      const created = await this.repo.create(dto);
      const saved: any = await this.repo.save(created);

      delete saved.password;

      return saved;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async resetPassword(dto: any): Promise<Account> {
    try {
      const username = dto.username.trim().toLowerCase();

      let findAccount = await this.repo.findOne({
        where: {
          username,
        },
      });

      if (!findAccount) {
        findAccount = await this.repo.findOne({
          where: {
            email: username,
          },
        });
      }

      if (!findAccount) {
        findAccount = await this.repo.findOne({
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

      const newPasswordEncrypted = encryptPassword(dto.password);

      await this.repo.update(findAccount.id, {
        password: newPasswordEncrypted,
      });

      // send email

      const res = await this.repo.findOne(findAccount.id);

      delete res.password;
      delete res.created_at;
      delete res.updated_at;
      delete res.forgot_password_token;

      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async generateForgotPassword(dto: GenerateForgotPasswordDto) {
    try {
      const username = dto.username.trim().toLowerCase();

      let findAccount = await this.repo.findOne({
        where: {
          username,
        },
      });

      if (!findAccount) {
        findAccount = await this.repo.findOne({
          where: {
            email: username,
          },
        });
      }

      if (!findAccount) {
        findAccount = await this.repo.findOne({
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

      if (dto.type === EForgotPasswordType.RANDOM) {
        const newPassword = generateRandomString(6);
        const encryptedNewPassword = encryptPassword(newPassword);

        await this.repo.update(findAccount.id, {
          password: encryptedNewPassword,
        });

        // send to email
        const mailData: SendMailDto = {
          feature: EFeatureList.FORGOT_PASSWORD_RANDOM_PASSWORD,
          emails: [findAccount.email],
          subject: 'Forgot Password - Random Password',
          data: {
            new_password: newPassword,
            fullname: findAccount.first_name + ' ' + findAccount.last_name,
          },
        };
        await this.mailService.sendMail(mailData);
      } else {
        const forgot_password_token = uuid.v4();
        const encryptedForgotPasswordToken = encryptPassword(
          forgot_password_token,
        );

        await this.repo.update(findAccount.id, {
          forgot_password_token: encryptedForgotPasswordToken,
        });

        let url_forgot_password;

        if (dto.url_forgot_password) {
          url_forgot_password =
            dto.url_forgot_password + '?token=' + encryptedForgotPasswordToken;
        } else {
          url_forgot_password =
            process.env.URL_WEB_APP_FORGOT_PASSWORD +
            '?token=' +
            encryptedForgotPasswordToken;
        }

        console.info('url_forgot_password', url_forgot_password);

        // send to email
        const mailData: SendMailDto = {
          feature: EFeatureList.FORGOT_PASSWORD_LINK_RESET_PASSWORD,
          emails: [findAccount.email],
          subject: 'Forgot Password - Link Reset Password',
          data: {
            url_forgot_password,
            fullname: findAccount.first_name + ' ' + findAccount.last_name,
          },
        };
        await this.mailService.sendMail(mailData);
      }

      return true;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async changePasswordUsingForgotPasswordToken(
    dto: ChangePasswordUsingForgotPasswordTokenDto,
  ) {
    try {
      if (dto.new_password !== dto.confirm_new_password) {
        return Promise.reject({
          status: 400,
          message: 'New password not same',
        });
      }
      const findAccount = await this.repo.findOne({
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

      const newPasswordEncrypted = encryptPassword(dto.new_password);

      await this.repo.update(findAccount.id, {
        password: newPasswordEncrypted,
      });

      const res = await this.repo.findOne(findAccount.id);

      delete res.password;
      delete res.created_at;
      delete res.updated_at;
      delete res.forgot_password_token;

      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
