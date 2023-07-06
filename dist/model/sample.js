"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kitten = void 0;
const mongoose_1 = require("mongoose");
const kittenSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
});
kittenSchema.statics.findByName = function (name) {
    return this.find({ name: new RegExp(name, "i") });
};
exports.Kitten = (0, mongoose_1.model)("Kitten", kittenSchema);
