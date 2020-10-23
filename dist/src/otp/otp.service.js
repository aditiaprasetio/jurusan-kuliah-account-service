"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const twilio = require('twilio');
const authy = require('authy')('tXHUFgBTWOXB2687tZ9b3JP47q6W79ER');
let OTPService = class OTPService {
    constructor() { }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountSid = 'ACd123c62c9c075b4db558503e45b43be0';
                const authToken = '98efe95d8f62fe2329fc286572edcd88';
                const client = new twilio(accountSid, authToken);
                client.messages
                    .create({
                    body: 'Hello from Node',
                    to: '+6285645991577',
                    from: '+16019800185',
                })
                    .then(message => console.log(message.sid));
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    requestOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authy_id = '244302188';
                authy.request_sms(authy_id, (err, res) => {
                    if (res) {
                        console.log('res', res.message);
                    }
                    if (err) {
                        console.info('err', JSON.stringify(err));
                    }
                });
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
OTPService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], OTPService);
exports.OTPService = OTPService;
//# sourceMappingURL=otp.service.js.map