import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { encryptPassword } from '../utils/encrypt';
import { EGender, ERoles } from './account.enum';

@Injectable()
export class AccountService extends TypeOrmCrudService<Account> {
  constructor(@InjectRepository(Account) repo) {
    super(repo);
  }

  async getOneAccount(account_id: string) {
    try {
      const res = await this.repo.findOne({
        where: {
          id: account_id,
        },
      });

      delete res.password;
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateAccount(dto: Account, id: string) {
    try {
      const oldDto: Account = await this.repo.findOne(id);

      await this.cekAccount(dto, oldDto);

      let newDto = {};
      if (dto.password !== undefined) {
        newDto = {
          ...dto,
          password: encryptPassword(dto.password),
        };
      } else {
        newDto = dto;
      }

      await this.repo.update(id, newDto);
      const res: Account = await this.repo.findOne(id);

      delete res.password;

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createAccount(dto: Account) {
    try {
      await this.cekAccount(dto);

      const newDto = {
        ...dto,
        password: encryptPassword(dto.password),
      };

      const created = await this.repo.create(newDto);
      const saved: any = await this.repo.save(created);
      delete saved.password;

      return saved;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createInitAccount() {
    try {
      const bulkData: any = [];
      // admin
      const admin = {
        id: 'dcea9631-f99c-4c79-8b16-df2822251c0b',
        first_name: 'admin',
        last_name: 'admin',
        username: 'admin',
        password: encryptPassword('admin'),
        email: 'admin@literasimimpi.id',
        phone_number: '085000000000',
        gender: EGender.MALE,
        roles: [ERoles.ADMIN],
      };

      bulkData.push(admin);

      // user
      const user = {
        id: '6010bdbc-2b46-498b-9d95-e67414d47a01',
        first_name: 'user',
        last_name: 'user',
        username: 'user',
        password: encryptPassword('user'),
        email: 'user@literasimimpi.id',
        phone_number: '085000000002',
        gender: EGender.FEMALE,
        roles: [ERoles.USER],
      };

      bulkData.push(user);

      let saved: any;
      bulkData.forEach(async (element: any) => {
        const created = await this.repo.create(element);
        saved = await this.repo.save(created);
      });

      return saved;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async cekAccount(dto: Account, oldDto?: Account) {
    try {
      const findAccountByUsername = await this.repo.findOne({
        where: {
          username: dto.username,
        },
      });

      const findAccountByEmail = await this.repo.findOne({
        where: {
          email: dto.email,
        },
      });

      const findAccountByPhone = await this.repo.findOne({
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
      } else {
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
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
