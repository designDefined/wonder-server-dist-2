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
const dayjs_1 = __importDefault(require("dayjs"));
const creator_1 = __importDefault(require("./creator"));
const removeNull_1 = require("../null/removeNull");
const schema = (db) => (wonderSchema) => __awaiter(void 0, void 0, void 0, function* () {
    const creator = yield creator_1.default.objectId(db)(wonderSchema.creator);
    if (!creator)
        return null;
    const schedule = wonderSchema.schedule.map((dateString) => (0, dayjs_1.default)(dateString).toDate());
    return Object.assign(Object.assign({}, wonderSchema), { creator,
        schedule, tag: { genre: wonderSchema.genre, status: "reserveNow" } });
});
const id = (db) => (id) => __awaiter(void 0, void 0, void 0, function* () {
    const wonderSchema = yield db
        .collection("wonder")
        .findOne({ id });
    if (!wonderSchema)
        return null;
    const wonder = yield schema(db)(wonderSchema);
    return wonder;
});
const ids = (db) => (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const wonderSchemas = yield db
        .collection("wonder")
        .find({ id: { $in: ids } })
        .toArray();
    return (yield Promise.all(wonderSchemas.map((data) => __awaiter(void 0, void 0, void 0, function* () { return yield schema(db)(data); })))).filter(removeNull_1.notEmpty);
});
const objectId = (db) => (objectId) => __awaiter(void 0, void 0, void 0, function* () {
    const wonderSchema = yield db
        .collection("wonder")
        .findOne({ _id: objectId });
    if (!wonderSchema)
        return null;
    const wonder = yield schema(db)(wonderSchema);
    return wonder;
});
const parseWonderFrom = {
    id,
    ids,
    objectId,
    schema,
};
exports.default = parseWonderFrom;
