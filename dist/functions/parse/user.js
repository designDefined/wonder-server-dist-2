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
const wonder_1 = __importDefault(require("./wonder"));
const ramda_1 = require("ramda");
const reservation_1 = __importDefault(require("./reservation"));
const summary = ({ id, name, profileImage }) => ({
    id,
    name,
    profileImage,
});
const mySummary = (db) => ({ id, name, profileImage, ownedCreators, }) => __awaiter(void 0, void 0, void 0, function* () {
    const ownedCreatorSummaries = (yield db
        .collection("creator")
        .find({ _id: { $in: ownedCreators } })
        .toArray()).map(creator_1.default.summary);
    return {
        id,
        name,
        profileImage,
        ownedCreators: ownedCreatorSummaries,
    };
});
const display = (db) => ({ id, nickname, platformType, profileImage, name, phoneNumber, email, ownedCreators, likedWonders, reservedWonders, ticketBook, }) => __awaiter(void 0, void 0, void 0, function* () {
    const ownedCreatorSummaries = yield (0, ramda_1.pipe)((database) => database
        .collection("creator")
        .find({ _id: { $in: ownedCreators } })
        .toArray(), (0, ramda_1.andThen)((0, ramda_1.map)(creator_1.default.summary)))(db);
    const likedWonderSummaries = yield (0, ramda_1.pipe)((database) => database
        .collection("wonder")
        .find({ id: { $in: likedWonders } })
        .toArray(), (0, ramda_1.andThen)((0, ramda_1.map)(wonder_1.default.summary(db))), (0, ramda_1.andThen)((data) => Promise.all(data)))(db);
    const reservedWondersForUser = yield (0, ramda_1.pipe)((database) => database
        .collection("reservation")
        .find({ _id: { $in: reservedWonders } })
        .toArray(), (0, ramda_1.andThen)((0, ramda_1.map)(reservation_1.default.forUser(db))), (0, ramda_1.andThen)((data) => Promise.all(data)))(db);
    const ticketBookForUser = yield (0, ramda_1.pipe)((database) => database
        .collection("reservation")
        .find({ _id: { $in: ticketBook } })
        .toArray(), (0, ramda_1.andThen)((0, ramda_1.map)(reservation_1.default.forUser(db))), (0, ramda_1.andThen)((data) => Promise.all(data)))(db);
    return {
        id,
        nickname,
        platformType,
        name,
        phoneNumber,
        email,
        profileImage,
        ownedCreators: ownedCreatorSummaries,
        likedWonders: likedWonderSummaries,
        reservedWonders: reservedWondersForUser,
        ticketBook: ticketBookForUser,
    };
});
const parseUserTo = { summary, mySummary, display };
exports.default = parseUserTo;
