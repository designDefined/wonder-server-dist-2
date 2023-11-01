"use strict";
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
const express_1 = require("express");
const token_1 = require("../../functions/auth/token");
const wrapAsync_1 = __importDefault(require("../../errors/wrapAsync"));
const type_1 = require("../../functions/auth/type");
const user_1 = __importDefault(require("../../functions/parse/user"));
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
router.get("/", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // parse token
    const _id = new mongodb_1.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db.collection("user").findOne({ _id });
    if (!user)
        throw new Error("User not found");
    const userMySummary = yield user_1.default.mySummary(db)(user);
    res.status(200).json(userMySummary);
})));
router.get("/detail", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // parse token
    const _id = new mongodb_1.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db.collection("user").findOne({ _id });
    if (!user)
        throw new Error("User not found");
    const userDisplay = yield user_1.default.display(db)(user);
    res.status(200).json(userDisplay);
})));
const PutNameBody = zod_1.z.object({
    name: zod_1.z.string().max(15),
});
router.put("/name", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // parse token
    const _id = new mongodb_1.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db.collection("user").findOne({ _id });
    if (!user)
        throw new Error("User not found");
    const { name } = PutNameBody.parse(req.body);
    const updateUserResult = yield db.collection("user").updateOne({ _id }, {
        $set: { name },
    });
    if (!updateUserResult.acknowledged)
        throw new Error("User update failed");
    res.status(200).json({ name });
})));
const PutPhoneBody = zod_1.z.object({
    phoneNumber: zod_1.z.string().max(15),
});
router.put("/phone", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // parse token
    const _id = new mongodb_1.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db.collection("user").findOne({ _id });
    if (!user)
        throw new Error("User not found");
    const { phoneNumber } = PutPhoneBody.parse(req.body);
    const updateUserResult = yield db.collection("user").updateOne({ _id }, {
        $set: { phoneNumber },
    });
    if (!updateUserResult.acknowledged)
        throw new Error("User update failed");
    res.status(200).json({ name });
})));
exports.default = router;
