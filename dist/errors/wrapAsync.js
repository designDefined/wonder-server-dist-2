"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("../db/connect");
const mongodb_1 = require("mongodb");
const wrapAsync = (fn) => (req, res, next) => {
    const db = connect_1.dbClient;
    if (!db)
        throw new mongodb_1.MongoError("Unable to connect DB instance");
    return fn(req, res, db, next).catch(next);
};
exports.default = wrapAsync;
