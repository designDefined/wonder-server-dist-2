"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareNewReservation = exports.getUserFromReservation = exports.getWonderFromReservation = void 0;
const connect_1 = __importDefault(require("../db/connect"));
const mongodb_1 = require("../libs/flow/mongodb");
const uniqueId_1 = require("./uniqueId");
const getWonderFromReservation = (reservation) => (0, mongodb_1.dbFindOne)("wonder")({
    _id: reservation.wonder,
})((0, connect_1.default)());
exports.getWonderFromReservation = getWonderFromReservation;
const getUserFromReservation = (reservation) => (0, mongodb_1.dbFindOne)("user")({
    _id: reservation.user,
})((0, connect_1.default)());
exports.getUserFromReservation = getUserFromReservation;
const prepareNewReservationData = (newReservation, user) => {
    const data = {
        wonderId: newReservation.wonderId,
        userId: newReservation.userId,
    };
    newReservation.data.forEach((key) => {
        data[key] = user[key];
    });
    return data;
};
const prepareNewReservation = ({ wonderId, userId, time, data }, wonder, user) => ({
    id: uniqueId_1.unique.reservationId(),
    wonder: wonder._id,
    user: user._id,
    time,
    data: prepareNewReservationData({ wonderId, userId, time, data }, user),
    dateInformation: {
        createdAt: new Date(),
        lastModifiedAt: new Date(),
    },
});
exports.prepareNewReservation = prepareNewReservation;
