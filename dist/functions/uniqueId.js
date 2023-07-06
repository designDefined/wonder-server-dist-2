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
exports.initUniqueId = exports.unique = void 0;
const connect_1 = __importDefault(require("../db/connect"));
const flow_1 = require("../libs/flow");
const mongodb_1 = require("../libs/flow/mongodb");
let creatorId = -999;
let wonderId = -999;
let userId = -999;
let reservationId = -999;
exports.unique = {
    creatorId: () => {
        creatorId++;
        return creatorId;
    },
    wonderId: () => {
        wonderId++;
        return wonderId;
    },
    userId: () => {
        userId++;
        return userId;
    },
    reservationId: () => {
        reservationId++;
        return reservationId;
    },
};
const initUniqueId = () => __awaiter(void 0, void 0, void 0, function* () {
    const creator = yield (0, mongodb_1.dbFindLastOne)("creator")()((0, connect_1.default)());
    const user = yield (0, mongodb_1.dbFindLastOne)("user")()((0, connect_1.default)());
    const wonder = yield (0, mongodb_1.dbFindLastOne)("wonder")()((0, connect_1.default)());
    const reservation = yield (0, mongodb_1.dbFindLastOne)("reservation")()((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(creator) ||
        (0, flow_1.isErrorReport)(user) ||
        (0, flow_1.isErrorReport)(wonder) ||
        (0, flow_1.isErrorReport)(reservation)) {
        console.log("uniqueId initializing failed, retry");
        setTimeout(exports.initUniqueId, 1000);
        return false;
    }
    creatorId = creator.id;
    userId = user.id;
    wonderId = wonder.id;
    reservationId = reservation.id;
    console.log("uniqueId initialized");
    console.log(`creator_id: ${creatorId}`);
    console.log(`user_id: ${userId}`);
    console.log(`wonder_id: ${wonderId}`);
    console.log(`reservation_id: ${reservationId}`);
    return true;
});
exports.initUniqueId = initUniqueId;
