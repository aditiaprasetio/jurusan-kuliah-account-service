import { EFeatureList } from './mail.dto';
export declare class SendMailDto {
    feature: EFeatureList;
    subject: string;
    emails: string[];
    data: any;
}
export declare class MailService {
    sendMail(data: SendMailDto): Promise<any>;
}
