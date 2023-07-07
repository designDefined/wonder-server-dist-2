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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutData = exports.mapData = exports.appendData = exports.setData = exports.parseContextToInt = exports.setContext = exports.checkFlow = exports.extractBodyLenient = exports.extractBody = exports.extractRequest = exports.promptWithFlag = exports.promptFlow = exports.isErrorReport = exports.raiseSimpleError = exports.raiseScenarioErrorWithReport = exports.raiseScenarioError = exports.sendResponse = exports.parsePlot = void 0;
const ramda_1 = require("ramda");
/**
 * Core Functions
 */
const parsePlot = (plot) => (flow) => __awaiter(void 0, void 0, void 0, function* () {
    const awaitedFlow = yield flow;
    if (awaitedFlow.status === "error")
        return Promise.resolve(awaitedFlow);
    const result = yield plot(awaitedFlow);
    return Promise.resolve(result);
});
exports.parsePlot = parsePlot;
const sendResponse = (f) => __awaiter(void 0, void 0, void 0, function* () {
    const awaitedF = yield f;
    if (awaitedF.status === "error") {
        const { res, error_code, error_message } = awaitedF;
        res(error_code, error_message);
    }
    else {
        const { res, data } = awaitedF;
        res(200, data);
    }
});
exports.sendResponse = sendResponse;
/**
 * Error
 */
const raiseScenarioError = (error_code, error_message) => (flow) => {
    return Object.assign(Object.assign({}, flow), { status: "error", error_code, error_message });
};
exports.raiseScenarioError = raiseScenarioError;
const raiseScenarioErrorWithReport = ({ error_code, error_message }) => (flow) => (0, exports.raiseScenarioError)(error_code, error_message)(flow);
exports.raiseScenarioErrorWithReport = raiseScenarioErrorWithReport;
const raiseSimpleError = (error_code, error_message) => ({ error_code, error_message });
exports.raiseSimpleError = raiseSimpleError;
const isErrorReport = (value) => typeof value === "object"
    ? value.error_code !== undefined
    : false;
exports.isErrorReport = isErrorReport;
/**
 * Debug
 */
const promptFlow = (f) => {
    console.log(f);
    return f;
};
exports.promptFlow = promptFlow;
const promptWithFlag = (flag) => (f) => {
    console.log(`prompt start: ${flag}`);
    console.log(f);
    console.log(`prompt end: ${flag}`);
    return f;
};
exports.promptWithFlag = promptWithFlag;
/**
 * Request
 */
const extractRequest = (filter) => (inputFlow) => {
    const { req } = inputFlow;
    const { headers, params, query } = req;
    const errors = [];
    const extractedHeaders = filter.headers.reduce((acc, propName) => {
        if (headers[propName]) {
            const value = headers[propName];
            return Object.assign(Object.assign({}, acc), { [propName]: value });
        }
        else {
            errors.push(`요청 헤더에서 ${propName}을 찾을 수 없습니다`);
            return acc;
        }
    }, {});
    const extractedParams = filter.params.reduce((acc, propName) => {
        if (params[propName]) {
            const value = params[propName];
            return Object.assign(Object.assign({}, acc), { [propName]: value });
        }
        else {
            errors.push(`패러미터에서 ${propName}을 찾을 수 없습니다`);
            return acc;
        }
    }, {});
    const extractedQuery = filter.query.reduce((acc, propName) => {
        if (query[propName]) {
            const value = query[propName];
            return Object.assign(Object.assign({}, acc), { [propName]: value });
        }
        else {
            errors.push(`쿼리에서 ${propName}을 찾을 수 없습니다`);
            return acc;
        }
    }, {});
    const newFlow = Object.assign(Object.assign({}, inputFlow), { context: Object.assign(Object.assign(Object.assign(Object.assign({}, inputFlow.context), extractedHeaders), extractedParams), extractedQuery) });
    return errors.length > 0
        ? (0, exports.raiseScenarioError)(402, errors.join("\n "))(inputFlow)
        : newFlow;
};
exports.extractRequest = extractRequest;
const typeEqual = (a, b) => {
    if (typeof a === "object" && !!a && typeof b === "object" && !!b) {
        if (Array.isArray(a) && Array.isArray(b))
            return true;
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length)
            return false;
        return aKeys.every((key) => 
        // @ts-ignore
        typeEqual(a[key], b[key]));
    }
    else {
        return typeof a === typeof b;
    }
};
const extractBody = (toCompare) => (inputFlow) => {
    const { req } = inputFlow;
    const { body } = req;
    if (typeEqual(body, toCompare)) {
        const validBody = body;
        return Object.assign(Object.assign({}, inputFlow), { context: Object.assign(Object.assign({}, inputFlow.context), { body: validBody }) });
    }
    return (0, exports.raiseScenarioError)(402, "body가 정확하지 않습니다")(inputFlow);
};
exports.extractBody = extractBody;
const extractBodyLenient = () => (inputFlow) => {
    const { req } = inputFlow;
    const { body } = req;
    if (body === (undefined || null))
        return (0, exports.raiseScenarioError)(402, "body가 없습니다")(inputFlow);
    return Object.assign(Object.assign({}, inputFlow), { context: Object.assign(Object.assign({}, inputFlow.context), { body: body }) });
};
exports.extractBodyLenient = extractBodyLenient;
/**
 * Context
 */
const checkFlow = (checker) => (inputFlow) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield checker(inputFlow);
    return (0, exports.isErrorReport)(result)
        ? (0, exports.raiseScenarioErrorWithReport)(result)(inputFlow)
        : inputFlow;
});
exports.checkFlow = checkFlow;
const setContext = (selector) => (key) => (inputFlow) => __awaiter(void 0, void 0, void 0, function* () {
    const newContext = yield selector(inputFlow);
    return (0, exports.isErrorReport)(newContext)
        ? (0, exports.raiseScenarioErrorWithReport)(newContext)(inputFlow)
        : Object.assign(Object.assign({}, inputFlow), { context: Object.assign(Object.assign({}, inputFlow.context), { [key]: newContext }) });
});
exports.setContext = setContext;
const parseContextToInt = (key) => (inputFlow) => {
    const intValue = parseInt(inputFlow["context"][key]);
    return isNaN(intValue)
        ? (0, exports.raiseScenarioError)(402, `${key}가 숫자가 아닙니다`)(inputFlow)
        : Object.assign(Object.assign({}, inputFlow), { context: Object.assign(Object.assign({}, inputFlow.context), { [key]: intValue }) });
};
exports.parseContextToInt = parseContextToInt;
/**
 * Data
 */
const setData = (selector) => (inputFlow) => __awaiter(void 0, void 0, void 0, function* () {
    const newData = yield selector(inputFlow);
    return (0, exports.isErrorReport)(newData)
        ? (0, exports.raiseScenarioErrorWithReport)(newData)(inputFlow)
        : Object.assign(Object.assign({}, inputFlow), { data: newData });
});
exports.setData = setData;
const appendData = (selector) => (key) => (inputFlow) => __awaiter(void 0, void 0, void 0, function* () {
    const newDataValue = yield selector(inputFlow);
    return (0, exports.isErrorReport)(newDataValue)
        ? //? { ...inputFlow, status: "error", ...newDataValue }
            (0, exports.raiseScenarioErrorWithReport)(newDataValue)(inputFlow)
        : Object.assign(Object.assign({}, inputFlow), { data: Object.assign(Object.assign({}, inputFlow.data), { [key]: newDataValue }) });
});
exports.appendData = appendData;
const mapData = (mapper) => (inputFlow) => __awaiter(void 0, void 0, void 0, function* () {
    const mappedData = yield Promise.all(inputFlow.data.map((data, i) => __awaiter(void 0, void 0, void 0, function* () { return yield mapper(data, inputFlow.context, i); })));
    return Object.assign(Object.assign({}, inputFlow), { data: mappedData });
});
exports.mapData = mapData;
const cutData = (key) => (inputFlow) => {
    const { data } = inputFlow;
    const _a = data, _b = key, omit = _a[_b], newData = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    return Object.assign(Object.assign({}, inputFlow), { data: newData });
};
exports.cutData = cutData;
/**
 * Core
 */
const defineScenario = (...plots) => 
//@ts-ignore
(0, ramda_1.pipe)(...plots.map(exports.parsePlot), exports.sendResponse);
exports.default = defineScenario;
