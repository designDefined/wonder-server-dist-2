"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const byLike = [
    { $addFields: { likeCount: { $size: "$likedUsers" } } },
    { $sort: { likeCount: -1 } },
];
const byCreated = [{ $sort: { id: -1 } }];
const by = (type) => {
    switch (type) {
        case "like":
            return byLike;
        case "created":
            return byCreated;
        default:
            return [];
    }
};
const sortWonder = {
    byLike,
    byCreated,
    by,
};
exports.default = sortWonder;
