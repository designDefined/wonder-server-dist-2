"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    platformType: { type: String, required: true },
    platformId: { type: String, required: true },
    name: String,
    nickname: String,
    phoneNumber: String,
    email: { type: String, required: true },
    created_at: { type: Date, required: true },
    last_modified_at: { type: Date, required: true },
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
