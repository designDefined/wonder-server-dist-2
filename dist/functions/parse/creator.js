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
const schema = (db) => (creatorSchema) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = yield db
        .collection("user")
        .findOne({ _id: creatorSchema.owner });
    const createdWonder = (yield wonder_1.default.ids(db)(creatorSchema.createdWonder)).filter(removeNull_1.notEmpty);
    if (!owner)
        return null;
    return Object.assign(Object.assign({}, creatorSchema), { owner: owner._id, createdWonder });
});
const objectId = (db) => (objectId) => __awaiter(void 0, void 0, void 0, function* () {
    const creatorSchema = yield db
        .collection("creator")
        .findOne({ _id: objectId });
    if (!creatorSchema)
        return null;
    const creator = yield schema(db)(creatorSchema);
    return creator;
});
const parseCreatorFrom = {
    objectId,
    schema,
};
exports.default = parseCreatorFrom;
