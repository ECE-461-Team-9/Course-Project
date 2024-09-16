"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.License = void 0;
var License = /** @class */ (function (_super) {
    __extends(License, _super);
    function License(score, expiryDate, isValid) {
        if (score === void 0) { score = 0; }
        if (expiryDate === void 0) { expiryDate = new Date(); }
        if (isValid === void 0) { isValid = true; }
        var _this = _super.call(this, score) || this;
        _this.expiryDate = expiryDate;
        _this.isValid = isValid;
        return _this;
    }
    License.prototype.checkLicenseStatus = function () {
        var today = new Date();
        return this.isValid && today < this.expiryDate;
    };
    License.prototype.updateLicenseStatus = function (isValid) {
        this.isValid = isValid;
    };
    License.prototype.updateExpiryDate = function (newExpiryDate) {
        this.expiryDate = newExpiryDate;
    };
    License.prototype.getLicenseExpiry = function () {
        return this.expiryDate;
    };
    return License;
}(Metric));
exports.License = License;
