"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
const errorMapperMiddleware = (error, req, res, next) => {
    if (error instanceof zod_1.ZodError) {
        // Zod Error
        res.status(402).json({ error_type: 3, error_message: error.message });
    }
    else if (error instanceof mongodb_1.MongoError) {
        // MongoDB Error
        res.status(500).json({ error_type: 2, error_message: error.message });
    }
    else if (error instanceof Error) {
        // Default Error
        res.status(500).json({ error_type: 1, error_message: error.message });
    }
    else {
        res.status(500).json({ error_type: 0, error_message: "unknown error" });
    }
};
exports.default = errorMapperMiddleware;
