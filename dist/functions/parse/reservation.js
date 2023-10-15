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
const removeNull_1 = require("../null/removeNull");
const schema = (db) => (reservationSchema) => __awaiter(void 0, void 0, void 0, function* () {
    const wonder = yield wonder_1.default.objectId(db)(reservationSchema.wonder);
    if (!wonder)
        return null;
    return Object.assign(Object.assign({}, reservationSchema), { wonder });
});
const ids = (db) => (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const reservationSchemas = yield db
        .collection("reservation")
        .find({ id: { $in: ids } })
        .toArray();
    return (yield Promise.all(reservationSchemas.map(schema(db)))).filter(removeNull_1.notEmpty);
});
const parseReservationFrom = {
    schema,
    ids,
};
exports.default = parseReservationFrom;
