import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Account } from './account.entity';
export declare class AccountService extends TypeOrmCrudService<Account> {
    constructor(repo: any);
    getOneAccount(account_id: string): Promise<Account>;
    updateAccount(dto: Account, id: string): Promise<Account>;
    createAccount(dto: Account): Promise<any>;
    createInitAccount(): Promise<any>;
    cekAccount(dto: Account, oldDto?: Account): Promise<never>;
}
