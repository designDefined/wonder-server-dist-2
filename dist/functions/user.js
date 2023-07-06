"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserWithEmail = exports.prepareNewUser = exports.toUserLoggedIn = void 0;
const samples_1 = require("./samples");
const uniqueId_1 = require("./uniqueId");
const toUserLoggedIn = (user, token) => ({
    id: user.id,
    name: user.name,
    nickname: user.nickname,
    profileImage: user.profileImage,
    howManyCreatorsOwned: user.ownedCreators.length,
    needRegister: false,
    token,
});
exports.toUserLoggedIn = toUserLoggedIn;
const prepareNewUser = ({ name, phoneNumber, email, socialId, }) => {
    return {
        id: uniqueId_1.unique.userId(),
        platformType: "TEST",
        socialId,
        name,
        nickname: "새 유저",
        phoneNumber,
        email,
        profileImage: samples_1.sampleImageURL.user(),
        dateInformation: { createdAt: new Date(), lastModifiedAt: new Date() },
        reservedWonders: [],
        likedWonders: [],
        ticketBook: [],
        ownedCreators: [],
    };
};
exports.prepareNewUser = prepareNewUser;
const toUserWithEmail = (user) => ({
    id: user.id,
    nickname: user.nickname,
    profileImage: user.profileImage,
    email: user.email,
});
exports.toUserWithEmail = toUserWithEmail;
