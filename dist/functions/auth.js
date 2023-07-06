"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUserLenient = exports.authorizeUser = exports.authedHeader = exports.emptyHeader = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const connect_1 = __importDefault(require("../db/connect"));
const flow_1 = require("../libs/flow");
const mongodb_1 = require("../libs/flow/mongodb");
const mongodb_2 = require("mongodb");
exports.emptyHeader = [];
exports.authedHeader = ["authorization"];
exports.authorizeUser = (0, flow_1.setContext)((f) => {
    try {
        const result = (0, jsonwebtoken_1.verify)(f.context.authorization, "testSecret");
        const userId = new mongodb_2.ObjectId(result._id);
        if (result.type !== "user")
            return (0, flow_1.raiseScenarioError)(500, "유저 토큰이 아닙니다")(f);
        const user = (0, mongodb_1.dbFindOne)("user")({ _id: userId })((0, connect_1.default)());
        return (0, flow_1.isErrorReport)(user) ? (0, flow_1.raiseScenarioErrorWithReport)(user)(f) : user;
    }
    catch (e) {
        console.log(e);
        return (0, flow_1.raiseScenarioError)(500, "토큰이 유효하지 않습니다")(f);
    }
})("authedUser");
exports.authorizeUserLenient = (0, flow_1.setContext)((f) => {
    if (!f.req.headers.authorization)
        return "no_user";
    try {
        const { type, _id } = (0, jsonwebtoken_1.verify)(f.req.headers.authorization, "testSecret");
        const userId = new mongodb_2.ObjectId(_id);
        if (type !== "user")
            return "no_user";
        const user = (0, mongodb_1.dbFindOne)("user")({ _id: userId })((0, connect_1.default)());
        return (0, flow_1.isErrorReport)(user) ? "no_user" : user;
    }
    catch (e) {
        return "no_user";
    }
})("authedUser");
