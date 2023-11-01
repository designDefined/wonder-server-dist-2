"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCreator = void 0;
const samples_1 = require("../samples");
const uniqueId_1 = require("../uniqueId");
const createCreator = ({ name, summary, instagram, }, userId, date) => ({
    id: uniqueId_1.unique.creatorId(),
    name,
    summary,
    owner: userId,
    profileImage: samples_1.sampleImageURL.creator(),
    dateInformation: { createdAt: date, lastModifiedAt: date },
    createdWonder: [],
    subscribedUsers: [],
    instagram,
});
exports.createCreator = createCreator;
