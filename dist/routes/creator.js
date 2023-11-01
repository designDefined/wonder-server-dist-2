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
const connect_1 = __importDefault(require("../db/connect"));
const express_2 = __importDefault(require("../libs/flow/express"));
const flow_1 = require("../libs/flow");
const auth_1 = require("../functions/auth");
const mongodb_1 = require("../libs/flow/mongodb");
const wonder_1 = require("../functions/wonder");
const wrapAsync_1 = __importDefault(require("../errors/wrapAsync"));
const zod_1 = require("zod");
const mongodb_2 = require("mongodb");
const token_1 = require("../functions/auth/token");
const type_1 = require("../functions/auth/type");
const creator_1 = require("../functions/create/creator");
const creator_2 = __importDefault(require("../functions/parse/creator"));
const router = (0, express_1.Router)();
const GetParams = zod_1.z.object({
    creatorId: zod_1.z.coerce.number(),
});
router.get("/:creatorId", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // parse token
    const userObjectId = new mongodb_2.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db
        .collection("user")
        .findOne({ _id: userObjectId });
    // find creator
    const { creatorId } = GetParams.parse(req.params);
    const creator = yield db.collection("creator").findOne({
        id: creatorId,
    });
    if (!creator)
        throw new Error("Creator not found");
    const parsedCreator = yield creator_2.default.display(db)(creator);
    const isMine = creator.owner.equals((_a = user === null || user === void 0 ? void 0 : user._id) !== null && _a !== void 0 ? _a : "");
    res.status(200).json(Object.assign(Object.assign({}, parsedCreator), { isMine }));
})));
const PutCreatorBody = zod_1.z.object({
    name: zod_1.z.string().max(15).optional(),
    summary: zod_1.z.string().max(30).optional(),
});
router.put("/:creatorId/modify", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    // parse token
    const userObjectId = new mongodb_2.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db
        .collection("user")
        .findOne({ _id: userObjectId });
    if (!user)
        throw new Error("User not found");
    // find creator
    const { creatorId } = GetParams.parse(req.params);
    const creator = yield db.collection("creator").findOne({
        id: creatorId,
    });
    if (!creator)
        throw new Error("Creator not found");
    const isMine = creator.owner.equals((_b = user === null || user === void 0 ? void 0 : user._id) !== null && _b !== void 0 ? _b : "");
    if (!isMine)
        throw new Error("Not your creator");
    // update creator
    const body = PutCreatorBody.parse(req.body);
    const updateResult = yield db
        .collection("creator")
        .updateOne({ id: creatorId }, {
        $set: {
            name: (_c = body.name) !== null && _c !== void 0 ? _c : creator.name,
            summary: (_d = body.summary) !== null && _d !== void 0 ? _d : creator.summary,
        },
    });
    if (!updateResult.acknowledged) {
        throw new Error("Update failed");
    }
    res.status(200).json({
        success: true,
    });
})));
// router.get(
//   "/:creatorId",
//   defineScenario(
//     extractRequest({
//       params: ["creatorId"],
//       query: [],
//       headers: emptyHeader,
//     } as const),
//     authorizeUserLenient,
//     parseContextToInt("creatorId"),
//     setData<DB["creator"], { creatorId: number }>((f) =>
//       dbFindOne<Schema["creator"]>("creator")({ id: f.context.creatorId })(
//         db(),
//       ),
//     ),
//     setData<
//       CreatorDetail,
//       { authedUser: DB["user"] | "no_user" },
//       DB["creator"]
//     >(({ context, data }) => ({
//       id: data.id,
//       name: data.name,
//       summary: data.summary,
//       profileImage: data.profileImage,
//       instagram: data.instagram,
//       isMine:
//         context.authedUser !== "no_user" &&
//         data.owner.equals(context.authedUser._id),
//     })),
//   ),
// );
router.get("/:creatorId/wonders", (0, express_2.default)((0, flow_1.extractRequest)({
    params: ["creatorId"],
    query: [],
    headers: auth_1.emptyHeader,
}), auth_1.authorizeUserLenient, (0, flow_1.parseContextToInt)("creatorId"), (0, flow_1.setContext)((f) => (0, mongodb_1.dbFindOne)("creator")({ id: f.context.creatorId })((0, connect_1.default)()))("creator"), (0, flow_1.setData)((f) => (0, mongodb_1.dbFind)("wonder")({
    id: { $in: f.context.creator.createdWonder },
})((0, connect_1.default)())), (0, flow_1.mapData)(wonder_1.toWonderSummaryTitleOnly)));
const PostNewCreatorBody = zod_1.z.object({
    name: zod_1.z.string().max(15),
    summary: zod_1.z.string().max(30),
    instagram: zod_1.z.string().startsWith("@").optional(),
});
router.post("/new", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // parse token
    const userObjectId = new mongodb_2.ObjectId(type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(req.headers).authorization))._id);
    // find user
    const user = yield db
        .collection("user")
        .findOne({ _id: userObjectId });
    if (!user)
        throw new Error("User not found");
    const body = PostNewCreatorBody.parse(req.body);
    const creator = (0, creator_1.createCreator)(body, user._id, new Date());
    const insertResult = yield db.collection("creator").insertOne(creator);
    if (!insertResult.acknowledged)
        throw new Error("Creator insert failed");
    // update user
    const updateUserResult = yield db.collection("user").updateOne({ _id: userObjectId }, {
        $push: { ownedCreators: insertResult.insertedId },
    });
    if (!updateUserResult.acknowledged)
        throw new Error("User update failed");
    res.status(200).json({ creatorId: creator.id });
})));
// router.post(
//   "/new",
//   defineScenario(
//     extractRequest({
//       params: [],
//       query: [],
//       headers: authedHeader,
//     } as const),
//     extractBody<NewCreator>({ name: "", summary: "", instagram: "" }),
//     authorizeUser,
//     checkFlow<{ body: NewCreator }>((f) => {
//       const { name, summary, instagram } = f.context.body;
//       const errors: string[] = [];
//       if (!isValidCreatorName(name)) errors.push("크리에이터 명");
//       if (!isValidCreatorSummary(summary)) errors.push("크리에이터 소개");
//       if (instagram && !isValidInstagram(instagram))
//         errors.push("인스타그램 계정");
//       if (errors.length > 0) {
//         return raiseSimpleError(
//           500,
//           `${errors.join(", ")}이(가) 올바르지 않습니다`,
//         );
//       }
//     }),
//     setContext<Schema["creator"], { authedUser: DB["user"]; body: NewCreator }>(
//       (f) => {
//         return prepareNewCreator(f.context.body, f.context.authedUser._id);
//       },
//     )("newCreator"),
//     setData<
//       { createdId: DB["creator"]["id"]; isSuccess: boolean },
//       { newCreator: Schema["creator"]; authedUser: DB["user"] }
//     >(async (f) => {
//       const id = await dbInsertOne<Schema["creator"]>("creator")(
//         f.context.newCreator,
//       )(db());
//       const updatedUser = await dbUpdateOne<DB["user"]>("user")(
//         {
//           _id: f.context.authedUser._id,
//         },
//         { $push: { ownedCreators: f.context.newCreator.id } },
//       )(db());
//       if (isErrorReport(updatedUser))
//         return raiseScenarioErrorWithReport(updatedUser)(f);
//       if (isErrorReport(id)) return raiseScenarioErrorWithReport(id)(f);
//       return { isSuccess: true, createdId: f.context.newCreator.id };
//     }),
//   ),
// );
/*
router.get("/:creatorId", async (req, res) => {
  const creatorId: string = req.params.creatorId;
  if (!creatorId) {
    res.json({ error: "creatorId is null" });
    return;
  }

  if (db()) {
    const idToFind = parseInt(creatorId);
    const creator = (await db()
      ?.collection<CreatorDB>("creator")
      .findOne({ id: idToFind })) as CreatorDB;
    if (!creator) {
      res.json({ error: "can't find creator" });
      return;
    }
    const wonders = await db()
      ?.collection<WonderDB>("wonder")
      .find(
        { id: { $in: creator.createdWonder } },
        { projection: { id: 1, title: 1, thumbnail: 1 } },
      )
      .toArray();
    res.json({ creator, wonders });
  }
});

router.post("/new", async (req, res) => {
  const { name, summary, instagram, userId } = req.body as {
    name: string;
    summary: string;
    instagram?: string;
    userId: string;
  };

  if (db()) {
    const user = (await db()
      ?.collection<UserDB>("user")
      .findOne(
        { id: userId },
        { projection: { _id: 1, ownedCreator: 1 } },
      )) as { _id: string; ownedCreator: number[] };
    if (!user) {
      res.status(401).json({ error: "can't find user" });
      return;
    }
    const id = unique.creatorId();

    const date: DateInformation = {
      createdAt: new Date(),
      lastModifiedAt: new Date(),
    };
    const image: StoredImage = { src: "", altText: "" };

    const result = await db()
      ?.collection<Creator>("creator")
      .insertOne({
        id: id,
        owner: user._id,
        name: name,
        summary: summary,
        profileImage: {
          src: "/src/assets/sample/creator_thumbnail_sample_1.png",
          altText: "",
        },
        dateInformation: date,
        createdWonder: [],
        instagram: instagram ? instagram : "",
      });
    const result2 = await db()
      ?.collection<UserDB>("user")
      .updateOne(
        { _id: user._id },
        {
          $push: { ownedCreators: id },
        },
      );
    res.json({ isSuccess: true, createdId: id });
  } else {
    res.status(401).json({ error: "db is null" });
  }
});

*/
exports.default = router;
