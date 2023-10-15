"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWonderScheduleString = exports.translateWonderStatus = exports.translateWonderGenre = exports.parseWonderRemote = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const parseWonderRemote = (remote) => {
    const { schedule } = remote, rest = __rest(remote, ["schedule"]);
    return Object.assign(Object.assign({}, rest), { schedule: schedule.map((dateString) => (0, dayjs_1.default)(dateString).toDate()), tag: {
            genre: "play",
            status: "reserveNow",
        } });
};
exports.parseWonderRemote = parseWonderRemote;
const translateWonderGenre = (genre) => {
    if (genre === "play")
        return "연극";
    return "잘못된 장르";
};
exports.translateWonderGenre = translateWonderGenre;
const translateWonderStatus = (status) => {
    if (status === "reserveSoon")
        return "예약 예정";
    if (status === "reserveNow")
        return "예약 중";
    if (status === "reserveFinished")
        return "예약 마감";
    if (status === "soon")
        return "진행 예정";
    if (status === "now")
        return "진행 중";
    if (status === "finished")
        return "종료";
    return "상태 오류";
};
exports.translateWonderStatus = translateWonderStatus;
const parseWonderScheduleString = (schedule) => {
    const startDate = schedule[0];
    const endDate = schedule[schedule.length - 1];
    if (startDate === endDate) {
        return (0, dayjs_1.default)(startDate).format("MM.DD");
    }
    return `${(0, dayjs_1.default)(startDate).format("MM.DD")}-${(0, dayjs_1.default)(endDate).format("MM.DD")}`;
};
exports.parseWonderScheduleString = parseWonderScheduleString;
