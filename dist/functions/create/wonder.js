"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWonder = void 0;
const uniqueId_1 = require("../uniqueId");
const createWonder = ({ title, summary, content, genre, thumbnail, schedule, location, isReservationRequired, reservationProcess, }, creatorId) => {
    return {
        id: uniqueId_1.unique.wonderId(),
        title,
        summary,
        content,
        genre,
        thumbnail,
        schedule,
        location,
        reservationProcess,
        dateInformation: {
            createdAt: new Date(),
            lastModifiedAt: new Date(),
        },
        creator: creatorId,
        likedUsers: [],
        reservations: [],
    };
};
exports.createWonder = createWonder;
