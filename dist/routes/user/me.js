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
const mongodb_1 = require("mongodb");
const connect_1 = __importDefault(require("../../db/connect"));
const token_1 = require("../../functions/auth/token");
const user_1 = __importDefault(require("../../functions/parse/user"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check db health
        const database = (0, connect_1.default)();
        if (!database)
            throw new Error("DB");
        // parse token
        const token = req.headers.authorization;
        if (!token)
            throw new Error("token is required");
        // verify token
        const internalId = (0, token_1.verifyToken)(req.headers.authorization)
            ._id;
        if (!internalId)
            throw new Error("internalId is required");
        // get user
        const user = yield user_1.default.objectId(database)(new mongodb_1.ObjectId(internalId));
        if (!user)
            throw new Error("user not found");
        // return data
        res.status(200).json({
            id: user.id,
            name: user.name,
            nickname: user.nickname,
            email: user.email,
            profileImage: user.profileImage,
            ownedCreators: user.ownedCreators,
        });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
}));
router.get("/detail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check db health
        const database = (0, connect_1.default)();
        if (!database)
            throw new Error("DB");
        // parse token
        const token = req.headers.authorization;
        if (!token)
            throw new Error("token is required");
        // verify token
        const internalId = (0, token_1.verifyToken)(req.headers.authorization)
            ._id;
        if (!internalId)
            throw new Error("internalId is required");
        // get user
        const user = yield user_1.default.objectId(database)(new mongodb_1.ObjectId(internalId));
        if (!user)
            throw new Error("user not found");
        // return data
        res.status(200).json(user);
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
}));
exports.default = router;
