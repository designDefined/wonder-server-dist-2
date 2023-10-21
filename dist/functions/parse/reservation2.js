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
const wonder2_1 = __importDefault(require("./wonder2"));
const user2_1 = __importDefault(require("./user2"));
const forUser = (db) => ({ id, time, data, wonder, }) => __awaiter(void 0, void 0, void 0, function* () {
    const wonderSchema = yield db.collection("wonder").findOne({
        _id: wonder,
    });
    if (!wonderSchema)
        throw new Error("Wonder not found");
    const wonderSummary = yield wonder2_1.default.summary(db)(wonderSchema);
    return {
        id,
        time,
        data,
        wonder: wonderSummary,
    };
});
const forCreator = (db) => ({ id, time, data, wonder, }) => __awaiter(void 0, void 0, void 0, function* () {
    const userSchema = yield db.collection("user").findOne({
        _id: wonder,
    });
    if (!userSchema)
        throw new Error("User not found");
    const userSummary = user2_1.default.summary(userSchema);
    return {
        id,
        time,
        data,
        user: userSummary,
    };
});
const parseReservationTo = {
    forUser,
    forCreator,
};
exports.default = parseReservationTo;
