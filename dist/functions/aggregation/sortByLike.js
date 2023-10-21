"use strict";
const sortByLike = [
    { $addFields: { likeCount: { $size: "$likedUsers" } } },
    { $sort: { likeCount: -1 } },
];
