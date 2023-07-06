"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("../libs/flow/express"));
const flow_1 = require("../libs/flow");
const router = (0, express_1.Router)();
router.get("/", (0, express_2.default)((0, flow_1.setData)(() => "Wonder Server!!!")));
router.get("/health", (0, express_2.default)((0, flow_1.setData)(() => true)));
router.get("/ping", (0, express_2.default)((0, flow_1.setData)(() => ({ message: "pong" }))));
router.post("/echo", (0, express_2.default)((0, flow_1.extractBodyLenient)(), (0, flow_1.setData)((f) => f.context.body)));
exports.default = router;
