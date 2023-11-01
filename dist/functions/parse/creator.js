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
const wonder_1 = __importDefault(require("./wonder"));
const summary = ({ id, name, summary, profileImage, instagram, }) => ({
    id,
    name,
    summary,
    profileImage,
    instagram,
});
const display = (db) => ({ id, name, summary, profileImage, instagram, createdWonder, }) => __awaiter(void 0, void 0, void 0, function* () {
    const createdWonderSummaries = yield Promise.all((yield db
        .collection("wonder")
        // @ts-ignore
        .find({ id: { $in: createdWonder } })
        .toArray()).map(wonder_1.default.summary(db)));
    return {
        id,
        name,
        summary,
        profileImage,
        instagram,
        createdWonder: createdWonderSummaries,
        subscribedUsers: null,
    };
});
const parseCreatorTo = { summary, display };
exports.default = parseCreatorTo;
