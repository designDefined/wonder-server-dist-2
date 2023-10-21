"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHeader = exports.UserToken = void 0;
const zod_1 = require("zod");
exports.UserToken = zod_1.z.object({
    type: zod_1.z.literal("user"),
    _id: zod_1.z.string(),
});
exports.AuthHeader = zod_1.z.object({
    authorization: zod_1.z.string(),
});
