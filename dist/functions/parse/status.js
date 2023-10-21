"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseStatusTag(schedule, needRegister) {
    const now = new Date();
    const startDate = schedule[0];
    const endDate = schedule[schedule.length - 1];
    if (now < startDate) {
        return needRegister ? "reserveSoon" : "soon";
    }
    if (now > endDate) {
        return "finished";
    }
    return needRegister ? "reserveNow" : "now";
}
exports.default = parseStatusTag;
