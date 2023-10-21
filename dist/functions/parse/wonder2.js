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
const creator_1 = __importDefault(require("./creator"));
const summary = (db) => ({ id, title, genre, thumbnail, summary, schedule, location, creator, likedUsers, }) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = { genre, status: "reserveNow" };
    const creatorSchema = yield db
        .collection("creator")
        .findOne({ _id: creator });
    if (!creatorSchema)
        throw new Error("Creator not found");
    const creatorSummary = creator_1.default.summary(creatorSchema);
    return {
        id,
        title,
        tag,
        thumbnail,
        summary,
        schedule,
        location,
        creator: creatorSummary,
        likedUsers,
    };
});
const display = (db) => ({ id, title, genre, thumbnail, summary, content, schedule, location, reservationProcess, creator, likedUsers, }) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = { genre, status: "reserveNow" };
    const creatorSchema = yield db
        .collection("creator")
        .findOne({ _id: creator });
    if (!creatorSchema)
        throw new Error("Creator not found");
    return {
        id,
        title,
        tag,
        thumbnail,
        summary,
        content,
        schedule,
        location,
        reservationProcess,
        creator: creator_1.default.summary(creatorSchema),
        likedUsers,
    };
});
const parseWonderTo = {
    summary,
    display,
};
exports.default = parseWonderTo;
