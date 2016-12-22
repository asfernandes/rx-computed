"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var RxComputedContextImpl = (function () {
    function RxComputedContextImpl(func, subject) {
        this.func = func;
        this.subject = subject;
        this.subscriptions = [];
        this.update();
    }
    RxComputedContextImpl.prototype.track = function (observable) {
        var _this = this;
        var first = true;
        this.subscriptions.push(observable.subscribe(function (val) {
            if (first)
                first = false;
            else
                _this.update();
        }));
    };
    RxComputedContextImpl.prototype.get = function (observable) {
        this.track(observable);
        return observable.value;
    };
    RxComputedContextImpl.prototype.dispose = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        this.subscriptions.splice(0);
    };
    RxComputedContextImpl.prototype.update = function () {
        this.dispose();
        this.subject.next(this.func(this));
    };
    return RxComputedContextImpl;
}());
var RxComputed = (function (_super) {
    __extends(RxComputed, _super);
    function RxComputed(func) {
        var _this = _super.call(this, null) || this;
        _this.context = new RxComputedContextImpl(func, _this);
        return _this;
    }
    RxComputed.sync = function (func) {
        return new RxComputed(func);
    };
    RxComputed.prototype.dispose = function () {
        this.context.dispose();
    };
    return RxComputed;
}(BehaviorSubject_1.BehaviorSubject));
exports.RxComputed = RxComputed;
