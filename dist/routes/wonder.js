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
const mongodb_1 = require("../libs/flow/mongodb");
const wonder_1 = require("../functions/wonder");
const creator_1 = require("../functions/creator");
const auth_1 = require("../functions/auth");
const utility_1 = require("../functions/utility");
const validator_1 = require("../functions/validator");
const reservation_1 = require("../functions/reservation");
const aws_1 = require("../functions/aws");
const uniqueId_1 = require("../functions/uniqueId");
const router = (0, express_1.Router)();
router.get("/recent", (0, express_2.default)((0, flow_1.setData)(() => (0, mongodb_1.dbFindLastAsManyAs)("wonder")(5)()((0, connect_1.default)())), (0, flow_1.mapData)((wonder) => __awaiter(void 0, void 0, void 0, function* () {
    const creator = yield (0, mongodb_1.dbFindOne)("creator")({
        _id: wonder.creator,
    })((0, connect_1.default)());
    return (0, flow_1.isErrorReport)(creator)
        ? null
        : (0, wonder_1.toWonderCard)(wonder, (0, creator_1.toCreatorInWonderCard)(creator));
})), (0, flow_1.setData)((f) => (0, utility_1.deleteNull)(f.data))));
router.get("/all", (0, express_2.default)((0, flow_1.setData)(() => (0, mongodb_1.dbFind)("wonder")()((0, connect_1.default)())), (0, flow_1.mapData)((wonder) => __awaiter(void 0, void 0, void 0, function* () {
    const creator = yield (0, mongodb_1.dbFindOne)("creator")({
        _id: wonder.creator,
    })((0, connect_1.default)());
    return (0, flow_1.isErrorReport)(creator)
        ? null
        : (0, wonder_1.toWonderSearchCard)(wonder, (0, creator_1.toCreatorInWonderCard)(creator));
})), (0, flow_1.setData)((f) => (0, utility_1.deleteNull)(f.data))));
router.get("/:wonderId", (0, express_2.default)((0, flow_1.extractRequest)({
    params: ["wonderId"],
    query: [],
    headers: auth_1.emptyHeader,
}), auth_1.authorizeUserLenient, (0, flow_1.parseContextToInt)("wonderId"), (0, flow_1.setData)((f) => (0, mongodb_1.dbFindOne)("wonder")({ id: f.context.wonderId })((0, connect_1.default)())), (0, flow_1.setData)(({ context, data }) => __awaiter(void 0, void 0, void 0, function* () {
    const me = context.authedUser;
    const creator = yield (0, mongodb_1.dbFindOne)("creator")({
        _id: data.creator,
    })((0, connect_1.default)());
    return (0, flow_1.isErrorReport)(creator)
        ? creator
        : (0, wonder_1.toWonderDetail)(data, (0, creator_1.toCreatorInWonderDetail)(creator), me !== "no_user" && data.likedUsers.includes(me.id), false);
}))));
router.put("/:wonderId/like", (0, express_2.default)((0, flow_1.extractRequest)({
    params: ["wonderId"],
    query: [],
    headers: auth_1.authedHeader,
}), (0, flow_1.extractBody)({ value: true }), auth_1.authorizeUser, (0, flow_1.parseContextToInt)("wonderId"), (0, flow_1.setContext)((f) => (0, mongodb_1.dbFindOne)("wonder")({ id: f.context.wonderId })((0, connect_1.default)()))("wonder"), (0, flow_1.setData)((f) => __awaiter(void 0, void 0, void 0, function* () {
    const { wonder, authedUser: user, body: { value }, } = f.context;
    const wonderQuery = value
        ? { $push: { likedUsers: user.id } }
        : { $pull: { likedUsers: user.id } };
    const userQuery = value
        ? { $push: { likedWonders: wonder.id } }
        : { $pull: { likedWonders: wonder.id } };
    const wonderUpdateResult = yield (0, mongodb_1.dbUpdateOne)("wonder")({
        _id: wonder._id,
    }, wonderQuery)((0, connect_1.default)());
    const userUpdateResult = yield (0, mongodb_1.dbUpdateOne)("user")({
        _id: user._id,
    }, userQuery)((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(wonderUpdateResult))
        return wonderUpdateResult;
    if ((0, flow_1.isErrorReport)(userUpdateResult))
        return userUpdateResult;
    return { likeIsNow: value };
}))));
router.post("/new/:creatorId", (0, express_2.default)((0, flow_1.extractRequest)({
    params: ["creatorId"],
    query: [],
    headers: auth_1.authedHeader,
}), (0, flow_1.extractBodyLenient)(), auth_1.authorizeUser, (0, flow_1.parseContextToInt)("creatorId"), (0, flow_1.setContext)((f) => __awaiter(void 0, void 0, void 0, function* () {
    const creator = yield (0, mongodb_1.dbFindOne)("creator")({
        id: f.context.creatorId,
    })((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(creator))
        return creator;
    if (creator.owner.equals(f.context.authedUser._id) === false)
        return (0, flow_1.raiseScenarioError)(402, "권한이 없는 크리에이터입니다.")(f);
    const { title, schedule, location } = f.context.body;
    if (!(0, validator_1.isValidWonderTitle)(title))
        return (0, flow_1.raiseScenarioError)(402, "제목이 유효하지 않습니다.")(f);
    if (!(0, validator_1.isValidWonderSchedule)(schedule))
        return (0, flow_1.raiseScenarioError)(402, "일정이 유효하지 않습니다.")(f);
    if (!(0, validator_1.isValidWonderLocation)(location))
        return (0, flow_1.raiseScenarioError)(402, "장소가 유효하지 않습니다.")(f);
    const presignedId = uniqueId_1.unique.wonderId();
    const presignedThumbnail = yield (0, aws_1.uploadThumbnail)(f.context.body.thumbnail.file, `${presignedId}_${f.context.body.thumbnail.fileName}`);
    if ((0, flow_1.isErrorReport)(presignedThumbnail))
        return presignedThumbnail;
    return (0, wonder_1.prepareNewWonder)(f.context.body, creator._id, presignedId, {
        src: `${presignedThumbnail}`,
        altText: `${presignedId}_${f.context.body.thumbnail.fileName}`,
    });
}))("newWonder"), (0, flow_1.setData)((f) => __awaiter(void 0, void 0, void 0, function* () {
    const result1 = yield (0, mongodb_1.dbInsertOne)("wonder")(f.context.newWonder)((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(result1))
        return result1;
    const result2 = yield (0, mongodb_1.dbUpdateOne)("creator")({ id: f.context.creatorId }, { $push: { createdWonder: f.context.newWonder.id } })((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(result2))
        return result2;
    return { isSuccess: true, createdId: f.context.newWonder.id };
}))));
router.post("/:wonderId/reservation", (0, express_2.default)((0, flow_1.extractRequest)({
    params: ["wonderId"],
    query: [],
    headers: auth_1.authedHeader,
}), (0, flow_1.extractBody)({
    wonderId: -1,
    userId: -1,
    time: { date: [0, 0, 0], time: [] },
    data: [],
}), auth_1.authorizeUser, (0, flow_1.parseContextToInt)("wonderId"), (0, flow_1.setContext)((f) => (0, mongodb_1.dbFindOne)("wonder")({ id: f.context.wonderId })((0, connect_1.default)()))("wonder"), (0, flow_1.setContext)(({ context: { body, authedUser, wonder } }) => {
    return (0, reservation_1.prepareNewReservation)(body, wonder, authedUser);
})("newReservation"), (0, flow_1.setData)((f) => __awaiter(void 0, void 0, void 0, function* () {
    const resultReservation = yield (0, mongodb_1.dbInsertOne)("reservation")(f.context.newReservation)((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(resultReservation))
        return resultReservation;
    const resultWonder = yield (0, mongodb_1.dbUpdateOne)("wonder")({ _id: f.context.newReservation.wonder }, { $push: { reservations: f.context.newReservation.id } })((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(resultWonder))
        return resultWonder;
    const resultUser = yield (0, mongodb_1.dbUpdateOne)("user")({ _id: f.context.newReservation.user }, { $push: { reservedWonders: f.context.newReservation.id } })((0, connect_1.default)());
    if ((0, flow_1.isErrorReport)(resultUser))
        return resultUser;
    return { isSuccess: true, createdId: f.context.newReservation.id };
}))));
/*
router.get("/recent", async (req, res) => {
  if (db()) {
    const wonders = await db()
      ?.collection<WonderDB>("wonder")
      .find(
        {},
        { projection: { id: 1, title: 1, tags: 1, thumbnail: 1, creator: 1 } },
      )
      .limit(5)
      .toArray();
    const data: WonderCardDisplay[] = [];
    for (const wonder of wonders) {
      const mappedWonder = wonder as Pick<
        WonderDB,
        "id" | "title" | "tags" | "thumbnail" | "creator"
      >;
      const creator = (await db()
        ?.collection<CreatorDB>("creator")
        .findOne(
          { _id: mappedWonder.creator },
          { projection: { id: 1, name: 1, profileImage: 1 } },
        )) as CreatorDisplay;
      data.push({ ...mappedWonder, creator });
    }
    res.json(data);
  } else {
    res.json({ error: "db is null" });
  }
});
router.get("/:wonderId", async (req, res) => {
  const wonderId: string = req.params.wonderId;
  if (!wonderId) {
    res.status(500).json({ error: "wonderId is null" });
    return null;
  }
  if (db()) {
    const idToFind = parseInt(wonderId);
    const wonder = await db()
      ?.collection<WonderDB>("wonder")
      .findOne({ id: idToFind });

    if (!wonder) {
      res.status(500).json({ error: "can't find wonder" });
      return null;
    }
    const creator = (await db()
      ?.collection<CreatorDB>("creator")
      .findOne(
        { _id: wonder.creator },
        { projection: { id: 1, name: 1, profileImage: 1 } },
      )) as CreatorDisplay;

    if (!creator) {
      res.status(500).json({ error: "can't find creator" });
      return null;
    }
    const data = { ...wonder, creator };
    res.json(data);
  } else {
    res.status(500).json({ error: "db is null" });
  }
});


router.post("/new", async (req, res) => {
  const wonderData = req.body.wonder;
  const creatorId = Number(req.headers.authorization);

  if (db()) {
    const creator = await db()
      ?.collection<CreatorDB>("creator")
      .findOne({ id: creatorId });

    if (!creator) {
      res.status(500).json({ error: "can't find creator" });
      return null;
    }
    const id = unique.wonderId();
    const result = await db()
      ?.collection<Wonder>("wonder")
      .insertOne({
        ...wonderData,
        id: id,
        creator: creator._id,
        dateInformation: {
          createdAt: new Date(),
          lastModifiedAt: new Date(),
        },
      });
    const result2 = await db()
      ?.collection<CreatorDB>("creator")
      .updateOne({ _id: creator._id }, { $push: { createdWonder: id } });
    res.json({ isSuccess: true, createdId: id });
  } else {
    res.status(500).json({ error: "db is null" });
  }
});
*/
exports.default = router;
