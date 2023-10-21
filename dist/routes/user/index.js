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
const express_2 = __importDefault(require("../../libs/flow/express"));
const flow_1 = require("../../libs/flow");
const mongodb_1 = require("../../libs/flow/mongodb");
const connect_1 = __importDefault(require("../../db/connect"));
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = require("../../functions/user");
const auth_1 = require("../../functions/auth");
const creator_1 = require("../../functions/creator");
const reservation_1 = require("../../functions/reservation");
const wonder_1 = require("../../functions/wonder");
const utility_1 = require("../../functions/utility");
const token_1 = require("../../functions/auth/token");
const wrapAsync_1 = __importDefault(require("../../errors/wrapAsync"));
const router = (0, express_1.Router)();
// router.post(
//   "/login",
//   defineScenario(
//     extractBody({ code: "" }),
//     setData<DB["user"], { body: { code: string } }>((f) =>
//       dbFindOne<DB["user"]>("user")({ email: f.context.body.code })(db()),
//     ),
//     cutData("_id"),
//   ),
// );
router.post("/login", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // get data
    const query = req.query;
    const { email } = req.body;
    if (!email)
        throw new Error("email is required");
    if (query.type === "test") {
        const data = yield db.collection("user").findOne({
            email,
        }, { projection: { _id: 1 } });
        if (data) {
            res.status(200).json({
                needLogin: false,
                token: (0, token_1.signToken)({ type: "user", _id: data._id }),
            });
        }
        else {
            res.status(200).json({
                needLogin: true,
                email,
                type: query.type,
            });
        }
    }
})));
/*
router.post(
  "/testLogin",
  defineScenario(
    extractBody({ email: "" }),
    setData<UserLoggedIn | UserNeedRegister, { body: { email: string } }>(
      async (f) => {
        const result = await dbFindOne<Schema["user"]>("user")({
          platformType: "TEST",
          email: f.context.body.email,
        })(db());
        if (isErrorReport(result)) {
          return { needRegister: true, email: f.context.body.email };
        }
        const token = sign({ type: "user", _id: result._id }, "testSecret");
        return toUserLoggedIn(result, token);
      },
    ),
  ),
);

router.post(
  "/testRegister",
  defineScenario(
    extractRequest({
      params: [],
      query: ["access_token"],
      headers: emptyHeader,
    } as const),
    extractBody({ email: "", name: "", phoneNumber: "" }),
    checkFlow<{ body: { email: string } }>(async (f) => {
      const alreadyExist = await dbFindOne<Schema["user"]>("user")({
        platformType: "TEST",
        email: f.context.body.email,
      })(db());
      if (!isErrorReport(alreadyExist)) {
        return raiseSimpleError(500, "이미 존재하는 유저입니다");
      }
    }),
    checkFlow<{ body: { email: string; name: string; phoneNumber: string } }>(
      (f) => {
        const { email, name, phoneNumber } = f.context.body;
        const errors: string[] = [];
        if (!isValidRegisterEmail(email)) errors.push("이메일");
        if (!isValidRegisterName(name)) errors.push("이름");
        if (!isValidRegisterPhoneNumber(phoneNumber)) errors.push("전화번호");
        if (errors.length > 0) {
          return raiseSimpleError(
            500,
            `${errors.join(", ")}이(가) 올바르지 않습니다`,
          );
        }
      },
    ),
    setContext<
      UserRegisterForm,
      {
        body: { email: string; name: string; phoneNumber: string };
        access_token: string;
      }
    >(({ context: { body, access_token } }) => ({ ...body, access_token }))(
      "registerForm",
    ),
    setData<UserLoggedIn, { registerForm: UserRegisterForm }>(async (f) => {
      const { name, phoneNumber, email } = f.context.registerForm;
      const newUser = prepareNewUser({
        name,
        phoneNumber,
        email,
        socialId: "test",
      });
      const id = await dbInsertOne<Schema["user"]>("user")(newUser)(db());
      if (isErrorReport(id)) {
        return raiseScenarioErrorWithReport(id)(f);
      }
      const token = sign({ type: "user", _id: id }, "testSecret");
      return toUserLoggedIn(newUser, token);
    }),
  ),
);
*/
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check db health
        const database = (0, connect_1.default)();
        if (!database)
            throw new Error("DB");
        // parse body
        const query = req.query;
        const { email, name, phoneNumber } = req.body;
        if (!email)
            throw new Error("email is required");
        if (!name)
            throw new Error("name is required");
        if (!phoneNumber)
            throw new Error("phoneNumber is required");
        if (query.type === "test") {
            // check if already exist
            const alreadyExist = yield database.collection("user").findOne({
                email,
            });
            if (alreadyExist)
                throw new Error("email already exist");
            // insert document
            const newUser = (0, user_1.prepareNewUser)({
                name,
                phoneNumber,
                email,
                socialId: "test",
            });
            const result = yield database.collection("user").insertOne(newUser);
            if (!result.acknowledged)
                throw new Error("insert failed");
            res.status(200).json({
                token: (0, jsonwebtoken_1.sign)({ type: "user", _id: result.insertedId }, "testSecret"),
            });
        }
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
}));
router.post("/autoLogin", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, user_1.toUserLoggedIn)(f.context.authedUser, f.context.authorization))));
router.get("/ownedCreator", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, mongodb_1.dbFind)("creator")({
    id: { $in: f.context.authedUser.ownedCreators },
})((0, connect_1.default)())), (0, flow_1.mapData)(creator_1.toOwnedCreator)));
router.get("/myDetail", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, mongodb_1.dbFindOne)("user")({ _id: f.context.authedUser._id })((0, connect_1.default)())), (0, flow_1.setData)(({ data }) => (0, user_1.toUserWithEmail)(data))));
router.get("/myWonderSummary", (0, express_2.default)((0, flow_1.extractRequest)({
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
router.get("/liked", (0, express_2.default)((0, flow_1.extractRequest)({
    headers: auth_1.authedHeader,
    params: [],
    query: [],
}), auth_1.authorizeUser, (0, flow_1.setData)((f) => (0, mongodb_1.dbFind)("wonder")({
    id: { $in: f.context.authedUser.likedWonders },
})((0, connect_1.default)())), (0, flow_1.mapData)(wonder_1.toWonderSummaryTitleOnly)));
router.get("/reserved", (0, express_2.default)((0, flow_1.extractRequest)({
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
router.get("/ticketBook", (0, express_2.default)((0, flow_1.extractRequest)({
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
exports.default = router;
