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
const wonder_1 = __importDefault(require("../functions/parse/wonder"));
const removeNull_1 = require("../functions/null/removeNull");
const router = (0, express_1.Router)();
router.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check db
        const database = (0, connect_1.default)();
        if (!database)
            throw new Error("DB와 연결할 수 없습니다");
        // get data
        const query = req.query;
        const data = yield database
            .collection("wonder")
            .find(query)
            .toArray();
        const wonders = (yield Promise.all(data.map(wonder_1.default.schema(database)))).filter(removeNull_1.notEmpty);
        res.status(200).json(wonders);
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
}));
router.get("/detail/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check db
        const database = (0, connect_1.default)();
        if (!database)
            throw new Error("DB와 연결할 수 없습니다");
        // get data
        const data = yield wonder_1.default.id(database)(Number(req.params.id));
        // check data
        if (!data)
            throw new Error("데이터를 찾을 수 없습니다");
        res.status(200).json(data);
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
}));
exports.default = router;
