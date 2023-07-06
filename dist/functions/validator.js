"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidWonderLocation = exports.isValidWonderSchedule = exports.isValidWonderTitle = exports.isValidInstagram = exports.isValidCreatorSummary = exports.isValidCreatorName = exports.isValidRegisterPhoneNumber = exports.isValidRegisterName = exports.isValidRegisterEmail = void 0;
const isValidRegisterEmail = (input) => !(input.length < 5) && input.includes("@");
exports.isValidRegisterEmail = isValidRegisterEmail;
const isValidRegisterName = (input) => !(input.length < 2) && !(input.length > 30);
exports.isValidRegisterName = isValidRegisterName;
const isValidRegisterPhoneNumber = (input) => (input.length === 11 || 13) &&
    (input.startsWith("010") || input.startsWith("+8210"));
exports.isValidRegisterPhoneNumber = isValidRegisterPhoneNumber;
/**
 * New Creator
 */
const isValidCreatorName = (input) => !(input.length < 2 || input.length > 15);
exports.isValidCreatorName = isValidCreatorName;
const isValidCreatorSummary = (input) => !(input.length < 1 || input.length > 30);
exports.isValidCreatorSummary = isValidCreatorSummary;
const isValidInstagram = (input) => input.length === 0 || input[0] === "@";
exports.isValidInstagram = isValidInstagram;
/**
 * New Wonder
 */
const isValidWonderTitle = (input) => !(input.length < 2 || input.length > 30);
exports.isValidWonderTitle = isValidWonderTitle;
const isValidWonderSchedule = (input) => input.length > 0;
exports.isValidWonderSchedule = isValidWonderSchedule;
const isValidWonderLocation = (input) => input.name.length > 0;
exports.isValidWonderLocation = isValidWonderLocation;
