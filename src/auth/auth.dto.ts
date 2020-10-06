import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { EGender, ERoles } from '../account/account.enum';
import { EForgotPasswordType } from './auth.enum';

export class AuthLoginUsingProviderDto {
  @ApiModelProperty({ description: 'Available values: [ GOOGLE ]' })
  provider: string;
}

export class AuthLoginViaGoogleDto {
  @ApiModelProperty()
  id_token: string;
}

export class AuthLoginDto {
  @ApiModelProperty({ description: 'Username or email or phone number' })
  username: string;

  @ApiModelProperty()
  password: string;
}

export class AuthRegisterDto {
  @ApiModelProperty()
  first_name: string;

  @ApiModelPropertyOptional()
  last_name: string;

  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  phone_number: string;

  @ApiModelProperty()
  gender: EGender;

  @ApiModelProperty()
  roles: ERoles[];
}

export class AuthResetPasswordDto {
  @ApiModelProperty({ description: 'Username or email or phone number' })
  username: string;

  @ApiModelProperty()
  password: string;
}

export class GenerateForgotPasswordDto {
  @ApiModelProperty({
    description: `Available values: [${Object.keys(EForgotPasswordType).join(
      ', ',
    )}]`,
    example: EForgotPasswordType.SEND_LINK,
  })
  type: EForgotPasswordType;

  @ApiModelProperty({ description: 'Username / email / phone number' })
  username: string;

  @ApiModelProperty({ example: 'https://example.com/forgot-password' })
  url_forgot_password: string;
}

export class ChangePasswordUsingForgotPasswordTokenDto {
  @ApiModelProperty()
  forgot_password_token: string;

  @ApiModelProperty()
  new_password: string;

  @ApiModelProperty()
  confirm_new_password: string;
}
