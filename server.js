"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const Player_1 = __importDefault(require("./Player/Player"));
const Game_1 = __importDefault(require("./Game/Game"));
const usersOnline_1 = __importDefault(require("./data/usersOnline"));
const activeGames_1 = __importDefault(require("./data/activeGames"));
const excepsions_1 = require("./Excepsions/excepsions");
const GameLogic_1 = require("./Game/GameLogic");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});
app.use(express_1.default.json());
const usersOnline = new usersOnline_1.default();
const activeGames = new activeGames_1.default();
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username || usersOnline.getAll().includes(username)) {
        next(new Error(excepsions_1.exceptions.UserAlreadyOnline));
    }
    else {
        socket.username = username;
        next();
    }
});
io.on("connection", (socket) => {
    const user = socket.handshake.auth.username;
    const joinToGame = (gameId) => {
        socket.join(gameId);
    };
    const callException = (message) => {
        socket.emit("exception", message);
    };
    const callConnectToGame = (gameId, game) => {
        socket.emit("connect to game", game);
        socket.to(gameId).emit("game action", game);
    };
    usersOnline.setItem(user);
    socket.emit("login");
    socket.on("user active game", () => {
        const userGame = activeGames
            .getAll()
            .find((game) => { var _a; return game.playerOne.name === user || ((_a = game.playerTwo) === null || _a === void 0 ? void 0 : _a.name) === user; });
        socket.emit("user active game", (userGame === null || userGame === void 0 ? void 0 : userGame.gameId) || "");
    });
    socket.on("connect to game", (gameId) => {
        const availdableUsersGames = activeGames
            .getAll()
            .find((item) => { var _a; return item.playerOne.name === user || ((_a = item.playerTwo) === null || _a === void 0 ? void 0 : _a.name) === user; });
        if (availdableUsersGames && gameId !== availdableUsersGames.gameId) {
            callException(excepsions_1.exceptions.YouAlredyInGame);
        }
        else {
            const game = activeGames.getItem(gameId);
            if (game) {
                if (game.playerOne.name === user) {
                    joinToGame(gameId);
                    callConnectToGame(gameId, game);
                }
                else if (!game.playerTwo) {
                    game.playerTwo = new Player_1.default(user, "O", true);
                    joinToGame(gameId);
                    callConnectToGame(gameId, game);
                }
                else if (game.playerTwo.name === user) {
                    joinToGame(gameId);
                    callConnectToGame(gameId, game);
                }
                else {
                    callException(excepsions_1.exceptions.HaveNotAcessToGame);
                }
            }
            else {
                activeGames.setItem(new Game_1.default(gameId, new Player_1.default(user, "X", true), null, "X", null));
                joinToGame(gameId);
                callConnectToGame(gameId, activeGames.getItem(gameId));
            }
        }
    });
    socket.on("reset game", (gameId) => {
        let game = activeGames.getItem(gameId);
        if (!game) {
            callException(excepsions_1.exceptions.GameDoesNotExist);
        }
        else {
            game.gameBoardState = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
            ];
            game.move = "X";
            game.result = null;
            socket.emit("game action", game);
            socket.to(gameId).emit("game action", game);
        }
    });
    socket.on("game action", ({ gameId, move }) => {
        let game = activeGames.getItem(gameId);
        if (!game) {
            callException(excepsions_1.exceptions.GameDoesNotExist);
        }
        else {
            game.playerOne.isOnline = !!usersOnline.getItem(game.playerOne.name);
            if (game.playerTwo) {
                game.playerTwo.isOnline = !!usersOnline.getItem(game.playerTwo.name);
            }
            let nextMove = game.move === "X" ? "O" : "X";
            if (game.move === move.marker) {
                if (!game.gameBoardState[move.cellIndex.row][move.cellIndex.pos]) {
                    game.gameBoardState[move.cellIndex.row][move.cellIndex.pos] = move.marker;
                    game.move = nextMove;
                }
            }
            const hasWinner = (0, GameLogic_1.checkWinner)(game.gameBoardState);
            if (hasWinner) {
                game.result = game.move === "X" ? "O" : "X";
            }
            socket.emit("game action", game);
            socket.to(gameId).emit("game action", game);
        }
    });
    socket.on("destroy game", (gameId) => {
        let game = activeGames.getItem(gameId);
        if (!game) {
            callException(excepsions_1.exceptions.GameDoesNotExist);
        }
        else {
            activeGames.removeItem(gameId);
            socket.emit("destroy game");
            socket.to(gameId).emit("destroy game");
        }
    });
    socket.on("disconnect", (a) => {
        usersOnline.removeItem(user);
    });
});
server.listen(3000, () => {
    console.log("listening on *:3000");
});
