"use strict";
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
const jwt = require("jsonwebtoken");
function getAccountId(authorization) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!authorization)
            return null;
        let token;
        const exp = yield authorization.split(' ');
        if (exp && exp.length > 0) {
            token = exp[1];
        }
        else {
            return null;
        }
        const account = yield jwt.decode(token);
        console.info('account', account);
        return account.sub;
    });
}
exports.getAccountId = getAccountId;
function getCompanyId(headers) {
    console.info('headers', JSON.stringify(headers));
    if (headers.realm) {
        return headers.realm;
    }
    else if (headers.Realm) {
        return headers.Realm;
    }
    else if (headers.company_id) {
        return headers.company_id;
    }
    else {
        return null;
    }
}
exports.getCompanyId = getCompanyId;
function getAccountDetail(authorization) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!authorization)
            return null;
        let token;
        const exp = yield authorization.split(' ');
        if (exp && exp.length > 0) {
            token = exp[1];
        }
        else {
            return null;
        }
        const account = yield jwt.decode(token);
        return account;
    });
}
exports.getAccountDetail = getAccountDetail;
function getToken(authorization) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!authorization)
            return null;
        let token;
        const exp = yield authorization.split(' ');
        if (exp && exp.length > 0) {
            token = exp[1];
        }
        else {
            return null;
        }
        return token;
    });
}
exports.getToken = getToken;
function getDataFromProvider(authorization) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!authorization)
            return null;
        let token;
        const exp = yield authorization.split(' ');
        if (exp && exp.length > 0) {
            token = exp[1];
        }
        else {
            return null;
        }
        const data = yield jwt.decode(token);
        return data;
    });
}
exports.getDataFromProvider = getDataFromProvider;
//# sourceMappingURL=auth.js.map