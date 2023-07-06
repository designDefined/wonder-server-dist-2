"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateCollection = void 0;
const translateCollection = (key) => {
    switch (key) {
        case "user":
            return "유저";
        case "creator":
            return "크리에이터";
        case "wonder":
            return "원더";
    }
};
exports.translateCollection = translateCollection;
