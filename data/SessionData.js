"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SessionData {
    constructor() {
        this.data = [];
    }
    setItem(item) {
        this.data.push(item);
    }
    clear() {
        this.data = [];
    }
    getAll() {
        return this.data;
    }
}
exports.default = SessionData;
