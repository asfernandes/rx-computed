"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var sourceMapSupport = require("source-map-support");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var __1 = require("..");
var assert = require("power-assert");
sourceMapSupport.install();
describe("RxComputed", function () {
    var _this = this;
    it('sync without dependencies', function () {
        var counter = 0;
        var computed = __1.RxComputed.sync(function () {
            ++counter;
            return 1;
        });
        assert.equal(counter, 1);
        assert.equal(computed.value, 1);
    });
    it('sync with two dependencies', function () {
        var counter = 0;
        var n1 = new BehaviorSubject_1.BehaviorSubject(0);
        var n2 = new BehaviorSubject_1.BehaviorSubject(100);
        n1.next(9);
        n1.next(10);
        var computed = __1.RxComputed.sync(function (context) {
            ++counter;
            return context.get(n1) + context.get(n2);
        });
        assert.equal(counter, 1);
        assert.equal(computed.value, 110);
        n1.next(11);
        assert.equal(counter, 2);
        assert.equal(computed.value, 111);
        n2.next(200);
        assert.equal(counter, 3);
        assert.equal(computed.value, 211);
        computed.dispose();
        n1.next(12);
        n2.next(300);
        assert.equal(counter, 3);
    });
    it('sync with one dependency read two times', function () {
        var counter = 0;
        var n = new BehaviorSubject_1.BehaviorSubject(10);
        var computed = __1.RxComputed.sync(function (context) {
            ++counter;
            return context.get(n) + context.get(n);
        });
        assert.equal(counter, 1);
        assert.equal(computed.value, 20);
        n.next(11);
        assert.equal(counter, 2);
        assert.equal(computed.value, 22);
        n.next(13);
        assert.equal(counter, 3);
        assert.equal(computed.value, 26);
        computed.dispose();
        n.next(14);
        assert.equal(counter, 3);
    });
    it('sync with one dependency used in two computeds', function () {
        var counter1 = 0, counter2 = 0;
        var n = new BehaviorSubject_1.BehaviorSubject(10);
        var computed1 = __1.RxComputed.sync(function (context) {
            ++counter1;
            return context.get(n);
        });
        var computed2 = __1.RxComputed.sync(function (context) {
            ++counter2;
            return context.get(n);
        });
        assert.equal(counter1, 1);
        assert.equal(counter1, 1);
        assert.equal(computed1.value, 10);
        assert.equal(computed1.value, 10);
        n.next(20);
        assert.equal(counter1, 2);
        assert.equal(counter2, 2);
        assert.equal(computed1.value, 20);
        assert.equal(computed2.value, 20);
        n.next(30);
        assert.equal(counter1, 3);
        assert.equal(counter2, 3);
        assert.equal(computed1.value, 30);
        assert.equal(computed2.value, 30);
        computed1.dispose();
        computed2.dispose();
        n.next(40);
        assert.equal(counter1, 3);
        assert.equal(counter2, 3);
    });
    it('sync with one track dependency to BehaviorSubject', function () {
        var counter = 0;
        var n = new BehaviorSubject_1.BehaviorSubject(1);
        var computed = __1.RxComputed.sync(function (context) {
            ++counter;
            context.track(n);
            return counter;
        });
        assert.equal(counter, 1);
        assert.equal(computed.value, 1);
        assert.equal(counter, 1);
        assert.equal(computed.value, 1);
        n.next(n.value + 1);
        assert.equal(counter, 2);
        assert.equal(computed.value, 2);
        computed.dispose();
    });
    it('async with one dependency', function () { return __awaiter(_this, void 0, void 0, function () {
        var counter, n1, computed, resolve, promise, emit, numbers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    counter = 0;
                    n1 = new BehaviorSubject_1.BehaviorSubject(10);
                    computed = __1.RxComputed.async(function (context) {
                        ++counter;
                        var val1 = context.get(n1);
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve(val1 + 1);
                            }, 10);
                        });
                    });
                    assert.equal(counter, 1);
                    assert.equal(computed.value, null);
                    promise = new Promise(function (resolver) { return resolve = resolver; });
                    emit = [20, 30, 40];
                    computed
                        .take(2 + emit.length)
                        .toArray()
                        .subscribe(function (array) { return resolve(array); });
                    emit.forEach(function (n) { return n1.next(n); });
                    return [4 /*yield*/, promise];
                case 1:
                    numbers = _a.sent();
                    assert.equal(numbers.length, 2 + emit.length);
                    assert.equal(numbers[0], null);
                    assert.equal(numbers[1], 11);
                    emit.forEach(function (n, index) { return assert.equal(numbers[2 + index], n + 1); });
                    computed.dispose();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=rx-computed.js.map