"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SessionData_1 = __importDefault(require("./SessionData"));
class UsersOnline extends SessionData_1.default {
    getItem(username) {
        const item = this.data.find((item) => item === username);
        return item ? item : null;
    }
    removeItem(username) {
        this.data = this.data.filter((item) => item !== username);
    }
}
exports.default = UsersOnline;
