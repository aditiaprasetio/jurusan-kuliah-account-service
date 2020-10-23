import { OTPService } from './otp.service';
export declare class OTPController {
    service: OTPService;
    constructor(service: OTPService);
    send(): Promise<never>;
    requestOTP(): Promise<never>;
}
