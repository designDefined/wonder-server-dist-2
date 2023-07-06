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
exports.dbInsertOne = exports.dbUpdateOne = exports.dbFindLastOne = exports.dbFindOne = exports.dbFindLastAsManyAs = exports.dbFindAsManyAs = exports.dbFind = void 0;
const __1 = require("..");
const dbFind = (collectionName) => (filter = {}, projection) => (db) => __awaiter(void 0, void 0, void 0, function* () {
    if (!db)
        return (0, __1.raiseSimpleError)(500, "DB와 연결할 수 없습니다");
    const config = projection ? { projection } : {};
    const data = yield db
        .collection(collectionName)
        .find(filter, config)
        .toArray();
    if (!data)
        return (0, __1.raiseSimpleError)(500, `데이터 ${collectionName}를(을) 찾을 수 없습니다`);
    return Promise.resolve(data);
});
exports.dbFind = dbFind;
const dbFindAsManyAs = (collectionName) => (amount) => (filter = {}, projection) => (db) => __awaiter(void 0, void 0, void 0, function* () {
    if (!db)
        return (0, __1.raiseSimpleError)(500, "DB와 연결할 수 없습니다");
    const config = projection ? { projection } : {};
    const data = yield db
        .collection(collectionName)
        .find(filter, config)
        .limit(amount)
        .toArray();
    if (!data)
        return (0, __1.raiseSimpleError)(500, `데이터 ${collectionName}를(을) 찾을 수 없습니다`);
    return Promise.resolve(data);
});
exports.dbFindAsManyAs = dbFindAsManyAs;
const dbFindLastAsManyAs = (collectionName) => (amount) => (filter = {}, projection) => (db) => __awaiter(void 0, void 0, void 0, function* () {
    if (!db)
        return (0, __1.raiseSimpleError)(500, "DB와 연결할 수 없습니다");
    const config = projection ? { projection } : {};
    const data = yield db
        .collection(collectionName)
        .find(filter, config)
        .sort({ id: -1 })
        .limit(amount)
        .toArray();
    if (!data || data.length < 1)
        return (0, __1.raiseSimpleError)(500, `데이터 ${collectionName}를(을) 찾을 수 없습니다`);
    return Promise.resolve(data);
});
exports.dbFindLastAsManyAs = dbFindLastAsManyAs;
const dbFindOne = (collectionName) => (filter = {}, projection) => (db) => __awaiter(void 0, void 0, void 0, function* () {
    if (!db)
        return (0, __1.raiseSimpleError)(500, "DB와 연결할 수 없습니다");
    const config = projection ? { projection } : {};
    const data = yield db
        .collection(collectionName)
        .findOne(filter, config);
    if (!data)
        return (0, __1.raiseSimpleError)(500, `데이터 ${collectionName}를(을) 찾을 수 없습니다`);
    return Promise.resolve(data);
});
exports.dbFindOne = dbFindOne;
/**
 *
 * TODO
 *  Error 코드 다르게 해서 uniqueId에서 사용
 */
const dbFindLastOne = (collectionName) => (filter = {}, projection) => (db) => __awaiter(void 0, void 0, void 0, function* () {
    if (!db)
        return (0, __1.raiseSimpleError)(500, "DB와 연결할 수 없습니다");
    const config = projection ? { projection } : {};
    const data = yield db
        .collection(collectionName)
        .find(filter, config)
        .sort({ id: -1 })
        .limit(1)
        .toArray();
    if (!data || data.length < 1)
        return (0, __1.raiseSimpleError)(500, `데이터 ${collectionName}를(을) 찾을 수 없습니다`);
    return Promise.resolve(data[0]);
});
exports.dbFindLastOne = dbFindLastOne;
const dbUpdateOne = (collectionName) => (filter, data) => (db) => __awaiter(void 0, void 0, void 0, function* () {
    if (!db)
        return (0, __1.raiseSimpleError)(500, "DB와 연결할 수 없습니다");
    const updateResult = yield db
        .collection(collectionName)
        .updateOne(filter, data);
    if (!updateResult.acknowledged)
        return (0, __1.raiseSimpleError)(500, "데이터를 수정할 수 없습니다");
    return updateResult.matchedCount > 0
        ? true
        : (0, __1.raiseSimpleError)(500, "아무 데이터도 수정되지 않았습니다");
});
exports.dbUpdateOne = dbUpdateOne;
const dbInsertOne = (collectionName) => (data) => (db) => __awaiter(void 0, void 0, void 0, function* () {
    if (!db)
        return (0, __1.raiseSimpleError)(500, "DB와 연결할 수 없습니다");
    const insertResult = yield db
        .collection(collectionName)
        .insertOne(data);
    return insertResult.acknowledged
        ? insertResult.insertedId
        : (0, __1.raiseSimpleError)(500, "데이터를 삽입할 수 없습니다");
});
exports.dbInsertOne = dbInsertOne;
