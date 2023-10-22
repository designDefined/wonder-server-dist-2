"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservation = void 0;
const uniqueId_1 = require("../uniqueId");
const createReservation = (time, data, userObjectId, wonderObjectId) => {
    const id = uniqueId_1.unique.reservationId();
    const date = new Date();
    return {
        id,
        time,
        data,
        user: userObjectId,
        wonder: wonderObjectId,
        dateInformation: {
            createdAt: date,
            lastModifiedAt: date,
        },
    };
};
exports.createReservation = createReservation;
