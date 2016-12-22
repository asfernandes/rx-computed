"use strict";
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var rx_computed_1 = require("../lib/rx-computed");
var assert = require("power-assert");
describe("RxComputed", function () {
    it('sync without dependencies', function () {
        var counter = 0;
        var computed = rx_computed_1.RxComputed.sync(function () {
            ++counter;
            return 1;
        });
        assert.equal(counter, 1);
        assert.equal(computed.value, 1);
    });
    it('sync with two dependencies', function () {
        var counter = 0;
        var n1 = new BehaviorSubject_1.BehaviorSubject(10);
        var n2 = new BehaviorSubject_1.BehaviorSubject(100);
        var computed = rx_computed_1.RxComputed.sync(function (context) {
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
    });
    it('sync with one dependency read two times', function () {
        var counter = 0;
        var n = new BehaviorSubject_1.BehaviorSubject(10);
        var computed = rx_computed_1.RxComputed.sync(function (context) {
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
    });
    it('sync with one dependency used in two computeds', function () {
        var counter1 = 0, counter2 = 0;
        var n = new BehaviorSubject_1.BehaviorSubject(10);
        var computed1 = rx_computed_1.RxComputed.sync(function (context) {
            ++counter1;
            return context.get(n);
        });
        var computed2 = rx_computed_1.RxComputed.sync(function (context) {
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
    });
});
