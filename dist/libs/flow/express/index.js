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
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const __1 = require("..");
const parseExpressRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const initialFlow = {
        req: {
            body: req.body,
            headers: req.headers,
            params: req.params,
            query: req.query, // is it okay?
        },
        res: (status, data) => {
            typeof data === "object"
                ? res.status(status).json(data)
                : res.status(status).send(data);
        },
        context: {},
        data: null,
        status: "success",
    };
    return Promise.resolve(initialFlow);
});
const defineScenario = (...plots) => (req, res) => {
    return (0, ramda_1.pipe)(
    //@ts-ignore
    ...plots.filter((a) => a !== undefined).map(__1.parsePlot), __1.sendResponse)(parseExpressRequest(req, res));
};
exports.default = defineScenario;
