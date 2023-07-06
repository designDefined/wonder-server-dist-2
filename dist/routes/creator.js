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
const creator_1 = require("../functions/creator");
const validator_1 = require("../functions/validator");
const wonder_1 = require("../functions/wonder");
const router = (0, express_1.Router)();
router.get("/:creatorId", (0, express_2.default)((0, flow_1.extractRequest)({
    params: ["creatorId"],
    query: [],
    headers: auth_1.emptyHeader,
}), auth_1.authorizeUserLenient, (0, flow_1.parseContextToInt)("creatorId"), (0, flow_1.setData)((f) => (0, mongodb_1.dbFindOne)("creator")({ id: f.context.creatorId })((0, connect_1.default)())), (0, flow_1.setData)(({ context, data }) => ({
    id: data.id,
    name: data.name,
    summary: data.summary,
    profileImage: data.profileImage,
    instagram: data.instagram,
    isMine: context.authedUser !== "no_user" &&
        data.owner.equals(context.authedUser._id),
}))));
router.get("/:creatorId/wonders", (0, express_2.default)((0, flow_1.extractRequest)({
    params: ["creatorId"],
    query: [],
    headers: auth_1.emptyHeader,
}), auth_1.authorizeUserLenient, (0, flow_1.parseContextToInt)("creatorId"), (0, flow_1.setContext)((f) => (0, mongodb_1.dbFindOne)("creator")({ id: f.context.creatorId })((0, connect_1.default)()))("creator"), (0, flow_1.setData)((f) => (0, mongodb_1.dbFind)("wonder")({
    id: { $in: f.context.creator.createdWonder },
})((0, connect_1.default)())), (0, flow_1.mapData)(wonder_1.toWonderSummaryTitleOnly)));
router.post("/new", (0, express_2.default)((0, flow_1.extractRequest)({
    params: [],
    query: [],
    headers: auth_1.authedHeader,
}), (0, flow_1.extractBody)({ name: "", summary: "", instagram: "" }), auth_1.authorizeUser, (0, flow_1.checkFlow)((f) => {
    const { name, summary, instagram } = f.context.body;
    const errors = [];
    if (!(0, validator_1.isValidCreatorName)(name))
        errors.push("크리에이터 명");
    if (!(0, validator_1.isValidCreatorSummary)(summary))
        errors.push("크리에이터 소개");
    if (instagram && !(0, validator_1.isValidInstagram)(instagram))
        errors.push("인스타그램 계정");
    if (errors.length > 0) {
        return (0, flow_1.raiseSimpleError)(500, `${errors.join(", ")}이(가) 올바르지 않습니다`);
    }
}), (0, flow_1.setContext)((f) => {
    return (0, creator_1.prepareNewCreator)(f.context.body, f.context.authedUser._id);
})("newCreator"), (0, flow_1.setData)((f) => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield (0, mongodb_1.dbInsertOne)("creator")(f.context.newCreator)((0, connect_1.default)());
    const updatedUser = yield (0, mongodb_1.dbUpdateOne)("user")({
        _id: f.context.authedUser._id,
    }, { $push: { ownedCreators: f.context.newCreator.id } })((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(updatedUser))
        return (0, flow_1.raiseScenarioErrorWithReport)(updatedUser)(f);
    if ((0, flow_1.isErrorReport)(id))
        return (0, flow_1.raiseScenarioErrorWithReport)(id)(f);
    return { isSuccess: true, createdId: f.context.newCreator.id };
}))));
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
