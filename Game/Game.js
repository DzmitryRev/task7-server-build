"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor(gameId, playerOne, opponent, move, result) {
        this.gameId = gameId;
        this.playerOne = playerOne;
        this.playerTwo = opponent;
        this.move = move;
        this.result = result;
        this.gameBoardState = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
    }
}
exports.default = Game;
