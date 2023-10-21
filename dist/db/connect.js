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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.dbClient = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let conn = null;
exports.dbClient = null;
const connectURI = process.env.ATLAS_URI || "no";
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!conn) {
            conn = yield new mongodb_1.MongoClient(connectURI).connect();
            exports.dbClient = conn.db("wonder");
            console.log("MongoDB connected!!");
        }
    }
    catch (e) {
        console.error(e);
        throw e;
    }
});
exports.connectDB = connectDB;
const db = () => exports.dbClient;
exports.default = db;
