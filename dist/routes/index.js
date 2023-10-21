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
const express_2 = __importDefault(require("../libs/flow/express"));
const flow_1 = require("../libs/flow");
const wrapAsync_1 = __importDefault(require("../errors/wrapAsync"));
const router = (0, express_1.Router)();
router.get("/", (0, express_2.default)((0, flow_1.setData)(() => "Wonder Server!!!")));
router.get("/health", (0, express_2.default)((0, flow_1.setData)(() => true)));
router.get("/ping", (0, express_2.default)((0, flow_1.setData)(() => ({ message: "pong" }))));
router.post("/echo", (0, express_2.default)((0, flow_1.extractBodyLenient)(), (0, flow_1.setData)((f) => f.context.body)));
router.post("/dbinsert", (0, wrapAsync_1.default)((req, res, db) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await db.collection("wonder").insertMany(mockWonders);
    res.status(500).json({ error_message: "no api assigned" });
    // res.status(200).json({ result });
})));
exports.default = router;
