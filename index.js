"use strict";
let describeFunction = global.describe;
let skipSuiteFunction = describeFunction.skip;
let onlySuiteFunction = describeFunction.only;
let itFunction = global.it;
let skipFunction = itFunction.skip;
let onlyFunction = itFunction.only;
let pendingFunction = itFunction;
let beforeAll = global.before;
let beforeEach = global.beforeEach;
let afterAll = global.after;
let afterEach = global.afterEach;
//let nodeSymbol = global.Symbol || (key => "__mts_" + key);
let nodeSymbol = (key => "__mts_" + key);
let testNameSymbol = nodeSymbol("test");
let slowSymbol = nodeSymbol("slow");
let timeoutSymbol = nodeSymbol("timout");
let onlySymbol = nodeSymbol("only");
let pendingSumbol = nodeSymbol("pending");
let skipSymbol = nodeSymbol("skip");
let handled = nodeSymbol("handled");
function applyDecorators(target) {
    const timeoutValue = target[timeoutSymbol];
    if (typeof timeoutValue === "number") {
        this.timeout(timeoutValue);
    }
    const slowValue = target[slowSymbol];
    if (typeof slowValue === "number") {
        this.slow(slowValue);
    }
}
const noname = (cb) => cb;
function suite(target) {
    let decoratorName = typeof target === "string" && target;
    function result(target) {
        let targetName = decoratorName || target.name;
        let shouldSkip = target[skipSymbol];
        let shouldOnly = target[onlySymbol];
        let shouldPending = target[pendingSumbol];
        let suiteFunc = (shouldSkip && skipSuiteFunction)
            || (shouldOnly && onlySuiteFunction)
            || (shouldPending && skipSuiteFunction)
            || describeFunction;
        suiteFunc(targetName, function () {
            applyDecorators.call(this, target);
            let instance;
            if (target.before) {
                if (target.before.length > 0) {
                    beforeAll(function (done) {
                        applyDecorators.call(this, target.before);
                        return target.before(done);
                    });
                }
                else {
                    beforeAll(function () {
                        applyDecorators.call(this, target.before);
                        return target.before();
                    });
                }
            }
            if (target.after) {
                if (target.after.length > 0) {
                    afterAll(function (done) {
                        applyDecorators.call(this, target.after);
                        return target.after(done);
                    });
                }
                else {
                    afterAll(function () {
                        applyDecorators.call(this, target.after);
                        return target.after();
                    });
                }
            }
            let prototype = target.prototype;
            let beforeEachFunction;
            if (prototype.before) {
                if (prototype.before.length > 0) {
                    beforeEachFunction = noname(function (done) {
                        instance = new target();
                        applyDecorators.call(this, prototype.before);
                        return prototype.before.call(instance, done);
                    });
                }
                else {
                    beforeEachFunction = noname(function () {
                        instance = new target();
                        applyDecorators.call(this, prototype.before);
                        return prototype.before.call(instance);
                    });
                }
            }
            else {
                beforeEachFunction = noname(function () {
                    instance = new target();
                });
            }
            beforeEach(beforeEachFunction);
            let afterEachFunction;
            if (prototype.after) {
                if (prototype.after.length > 0) {
                    afterEachFunction = noname(function (done) {
                        try {
                            applyDecorators.call(this, prototype.after);
                            return prototype.after.call(instance, done);
                        }
                        finally {
                            instance = undefined;
                        }
                    });
                }
                else {
                    afterEachFunction = noname(function () {
                        try {
                            applyDecorators.call(this, prototype.after);
                            return prototype.after.call(instance);
                        }
                        finally {
                            instance = undefined;
                        }
                    });
                }
            }
            else {
                afterEachFunction = noname(function () {
                    instance = undefined;
                });
            }
            afterEach(afterEachFunction);
            Object.getOwnPropertyNames(prototype).forEach(key => {
                try {
                    let method = prototype[key];
                    if (method === target) {
                        return;
                    }
                    let testName = method[testNameSymbol];
                    let shouldSkip = method[skipSymbol];
                    let shouldOnly = method[onlySymbol];
                    let shouldPending = method[pendingSumbol];
                    let testFunc = (shouldSkip && skipFunction)
                        || (shouldOnly && onlyFunction)
                        || itFunction;
                    if (testName || shouldOnly || shouldPending || shouldSkip) {
                        testName = testName || method.name;
                        if (shouldPending && !shouldSkip && !shouldOnly) {
                            pendingFunction(testName);
                        }
                        else if (method.length > 0) {
                            testFunc(testName, noname(function (done) {
                                applyDecorators.call(this, method);
                                return method.call(instance, done);
                            }));
                        }
                        else {
                            testFunc(testName, noname(function () {
                                applyDecorators.call(this, method);
                                return method.call(instance);
                            }));
                        }
                    }
                }
                catch (e) {
                }
            });
        });
    }
    return decoratorName ? result : result(target);
}
exports.suite = suite;
function test(target, propertyKey) {
    let decoratorName = typeof target === "string" && target;
    let result = (target, propertyKey) => {
        target[propertyKey][testNameSymbol] = decoratorName || propertyKey;
    };
    return decoratorName ? result : result(target, propertyKey);
}
exports.test = test;
/**
 * Set a test method execution time that is considered slow.
 * @param time The time in miliseconds.
 */
function slow(time) {
    return function (target, propertyKey) {
        if (arguments.length === 1) {
            target[slowSymbol] = time;
        }
        else {
            target[propertyKey][slowSymbol] = time;
        }
    };
}
exports.slow = slow;
/**
 * Set a test method or suite timeout time.
 * @param time The time in miliseconds.
 */
function timeout(time) {
    return function (target, propertyKey) {
        if (arguments.length === 1) {
            target[timeoutSymbol] = time;
        }
        else {
            target[propertyKey][timeoutSymbol] = time;
        }
    };
}
exports.timeout = timeout;
/**
 * Mart a test or suite as pending.
 *  - Used as `@suite @pending class` is `describe.skip("name", ...);`.
 *  - Used as `@test @pending method` is `it("name");`
 */
function pending(target, propertyKey) {
    if (arguments.length === 1) {
        target[pendingSumbol] = true;
    }
    else {
        target[propertyKey][pendingSumbol] = true;
    }
}
exports.pending = pending;
/**
 * Mark a test or suite as the only one to execute.
 *  - Used as `@suite @only class` is `describe.only("name", ...)`.
 *  - Used as `@test @only method` is `it.only("name", ...)`.
 */
function only(target, propertyKey) {
    if (arguments.length === 1) {
        target[onlySymbol] = true;
    }
    else {
        target[propertyKey][onlySymbol] = true;
    }
}
exports.only = only;
/**
 * Mark a test or suite to skip.
 *  - Used as `@suite @skip class` is `describe.skip("name", ...);`.
 *  - Used as `@test @skip method` is `it.skip("name")`.
 */
function skip(target, propertyKey) {
    if (arguments.length === 1) {
        target[onlySymbol] = true;
    }
    else {
        target[propertyKey][skipSymbol] = true;
    }
}
exports.skip = skip;
//# sourceMappingURL=index.js.map