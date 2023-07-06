"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleImageURL = void 0;
const baseS3URL = "https://wonder-image-test.s3.ap-northeast-2.amazonaws.com/";
exports.sampleImageURL = {
    user: () => ({
        src: `${baseS3URL}sample/no_profile.png`,
        altText: "sample user thumbnail",
    }),
    creator: () => ({
        src: `${baseS3URL}sample/no_profile.png`,
        altText: "sample creator thumbnail",
    }),
};
