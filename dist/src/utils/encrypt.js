"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const uuid = require("uuid");
function encryptPassword(password) {
    password = process.env.SECRET_KEY + '-' + password;
    return crypto.createHmac('sha256', password).digest('hex');
}
exports.encryptPassword = encryptPassword;
function generateToken() {
    const token = uuid.v4();
    return crypto.createHmac('sha256', token).digest('hex');
}
exports.generateToken = generateToken;
function generateRandomString(length = 6) {
    let result = '';
    const characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789*/-';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateRandomString = generateRandomString;
//# sourceMappingURL=encrypt.js.map