"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareNewCreator = exports.toOwnedCreator = exports.toCreatorInWonderDetail = exports.toCreatorInWonderCard = void 0;
const samples_1 = require("./samples");
const uniqueId_1 = require("./uniqueId");
const toCreatorInWonderCard = (creator) => ({
    id: creator.id,
    name: creator.name,
    profileImage: creator.profileImage,
});
exports.toCreatorInWonderCard = toCreatorInWonderCard;
const toCreatorInWonderDetail = (creator) => ({
    id: creator.id,
    name: creator.name,
    profileImage: creator.profileImage,
    subscribed: false,
});
exports.toCreatorInWonderDetail = toCreatorInWonderDetail;
const toOwnedCreator = (creator) => ({
    id: creator.id,
    name: creator.name,
    profileImage: creator.profileImage,
});
exports.toOwnedCreator = toOwnedCreator;
const prepareNewCreator = ({ name, summary, instagram }, userId) => ({
    id: uniqueId_1.unique.creatorId(),
    name,
    summary,
    owner: userId,
    profileImage: samples_1.sampleImageURL.creator(),
    dateInformation: { createdAt: new Date(), lastModifiedAt: new Date() },
    createdWonder: [],
    subscribedUsers: [],
    instagram,
});
exports.prepareNewCreator = prepareNewCreator;
