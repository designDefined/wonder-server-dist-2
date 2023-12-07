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
const wrapAsync_1 = __importDefault(require("../errors/wrapAsync"));
const wonder_1 = __importDefault(require("../functions/parse/wonder"));
const zod_1 = require("zod");
const sortWonder_1 = __importDefault(require("../functions/aggregation/sortWonder"));
const mongodb_1 = require("mongodb");
const token_1 = require("../functions/auth/token");
const type_1 = require("../functions/auth/type");
const wonder_2 = require("../functions/create/wonder");
const router = (0, express_1.Router)();
/**
 * GET "/wonder/list"
 */
const GetListQuery = zod_1.z.object({
    filter: zod_1.z.record(zod_1.z.unknown()).optional().default({}),
    text: zod_1.z.record(zod_1.z.unknown()).optional(),
    sort: zod_1.z.enum(["like", "created"]).optional().default("created"),
    status: zod_1.z.enum(["now", "reserveNow"]).optional(),
});
router.get("/list", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // find wonder
    const { filter, text, sort, status } = GetListQuery.parse(req.query);
    const data = yield db
        .collection("wonder")
        .aggregate([
        ...(text ? [{ $search: text }] : []),
        { $match: filter },
        ...sortWonder_1.default.by(sort),
    ])
        .toArray();
    const wonderSummaries = yield Promise.all(data.map(wonder_1.default.summary(db)));
    if (status) {
        const filteredWonder = wonderSummaries.filter((wonder) => wonder.tag.status === status);
        res.status(200).json(filteredWonder);
        return;
    }
    res.status(200).json(wonderSummaries);
})));
const GetDetailParams = zod_1.z.object({
    id: zod_1.z.coerce.number(),
});
/**
 * GET "/wonder/detail/:id"
 */
router.get("/detail/:id", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // find wonder
    const { id } = GetDetailParams.parse(req.params);
    const data = yield db.collection("wonder").findOne({
        id,
    });
    if (!data)
        throw new Error("Invalid wonder id");
    const wonderDisplay = yield wonder_1.default.display(db)(data);
    res.status(200).json(wonderDisplay);
})));
/**
 * POST "/wonder/like/:id"
 */
const PostLikeQuery = zod_1.z.object({
    is: zod_1.z.boolean(),
});
router.post("/like/:id", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // parse token
    const _id = new mongodb_1.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db.collection("user").findOne({ _id });
    if (!user)
        throw new Error("User not found");
    // update wonder
    const { is } = PostLikeQuery.parse(req.query);
    const { id } = GetDetailParams.parse(req.params);
    const updateWonderResult = yield db
        .collection("wonder")
        .updateOne({ id }, is
        ? {
            $addToSet: { likedUsers: user.id },
        }
        : { $pull: { likedUsers: user.id } });
    if (updateWonderResult.modifiedCount !== 1)
        throw new Error("Wonder update failed");
    // update user
    const updateUserResult = yield db.collection("user").updateOne({ _id }, is
        ? {
            $addToSet: { likedWonders: id },
        }
        : { $pull: { likedWonders: id } });
    if (updateUserResult.modifiedCount !== 1)
        throw new Error("User update failed");
    res.status(200).json({ message: "success" });
})));
router.post("/new", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // parse token
    const userObjectId = new mongodb_1.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db
        .collection("user")
        .findOne({ _id: userObjectId });
    if (!user)
        throw new Error("User not found");
    const data = req.body;
    const wonder = (0, wonder_2.createWonder)(data, user.ownedCreators[0]);
    const insertResult = yield db.collection("wonder").insertOne(wonder);
    if (!insertResult.acknowledged)
        throw new Error("Creator insert failed");
    // update creator
    const updateResult = yield db
        .collection("creator")
        .updateOne({ _id: user.ownedCreators[0] }, {
        $push: { createdWonder: insertResult.insertedId },
    });
    if (!updateResult.acknowledged)
        throw new Error("User update failed");
    res.status(200).json({ wonderId: wonder.id });
})));
exports.default = router;
