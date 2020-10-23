import { CrudController, CrudRequest } from '@nestjsx/crud';
import { Account } from './account.entity';
import { AccountService } from './account.service';
export declare class AccountController implements CrudController<Account> {
    service: AccountService;
    constructor(service: AccountService);
    get base(): CrudController<Account>;
    createOne(dto: Account): Promise<any>;
    updateOne(dto: Account, req: CrudRequest): Promise<Account>;
    getOne(req: CrudRequest, request: Request): Promise<Account>;
    getMany(req: CrudRequest): Promise<any>;
    setInitAccount(): Promise<any>;
}
