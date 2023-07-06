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
exports.findAsManyAs = exports.findAll = exports.findOne = exports.findOneSimply = exports.withCache = exports.extractRequest = exports.parseCacheToNumber = exports.appendCache = exports.mapCache = exports.setCache = exports.promptRequest = exports.promptData = exports.promptCache = exports.echo = exports.hijack = exports.selectData = exports.setData = exports.appendData = exports.raiseError = void 0;
const ramda_1 = require("ramda");
const connect_1 = __importDefault(require("../../db/connect"));
const type_1 = require("../../db/type");
/**
 * CORE
 */
const wait = (plot) => (flow) => __awaiter(void 0, void 0, void 0, function* () {
    const resolvedFlow = yield flow;
    return plot(resolvedFlow);
});
const check = (plot) => (flow) => flow.status === "error" ? Promise.resolve(flow) : plot(flow);
const send = (flow) => {
    const { status, res, data } = flow;
    if (status === "error") {
        const { error_code, error_message } = flow;
        res.status(error_code).json({ error_code, error_message });
    }
    else {
        typeof data === "object"
            ? res.status(200).json(data)
            : res.status(200).send(data);
    }
};
const defineScenario = (...plots) => (req, res) => (0, ramda_1.pipe)(...plots.map(check).map(wait), wait(send))(Promise.resolve({ status: "processing", req, res }));
/**
 * Basic Functions
 */
const raiseError = (message = "알 수 없는 에러", code = 500) => (flow) => Promise.resolve(Object.assign(Object.assign({}, flow), { status: "error", error_code: code, error_message: message }));
exports.raiseError = raiseError;
const appendData = (data) => (flow) => Promise.resolve(Object.assign(Object.assign({}, flow), { data: Object.assign(Object.assign({}, flow.data), data) }));
exports.appendData = appendData;
const setData = (data) => (flow) => Promise.resolve(Object.assign(Object.assign({}, flow), { data }));
exports.setData = setData;
const selectData = (propName) => (flow) => flow.data[propName]
    ? Promise.resolve(Object.assign(Object.assign({}, flow), { data: flow.data[propName] }))
    : Promise.resolve(flow);
exports.selectData = selectData;
/**
 * Debug Functions
 */
const hijack = (flow) => Promise.resolve(Object.assign(Object.assign({}, flow), { data: "hijacked!" }));
exports.hijack = hijack;
const echo = (flow) => Promise.resolve(Object.assign(Object.assign({}, flow), { data: flow.req.body }));
exports.echo = echo;
const promptCache = (flow) => {
    console.log(flow.cache);
    return Promise.resolve(flow);
};
exports.promptCache = promptCache;
const promptData = (flow) => {
    console.log(flow.data);
    return Promise.resolve(flow);
};
exports.promptData = promptData;
const promptRequest = (flow) => {
    console.log("header");
    console.log(flow.req.headers);
    console.log("body");
    console.log(flow.req.body);
    console.log("params");
    console.log(flow.req.params);
    console.log("query");
    console.log(flow.req.query);
    return Promise.resolve(flow);
};
exports.promptRequest = promptRequest;
/**
 * Cache Functions
 */
const setCache = (cache) => (flow) => Promise.resolve(Object.assign(Object.assign({}, flow), { cache }));
exports.setCache = setCache;
const mapCache = (mapper) => (flow) => Promise.resolve(Object.assign(Object.assign({}, flow), { cache: mapper(flow.cache) }));
exports.mapCache = mapCache;
const appendCache = (cache) => (flow) => Promise.resolve(Object.assign(Object.assign({}, flow), { cache: Object.assign(Object.assign({}, flow.cache), cache) }));
exports.appendCache = appendCache;
const parseCacheToNumber = (key) => (flow) => {
    const cacheToParse = flow.cache[key];
    if (!cacheToParse)
        return (0, exports.raiseError)(`${key}는 존재하지 않는 캐시 키이므로 숫자로 변환할 수 없습니다.`, 500)(flow);
    const parsed = Number(cacheToParse);
    if (isNaN(parsed))
        return (0, exports.raiseError)(`${key}는 숫자로 전달되어야 합니다`, 400)(flow);
    return Promise.resolve(Object.assign(Object.assign({}, flow), { cache: Object.assign(Object.assign({}, flow.cache), { [key]: parsed }) }));
};
exports.parseCacheToNumber = parseCacheToNumber;
/**
 * Request Functions
 */
const extractRequest = (extractor) => (flow) => {
    var _a, _b, _c, _d;
    const errors = [];
    const extracted = {};
    Object.entries(extractor).forEach(([field, propNames]) => {
        const extractedValues = propNames.reduce((acc, propName) => {
            if (flow.req[field][propName]) {
                return Object.assign(Object.assign({}, acc), { [propName]: flow.req[field][propName] });
            }
            else {
                errors.push(`${field}에서 ${propName}을 찾을 수 없습니다`);
                return acc;
            }
        }, {});
        extracted[field] = extractedValues;
    });
    if (errors.length > 0) {
        return (0, exports.raiseError)(errors.join("\n"), 400)(flow);
    }
    else {
        return (0, exports.appendCache)(Object.assign(Object.assign(Object.assign(Object.assign({}, ((_a = extracted.headers) !== null && _a !== void 0 ? _a : {})), ((_b = extracted.body) !== null && _b !== void 0 ? _b : {})), ((_c = extracted.query) !== null && _c !== void 0 ? _c : {})), ((_d = extracted.params) !== null && _d !== void 0 ? _d : {})))(flow);
    }
};
exports.extractRequest = extractRequest;
/**
 * DB Functions
 */
const withCache = (find) => (collection, projection = {}) => (flow) => flow.cache
    ? find(collection, flow.cache, projection)(flow)
    : (0, exports.raiseError)("캐시가 없습니다", 500)(flow);
exports.withCache = withCache;
const findOneSimply = (collection, filter = {}, projection = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(0, connect_1.default)())
        return Promise.resolve(null);
    const data = yield ((_a = (0, connect_1.default)()) === null || _a === void 0 ? void 0 : _a.collection(collection).findOne(filter, {
        projection: projection,
    }));
    if (!data)
        return Promise.resolve(null);
    return data;
});
exports.findOneSimply = findOneSimply;
const findOne = (collection, filter = {}, projection = {}) => (flow) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!(0, connect_1.default)())
        return (0, exports.raiseError)("DB와 연결할 수 없습니다")(flow);
    const data = yield ((_b = (0, connect_1.default)()) === null || _b === void 0 ? void 0 : _b.collection(collection).findOne(filter, {
        projection: projection,
    }));
    if (!data)
        return (0, exports.raiseError)(`${(0, type_1.translateCollection)(collection)}를(을) 찾을 수 없습니다`)(flow);
    return (0, exports.appendData)({ [collection]: data })(flow);
});
exports.findOne = findOne;
const findAll = (collection, filter = {}, projection = {}) => (flow) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (!(0, connect_1.default)())
        return (0, exports.raiseError)("DB와 연결할 수 없습니다")(flow);
    const data = yield ((_c = (0, connect_1.default)()) === null || _c === void 0 ? void 0 : _c.collection(collection).find(filter, {
        projection: projection,
    }).toArray());
    if (!data)
        return (0, exports.raiseError)(`${(0, type_1.translateCollection)(collection)}를(을) 찾을 수 없습니다`)(flow);
    return (0, exports.appendData)({ [`${collection}s`]: data })(flow);
});
exports.findAll = findAll;
const findAsManyAs = (amount) => (collection, filter = {}, projection = {}) => (flow) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (!(0, connect_1.default)())
        return (0, exports.raiseError)("DB와 연결할 수 없습니다")(flow);
    const data = yield ((_d = (0, connect_1.default)()) === null || _d === void 0 ? void 0 : _d.collection(collection).find(filter, {
        projection: projection,
    }).limit(amount).toArray());
    if (!data)
        return (0, exports.raiseError)(`${(0, type_1.translateCollection)(collection)}를(을) 찾을 수 없습니다`)(flow);
    return (0, exports.appendData)({ [`${collection}s`]: data })(flow);
});
exports.findAsManyAs = findAsManyAs;
exports.default = defineScenario;
