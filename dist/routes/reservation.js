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
const mongodb_1 = require("mongodb");
const token_1 = require("../functions/auth/token");
const type_1 = require("../functions/auth/type");
const zod_1 = require("zod");
const reservation_1 = require("../functions/create/reservation");
const router = (0, express_1.Router)();
const PostNewWonderParams = zod_1.z.object({
    id: zod_1.z.coerce.number(),
});
const PostNewWonderBody = zod_1.z.object({
    time: zod_1.z.string(),
    data: zod_1.z.object({
        phoneNumber: zod_1.z.boolean().optional(),
        email: zod_1.z.boolean().optional(),
    }),
});
router.post("/new/wonder/:id", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // parse token
    const userObjectId = new mongodb_1.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db
        .collection("user")
        .findOne({ _id: userObjectId });
    if (!user)
        throw new Error("User not found");
    // find wonder
    const { id: wonderId } = PostNewWonderParams.parse(req.params);
    const wonder = yield db.collection("wonder").findOne({
        id: wonderId,
    });
    if (!wonder)
        throw new Error("Wonder not found");
    // create reservation
    const { time, data: dataField } = PostNewWonderBody.parse(req.body);
    const data = {};
    if (dataField.phoneNumber)
        data.phoneNumber = user.phoneNumber;
    if (dataField.email)
        data.email = user.email;
    const reservation = (0, reservation_1.createReservation)(new Date(time), data, user._id, wonder._id);
    // insert reservation
    const insertResult = yield db
        .collection("reservation")
        .insertOne(reservation);
    if (!insertResult.acknowledged)
        throw new Error("Reservation insert failed");
    // update user
    const updateUserResult = yield db.collection("user").updateOne({ _id: userObjectId }, {
        $addToSet: { reservedWonders: insertResult.insertedId },
    });
    if (!updateUserResult.acknowledged)
        throw new Error("User update failed");
    // update wonder
    const updateWonderResult = yield db
        .collection("wonder")
        .updateOne({ id: wonderId }, { $addToSet: { reservations: insertResult.insertedId } });
    if (!updateWonderResult.acknowledged)
        throw new Error("Wonder update failed");
    res.status(200).json({ message: "success" });
})));
exports.default = router;
