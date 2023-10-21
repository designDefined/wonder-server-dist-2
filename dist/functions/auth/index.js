"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("./token");
const type_1 = require("./type");
const auth = (headers) => type_1.UserToken.parse((0, token_1.verifyToken)(type_1.AuthHeader.parse(headers).authorization))._id;
exports.default = auth;
