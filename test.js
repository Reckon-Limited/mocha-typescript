"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const index_1 = require("./index");
var child_process = require("child_process");
var assert = require("better-assert");
var chai = require("chai");
var fs = require("fs");
var spawnSync = child_process.spawnSync;
// @pending class One {
//     @pending test1() {};
//     @test test2() {};
//     @only test3() {}
// }
let SuiteTest = class SuiteTest {
    es5() {
        this.run("es5", "test.suite");
    }
    es6() {
        this.run("es6", "test.suite");
    }
    "only suite es5"() {
        this.run("es5", "only.suite");
    }
    "only suite es6"() {
        this.run("es6", "only.suite");
    }
    "pending suite es5"() {
        this.run("es5", "pending.suite");
    }
    "pending suite es6"() {
        this.run("es6", "pending.suite");
    }
    run(target, ts) {
        let tsc = spawnSync("node", ["./node_modules/typescript/bin/tsc", "--experimentalDecorators", "--module", "commonjs", "--target", target, "tests/" + ts + ".ts"]);
        console.log(tsc.stdout.toString());
        assert(tsc.stdout.toString() === "");
        assert(tsc.status === 0);
        let mocha = spawnSync("node", ["./node_modules/mocha/bin/_mocha", "tests/" + ts + ".js"]);
        // To debug any actual output while developing:
        // assert(mocha.status !== 0);
        let actual = mocha.stdout.toString().split("\n");
        let expected = fs.readFileSync("./tests/" + ts + ".expected.txt", "utf-8").split("\n");
        // To patch the expected use the output of this, but clean up times and callstacks:
        // console.log("exp: " + actual);
        for (var i = 0; i < expected.length; i++) {
            let expectedLine = expected[i].trim();
            let actualLine = actual[i].trim();
            if (actualLine.indexOf(expectedLine) === -1) {
                throw new Error("Unexpected output. Expected: '" + expectedLine + "' to be contained in '" + actualLine + "'");
            }
        }
    }
};
__decorate([
    index_1.test("target es5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiteTest.prototype, "es5", null);
__decorate([
    index_1.test("target es6"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiteTest.prototype, "es6", null);
__decorate([
    index_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiteTest.prototype, "only suite es5", null);
__decorate([
    index_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiteTest.prototype, "only suite es6", null);
__decorate([
    index_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiteTest.prototype, "pending suite es5", null);
__decorate([
    index_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuiteTest.prototype, "pending suite es6", null);
SuiteTest = __decorate([
    index_1.suite("typescript"), index_1.slow(5000), index_1.timeout(15000)
], SuiteTest);
//# sourceMappingURL=test.js.map