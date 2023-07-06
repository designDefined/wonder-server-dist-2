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
exports.router = void 0;
const express_1 = require("express");
const express_2 = __importDefault(require("../libs/flow/express"));
const flow_1 = require("../libs/flow");
const mongodb_1 = require("../libs/flow/mongodb");
const connect_1 = __importDefault(require("../db/connect"));
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = require("../functions/user");
const auth_1 = require("../functions/auth");
const validator_1 = require("../functions/validator");
const creator_1 = require("../functions/creator");
const reservation_1 = require("../functions/reservation");
const wonder_1 = require("../functions/wonder");
const utility_1 = require("../functions/utility");
exports.router = (0, express_1.Router)();
exports.router.post("/login", (0, express_2.default)((0, flow_1.extractBody)({ code: "" }), (0, flow_1.setData)((f) => (0, mongodb_1.dbFindOne)("user")({ email: f.context.body.code })((0, connect_1.default)())), (0, flow_1.cutData)("_id")));
exports.router.post("/testLogin", (0, express_2.default)((0, flow_1.extractBody)({ email: "" }), (0, flow_1.setData)((f) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, mongodb_1.dbFindOne)("user")({
        platformType: "TEST",
        email: f.context.body.email,
    })((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(result)) {
        return { needRegister: true, email: f.context.body.email };
    }
    const token = (0, jsonwebtoken_1.sign)({ type: "user", _id: result._id }, "testSecret");
    return (0, user_1.toUserLoggedIn)(result, token);
}))));
exports.router.post("/testRegister", (0, express_2.default)((0, flow_1.extractRequest)({
    params: [],
    query: ["access_token"],
    headers: auth_1.emptyHeader,
}), (0, flow_1.extractBody)({ email: "", name: "", phoneNumber: "" }), (0, flow_1.checkFlow)((f) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyExist = yield (0, mongodb_1.dbFindOne)("user")({
        platformType: "TEST",
        email: f.context.body.email,
    })((0, connect_1.default)());
    if (!(0, flow_1.isErrorReport)(alreadyExist)) {
        return (0, flow_1.raiseSimpleError)(500, "이미 존재하는 유저입니다");
    }
})), (0, flow_1.checkFlow)((f) => {
    const { email, name, phoneNumber } = f.context.body;
    const errors = [];
    if (!(0, validator_1.isValidRegisterEmail)(email))
        errors.push("이메일");
    if (!(0, validator_1.isValidRegisterName)(name))
        errors.push("이름");
    if (!(0, validator_1.isValidRegisterPhoneNumber)(phoneNumber))
        errors.push("전화번호");
    if (errors.length > 0) {
        return (0, flow_1.raiseSimpleError)(500, `${errors.join(", ")}이(가) 올바르지 않습니다`);
    }
}), (0, flow_1.setContext)(({ context: { body, access_token } }) => (Object.assign(Object.assign({}, body), { access_token })))("registerForm"), (0, flow_1.setData)((f) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phoneNumber, email } = f.context.registerForm;
    const newUser = (0, user_1.prepareNewUser)({
        name,
        phoneNumber,
        email,
        socialId: "test",
    });
    const id = yield (0, mongodb_1.dbInsertOne)("user")(newUser)((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(id)) {
        return (0, flow_1.raiseScenarioErrorWithReport)(id)(f);
    }
    const token = (0, jsonwebtoken_1.sign)({ type: "user", _id: id }, "testSecret");
    return (0, user_1.toUserLoggedIn)(newUser, token);
}))));
exports.router.post("/autoLogin", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, user_1.toUserLoggedIn)(f.context.authedUser, f.context.authorization))));
exports.router.get("/ownedCreator", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, mongodb_1.dbFind)("creator")({
    id: { $in: f.context.authedUser.ownedCreators },
})((0, connect_1.default)())), (0, flow_1.mapData)(creator_1.toOwnedCreator)));
exports.router.get("/myDetail", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, mongodb_1.dbFindOne)("user")({ _id: f.context.authedUser._id })((0, connect_1.default)())), (0, flow_1.setData)(({ data }) => (0, user_1.toUserWithEmail)(data))));
exports.router.get("/myWonderSummary", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        liked: null,
        reserved: null,
        ticketBook: null,
    };
    const liked = yield (0, mongodb_1.dbFindLastOne)("wonder")({
        id: { $in: f.context.authedUser.likedWonders },
    })((0, connect_1.default)());
    data.liked = (0, flow_1.isErrorReport)(liked) ? null : liked;
    const reserved = yield (0, mongodb_1.dbFindLastOne)("reservation")({
        id: { $in: f.context.authedUser.reservedWonders },
    })((0, connect_1.default)());
    if (!(0, flow_1.isErrorReport)(reserved)) {
        const reservedWonder = yield (0, reservation_1.getWonderFromReservation)(reserved);
        data.reserved = (0, flow_1.isErrorReport)(reservedWonder)
            ? null
            : (0, wonder_1.toWonderSummaryReservation)(reservedWonder, reserved.time);
    }
    const ticketBook = yield (0, mongodb_1.dbFindLastOne)("reservation")({
        id: { $in: f.context.authedUser.ticketBook },
    })((0, connect_1.default)());
    if (!(0, flow_1.isErrorReport)(ticketBook)) {
        const ticketBookWonder = yield (0, reservation_1.getWonderFromReservation)(ticketBook);
        data.ticketBook = (0, flow_1.isErrorReport)(ticketBookWonder)
            ? null
            : (0, wonder_1.toWonderSummaryReservation)(ticketBookWonder, ticketBook.time);
    }
    return data;
}))));
exports.router.get("/liked", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, mongodb_1.dbFind)("wonder")({
    id: { $in: f.context.authedUser.likedWonders },
})((0, connect_1.default)())), (0, flow_1.mapData)(wonder_1.toWonderSummaryTitleOnly)));
exports.router.get("/reserved", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, mongodb_1.dbFind)("reservation")({
    id: { $in: f.context.authedUser.reservedWonders },
})((0, connect_1.default)())), (0, flow_1.mapData)((data) => __awaiter(void 0, void 0, void 0, function* () {
    const wonder = yield (0, reservation_1.getWonderFromReservation)(data);
    if ((0, flow_1.isErrorReport)(wonder))
        return null;
    return (0, wonder_1.toWonderSummaryReservation)(wonder, data.time);
})), (0, flow_1.setData)((f) => (0, utility_1.deleteNull)(f.data))));
exports.router.get("/ticketBook", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, mongodb_1.dbFind)("reservation")({
    id: { $in: f.context.authedUser.ticketBook },
})((0, connect_1.default)())), (0, flow_1.mapData)((data) => __awaiter(void 0, void 0, void 0, function* () {
    const wonder = yield (0, reservation_1.getWonderFromReservation)(data);
    if ((0, flow_1.isErrorReport)(wonder))
        return null;
    return (0, wonder_1.toWonderSummaryReservation)(wonder, data.time);
})), (0, flow_1.setData)((f) => (0, utility_1.deleteNull)(f.data))));
/*
router.post(
  "/login",
  defineScenario(
    extractRequest({ body: ["code"] }),
    mapCache((cache) => ({ email: cache.code })),
    withCache(findOne)("user"),
    selectData("user"),
  ),
);

router.post(
  "/autoLogin",
  defineScenario(
    extractRequest({ body: ["id"] }),
    parseCacheToNumber("id"),
    withCache(findOne)("user"),
    selectData("user"),
  ),
);

router.get(
  "/ownedCreator",
  defineScenario(
    extractRequest({ headers: ["authorization"] }),
    promptCache,
    parseCacheToNumber("authorization"),
    mapCache((cache) => ({ id: cache.authorization })),
    withCache(findOne)("user"),
    (flow) => setCache({ id: { $in: flow.data.user.ownedCreators } })(flow),
    withCache(findAll)("creator"),
    selectData("creators"),
  ),
);
*/
exports.default = exports.router;
