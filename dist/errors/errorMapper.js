"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMapperMiddleware = (error, req, res, next) => {
    res.status(500).send("error handling success!!!");
};
exports.default = errorMapperMiddleware;
