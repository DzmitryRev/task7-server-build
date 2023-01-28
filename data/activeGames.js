"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SessionData_1 = __importDefault(require("./SessionData"));
class ActiveGames extends SessionData_1.default {
    getItem(gameId) {
        const item = this.data.find((item) => item.gameId === gameId);
        return item ? item : null;
    }
    removeItem(gameId) {
        this.data = this.data.filter((item) => item.gameId !== gameId);
    }
}
exports.default = ActiveGames;
