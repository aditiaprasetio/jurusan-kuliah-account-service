import { BaseEntity } from '../base.entity';
import { ERoles, EGender } from './account.enum';
export declare class Account extends BaseEntity {
    username: string;
    password: string;
    email: string;
    photo_url: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    gender: EGender;
    roles: ERoles[];
    created_by_id: string;
    meta_created_by: JSON;
    forgot_password_token: string;
    protected beforeInsert(): void;
}
