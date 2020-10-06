import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface IResultGoogleCheckToken {
  // These six fields are included in all Google ID Tokens.
  iss: string;
  sub: string;
  azp: string;
  aud: string;
  iat: string;
  exp: string;

  email: string;
  email_verified: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
}

@Injectable()
export class GoogleService {
  async checkToken(id_token: string): Promise<IResultGoogleCheckToken> {
    try {
      const res = await axios({
        method: 'POST',
        url: 'https://oauth2.googleapis.com/tokeninfo?id_token=' + id_token,
      });

      if (res && res.data) {
        return res.data;
      } else {
        return Promise.reject({ status: 400, message: 'Success but no data' });
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
