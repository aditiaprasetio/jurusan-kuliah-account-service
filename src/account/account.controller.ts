import {
  Controller,
  HttpException,
  Post,
  Request,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
} from '@nestjsx/crud';
import { Account } from './account.entity';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { getAccountId } from '../utils/auth';

@Crud({
  model: {
    type: Account,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('Account')
@Controller('account')
@ApiBearerAuth()
export class AccountController implements CrudController<Account> {
  constructor(public service: AccountService) {}

  get base(): CrudController<Account> {
    return this;
  }

  @Override()
  async createOne(@ParsedBody() dto: Account) {
    try {
      return await this.service.createAccount(dto);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Override()
  async updateOne(
    @ParsedBody() dto: Account,
    @ParsedRequest() req: CrudRequest,
  ) {
    try {
      const find = req.parsed.paramsFilter.find(
        (item: any) => item.field === 'id',
      );
      const id = find.value;
      delete dto.username;
      return await this.service.updateAccount(dto, id);
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Override()
  async getOne(@ParsedRequest() req: CrudRequest, @Req() request: Request) {
    try {
      const find = req.parsed.paramsFilter.find(
        (item: any) => item.field === 'id',
      );

      console.info('find', find);

      if (!find) {
        throw new HttpException('Id not found', 400);
      }

      const id = find.value;

      if (id === 'my') {
        if ((request.headers as any).authorization) {
          const accountId = await getAccountId(
            (request.headers as any).authorization,
          );

          return await this.service.getOneAccount(accountId);
        } else {
          throw new UnauthorizedException();
        }
      } else {
        return await this.service.getOneAccount(id);
      }
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Override()
  async getMany(@ParsedRequest() req: CrudRequest) {
    try {
      let res: any = await this.base.getManyBase(req);

      if (res && res.data && Array.isArray(res.data)) {
        res.data = res.data.map((item) => {
          delete item.password;

          return item;
        });
      } else if (res && Array.isArray(res)) {
        res = res.map((item) => {
          delete item.password;

          return item;
        });
      }

      return res;
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }

  @Post('/setInitAccount')
  async setInitAccount() {
    try {
      return this.service.createInitAccount();
    } catch (err) {
      throw new HttpException(err.message || err.response, err.status);
    }
  }
}
