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
exports.appendData = exports.setData = exports.setContext = exports.extractRequest = void 0;
const ramda_1 = require("ramda");
const tools_1 = require("./tools");
const send = (f) => __awaiter(void 0, void 0, void 0, function* () {
    const awaitedF = yield f;
    console.log(awaitedF);
    if (awaitedF.status === "error") {
        const { res, error_code, error_message } = awaitedF;
        res(error_code, error_message);
    }
    else {
        const { res, data } = awaitedF;
        res(200, data);
    }
});
const defineScenario = (...plots) => (0, ramda_1.pipe)(...plots.map(tools_1.parsePlot), send);
const extractRequest = (filter) => (inputFlow) => {
    /* extract logic */
    return inputFlow;
};
exports.extractRequest = extractRequest;
const setContext = (selector) => (key) => (inputFlow) => __awaiter(void 0, void 0, void 0, function* () {
    const newContext = yield selector(inputFlow);
    return Object.assign(Object.assign({}, inputFlow), { context: Object.assign(Object.assign({}, inputFlow.context), { [key]: newContext }) });
});
exports.setContext = setContext;
const setData = (selector) => (inputFlow) => (Object.assign(Object.assign({}, inputFlow), { data: selector(inputFlow) }));
exports.setData = setData;
const appendData = (selector) => (key) => (inputFlow) => (Object.assign(Object.assign({}, inputFlow), { data: Object.assign(Object.assign({}, inputFlow.data), { [key]: selector(inputFlow) }) }));
exports.appendData = appendData;
exports.default = defineScenario;
