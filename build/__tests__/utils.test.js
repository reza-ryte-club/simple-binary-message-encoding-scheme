"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
describe('add', function () {
    it('should add two numbers', function () {
        expect((0, utils_1.add)(1, 2)).toBe(3);
    });
});
