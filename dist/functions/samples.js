"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleImageURL = void 0;
const baseS3URL = "https://wonder-image-test.s3.ap-northeast-2.amazonaws.com/";
exports.sampleImageURL = {
    user: () => ({
        src: `${baseS3URL}sample/no_profile.png`,
        altText: "sample user thumbnail",
    }),
    userWithProfile: (id) => ({
        src: `${baseS3URL}user/user_profile_${id}.png`,
        altText: "sample user thumbnail",
    }),
    creator: () => ({
        src: `${baseS3URL}sample/no_profile.png`,
        altText: "sample creator thumbnail",
    }),
    creatorWithProfile: (id) => ({
        src: `${baseS3URL}creator/creator_profile_${id}.png`,
        altText: "sample creator thumbnail",
    }),
    wonderWithThumbnail: (id) => ({
        src: `${baseS3URL}wonder/wonder_thumbnail_${id}.png`,
        altText: "sample wonder thumbnail",
    }),
};
