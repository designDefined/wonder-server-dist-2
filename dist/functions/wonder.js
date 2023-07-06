"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareNewWonder = exports.prepareWonderTag = exports.toWonderSummaryReservation = exports.toWonderSummaryTitleOnly = exports.toWonderDetail = exports.toWonderCard = void 0;
const toWonderCard = (wonder, creator) => ({
    id: wonder.id,
    title: wonder.title,
    thumbnail: wonder.thumbnail,
    creator,
});
exports.toWonderCard = toWonderCard;
const toWonderDetail = (wonder, creator, liked, reserved) => ({
    id: wonder.id,
    title: wonder.title,
    thumbnail: wonder.thumbnail,
    tags: wonder.tags,
    summary: wonder.summary,
    content: wonder.content,
    schedule: wonder.schedule,
    location: wonder.location,
    dateInformation: wonder.dateInformation,
    reservationProcess: wonder.reservationProcess,
    creator,
    liked,
    reserved,
});
exports.toWonderDetail = toWonderDetail;
const toWonderSummaryTitleOnly = (wonder) => ({
    id: wonder.id,
    title: wonder.title,
    thumbnail: wonder.thumbnail,
});
exports.toWonderSummaryTitleOnly = toWonderSummaryTitleOnly;
const toWonderSummaryReservation = (wonder, time) => ({
    id: wonder.id,
    title: wonder.title,
    thumbnail: wonder.thumbnail,
    location: wonder.location,
    reservedTime: time,
});
exports.toWonderSummaryReservation = toWonderSummaryReservation;
const primaryTag = [];
const prepareWonderTag = (input) => input.map((tag) => primaryTag.includes(tag)
    ? { isPrimary: true, value: tag }
    : { isPrimary: false, value: tag });
exports.prepareWonderTag = prepareWonderTag;
const prepareNewWonder = (wonder, creatorId, presigedId, presignedThumbnail) => ({
    id: presigedId,
    title: wonder.title,
    tags: (0, exports.prepareWonderTag)(wonder.tags),
    thumbnail: presignedThumbnail,
    creator: creatorId,
    summary: wonder.summary,
    content: wonder.content,
    schedule: wonder.schedule,
    location: wonder.location,
    dateInformation: {
        createdAt: new Date(),
        lastModifiedAt: new Date(),
    },
    reservationProcess: wonder.reservationProcess,
    likedUsers: [],
    reservations: [],
});
exports.prepareNewWonder = prepareNewWonder;