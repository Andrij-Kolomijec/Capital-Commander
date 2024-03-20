"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDate = exports.isValidNumber = exports.isValidText = void 0;
function isValidText(value) {
    return value && value.trim().length > 0;
}
exports.isValidText = isValidText;
function isValidNumber(value) {
    return typeof value === "number" && !isNaN(value);
}
exports.isValidNumber = isValidNumber;
function isValidDate(value) {
    const date = new Date(value);
    return value && !isNaN(date.getTime());
}
exports.isValidDate = isValidDate;
