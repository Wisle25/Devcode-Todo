"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    production: {
        username: process.env.MYSQL_USER || "",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DBNAME || "",
        host: process.env.MYSQL_HOST || "",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
};
