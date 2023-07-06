"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-call */
//@ts-nocheck
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
exports.uploadThumbnail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const flow_1 = require("../libs/flow");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_presigned_post_1 = require("@aws-sdk/s3-presigned-post");
dotenv_1.default.config();
const uploadThumbnail = (file, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const accessKey = (_a = process.env.AWS_ACCESS_KEY) !== null && _a !== void 0 ? _a : "";
    const secretKey = (_b = process.env.AWS_SECRET_KEY) !== null && _b !== void 0 ? _b : "";
    const bucketName = (_c = process.env.AWS_BUCKET_NAME) !== null && _c !== void 0 ? _c : "";
    const client = new client_s3_1.S3Client({
        region: "ap-northeast-2",
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        },
    });
    const s3 = new aws_sdk_1.default.S3();
    const presigned = yield (0, s3_presigned_post_1.createPresignedPost)(client, {
        Bucket: bucketName,
        Key: fileName,
        Fields: { key: fileName },
        Expires: 60,
        Conditions: [
            { bucket: bucketName },
            ["content-length-range", 0, 1048576], //파일용량 1MB 까지 제한
        ],
    });
    const formData = new FormData();
    Object.entries(Object.assign(Object.assign({}, presigned.fields), { file })).forEach(([key, value]) => {
        formData.append(key, value);
    });
    const result = yield fetch(presigned.url, {
        method: "POST",
        body: formData,
    });
    if (result.ok) {
        return result.url + "/" + fileName;
    }
    else {
        return (0, flow_1.raiseSimpleError)(500, "이미지 업로드 실패");
    }
});
exports.uploadThumbnail = uploadThumbnail;
