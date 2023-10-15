"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const SECRET = "testSecret";
const signToken = (information) => (0, jsonwebtoken_1.sign)(information, SECRET);
exports.signToken = signToken;
const verifyToken = (token) => (0, jsonwebtoken_1.verify)(token, SECRET);
exports.verifyToken = verifyToken;
