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
const removeNull_1 = require("../null/removeNull");
const wonder_1 = __importDefault(require("./wonder"));
const reservation_1 = __importDefault(require("./reservation"));
const creator_1 = __importDefault(require("./creator"));
const schema = (db) => (userSchema) => __awaiter(void 0, void 0, void 0, function* () {
    const creatorSchemas = yield db
        .collection("creator")
        .find({ id: { $in: userSchema.ownedCreators } })
        .toArray();
    const ownedCreators = (yield Promise.all(creatorSchemas.map(creator_1.default.schema(db)))).filter(removeNull_1.notEmpty);
    const likedWonders = yield wonder_1.default.ids(db)(userSchema.likedWonders);
    const reservedWonders = yield reservation_1.default.ids(db)(userSchema.reservedWonders);
    const ticketBook = yield reservation_1.default.ids(db)(userSchema.ticketBook);
    return Object.assign(Object.assign({}, userSchema), { ownedCreators,
        likedWonders,
        reservedWonders,
        ticketBook });
});
const objectId = (db) => (objectId) => __awaiter(void 0, void 0, void 0, function* () {
    const userSchema = yield db
        .collection("user")
        .findOne({ _id: objectId });
    if (!userSchema)
        return null;
    const user = yield schema(db)(userSchema);
    return user;
});
const parseUserFrom = { schema, objectId };
exports.default = parseUserFrom;
