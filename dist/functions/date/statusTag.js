"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculate = (schedule, needRegister) => {
    const now = new Date();
    const startDate = new Date(schedule[0]);
    const endDate = new Date(schedule[schedule.length - 1]);
    if (now < startDate) {
        return needRegister ? "reserveSoon" : "soon";
    }
    if (now > endDate) {
        return "finished";
    }
    return needRegister ? "reserveNow" : "now";
};
const statusTag = {
    calculate,
};
exports.default = statusTag;
