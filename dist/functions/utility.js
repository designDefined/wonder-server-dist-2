"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNull = void 0;
const deleteNull = (arr) => {
    const nonNull = [];
    arr.forEach((item) => {
        if (item !== null) {
            nonNull.push(item);
        }
    });
    return nonNull;
};
exports.deleteNull = deleteNull;
