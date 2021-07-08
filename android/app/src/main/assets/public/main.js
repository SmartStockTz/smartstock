(self["webpackChunksmartstock"] = self["webpackChunksmartstock"] || []).push([["main"],{

/***/ 98255:
/*!*******************************************************!*\
  !*** ./$_lazy_route_resources/ lazy namespace object ***!
  \*******************************************************/
/***/ (function(module) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 98255;
module.exports = webpackEmptyAsyncContext;

/***/ }),

/***/ 55041:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": function() { return /* binding */ AppComponent; }
/* harmony export */ });
/* harmony import */ var _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @smartstocktz/core-libs */ 87525);
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bfastjs */ 59834);
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bfastjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _workers_background_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./workers/background.service */ 72714);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 39895);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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







var AppComponent = /** @class */ (function () {
    function AppComponent(backgroundService, eventApi, _storage) {
        this.backgroundService = backgroundService;
        this.eventApi = eventApi;
        this._storage = _storage;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.eventApi.listen(_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.SsmEvents.ACTIVE_SHOP_SET, function ($event) { return __awaiter(_this, void 0, void 0, function () {
            var activeShop, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this._storage.getActiveShop()];
                    case 1:
                        activeShop = _a.sent();
                        bfastjs__WEBPACK_IMPORTED_MODULE_0___default().init({ applicationId: activeShop.applicationId, projectId: activeShop.projectId }, activeShop.projectId);
                        return [4 /*yield*/, this.backgroundService.start()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        this.eventApi.listen(_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.SsmEvents.ACTIVE_SHOP_REMOVE, function ($event) { return __awaiter(_this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        bfastjs__WEBPACK_IMPORTED_MODULE_0___default().init({ applicationId: 'smartstock_lb', projectId: 'smartstock' });
                        return [4 /*yield*/, this.backgroundService.stop()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        this._storage.getActiveShop().then(function (_) {
            if (_) {
                _this.eventApi.broadcast(_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.SsmEvents.ACTIVE_SHOP_SET);
            }
            else {
                throw new Error('Shop is undefined');
            }
        }).catch(function (_) {
            _this.eventApi.broadcast(_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.SsmEvents.ACTIVE_SHOP_REMOVE);
        });
    };
    AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_workers_background_service__WEBPACK_IMPORTED_MODULE_1__.BackgroundService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.EventService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.StorageService)); };
    AppComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["smartstock-root"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵProvidersFeature"]([
                _workers_background_service__WEBPACK_IMPORTED_MODULE_1__.BackgroundService,
            ])], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "router-outlet");
        } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterOutlet], encapsulation: 2 });
    return AppComponent;
}());



/***/ }),

/***/ 51306:
/*!********************************************************!*\
  !*** ./src/app/components/payment-dialog.component.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PaymentDialogComponent": function() { return /* binding */ PaymentDialogComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ 22238);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 51095);



var PaymentDialogComponent = /** @class */ (function () {
    function PaymentDialogComponent(dialogRef) {
        this.dialogRef = dialogRef;
    }
    PaymentDialogComponent.ɵfac = function PaymentDialogComponent_Factory(t) { return new (t || PaymentDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogRef)); };
    PaymentDialogComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PaymentDialogComponent, selectors: [["ng-component"]], decls: 9, vars: 0, consts: [["mat-dialog-title", ""], ["mat-dialog-content", ""], ["mat-dialog-actions", ""], ["color", "primary", "mat-button", "", 3, "click"]], template: function PaymentDialogComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Payment");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Please make payment to continue using the system");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 2);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 3);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaymentDialogComponent_Template_button_click_7_listener() { return ctx.dialogRef.close(); });
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Close");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        } }, directives: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogTitle, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogContent, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogActions, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButton], encapsulation: 2 });
    return PaymentDialogComponent;
}());



/***/ }),

/***/ 92869:
/*!*********************************************!*\
  !*** ./src/app/guards/active-shop.guard.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActiveShopGuard": function() { return /* binding */ ActiveShopGuard; }
/* harmony export */ });
/* harmony import */ var _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @smartstocktz/core-libs */ 87525);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 39895);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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




var ActiveShopGuard = /** @class */ (function () {
    function ActiveShopGuard(_storage, eventService, _router) {
        this._storage = _storage;
        this.eventService = eventService;
        this._router = _router;
    }
    ActiveShopGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var activeShop, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._storage.getActiveShop()];
                    case 1:
                        activeShop = _a.sent();
                        if (activeShop && activeShop.projectId && activeShop.applicationId) {
                            resolve(true);
                        }
                        else {
                            this.eventService.broadcast(_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_0__.SsmEvents.ACTIVE_SHOP_REMOVE);
                            this._router.navigateByUrl('/account/shop').catch(function (reason) { return console.log(reason); });
                            reject(false);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.eventService.broadcast(_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_0__.SsmEvents.ACTIVE_SHOP_REMOVE);
                        this._router.navigateByUrl('/account/shop').catch(function (reason) { return console.log(reason); });
                        reject(false);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ActiveShopGuard.ɵfac = function ActiveShopGuard_Factory(t) { return new (t || ActiveShopGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_0__.StorageService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_0__.EventService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router)); };
    ActiveShopGuard.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: ActiveShopGuard, factory: ActiveShopGuard.ɵfac, providedIn: 'root' });
    return ActiveShopGuard;
}());



/***/ }),

/***/ 31896:
/*!***************************************!*\
  !*** ./src/app/guards/admin.guard.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AdminGuard": function() { return /* binding */ AdminGuard; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 39895);
/* harmony import */ var _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @smartstocktz/core-libs */ 87525);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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



var AdminGuard = /** @class */ (function () {
    function AdminGuard(router, rbacService, userDatabase) {
        this.router = router;
        this.rbacService = rbacService;
        this.userDatabase = userDatabase;
    }
    AdminGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userDatabase.currentUser().then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                var hasAccess, guardAccess;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.hasAccess(['admin'], state.url)];
                        case 1:
                            hasAccess = _a.sent();
                            guardAccess = user && user.applicationId && user.projectId && user.role === 'admin';
                            if (guardAccess || hasAccess) {
                                resolve(true);
                            }
                            else {
                                this.router.navigateByUrl('/sale').catch(function (reason) { return console.log(reason); });
                                reject(false);
                            }
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (_) {
                _this.router.navigateByUrl('/account/login').catch(function (reason) { return console.log(reason); });
                reject(false);
            });
        });
    };
    AdminGuard.ɵfac = function AdminGuard_Factory(t) { return new (t || AdminGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.RbacService), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.UserService)); };
    AdminGuard.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AdminGuard, factory: AdminGuard.ɵfac, providedIn: 'root' });
    return AdminGuard;
}());



/***/ }),

/***/ 66924:
/*!************************************************!*\
  !*** ./src/app/guards/authentication.guard.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthenticationGuard": function() { return /* binding */ AuthenticationGuard; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @smartstocktz/core-libs */ 87525);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 39895);



var AuthenticationGuard = /** @class */ (function () {
    function AuthenticationGuard(userDatabase, router) {
        this.userDatabase = userDatabase;
        this.router = router;
    }
    AuthenticationGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userDatabase.currentUser().then(function (user) {
                if (user && user.applicationId && user.projectId && user.role) {
                    resolve(true);
                }
                else {
                    _this.userDatabase.updateCurrentUser(null).catch(function (_) {
                    });
                    _this.router.navigateByUrl('/account/login').catch(function (reason) { return console.log(reason); });
                    reject(false);
                }
            });
        });
    };
    AuthenticationGuard.ɵfac = function AuthenticationGuard_Factory(t) { return new (t || AuthenticationGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_1__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router)); };
    AuthenticationGuard.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AuthenticationGuard, factory: AuthenticationGuard.ɵfac, providedIn: 'root' });
    return AuthenticationGuard;
}());



/***/ }),

/***/ 71540:
/*!*****************************************!*\
  !*** ./src/app/guards/manager.guard.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ManagerGuard": function() { return /* binding */ ManagerGuard; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @smartstocktz/core-libs */ 87525);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 39895);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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



var ManagerGuard = /** @class */ (function () {
    function ManagerGuard(userDatabase, rbacService, router) {
        this.userDatabase = userDatabase;
        this.rbacService = rbacService;
        this.router = router;
    }
    ManagerGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.userDatabase.currentUser().then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                var hasAccess, guardAccess;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.hasAccess(['admin', 'manager'], state.url)];
                        case 1:
                            hasAccess = _a.sent();
                            guardAccess = user && user.applicationId && user.projectId && (user.role === 'manager' || user.role === 'admin');
                            if (guardAccess || hasAccess) {
                                resolve(true);
                            }
                            else {
                                this.router.navigateByUrl('/account/login').catch(function (reason) { return console.log(reason); });
                                reject(false);
                            }
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (_) {
                _this.router.navigateByUrl('/account/login').catch(function (reason) { return console.log(reason); });
                reject(false);
            });
        });
    };
    ManagerGuard.ɵfac = function ManagerGuard_Factory(t) { return new (t || ManagerGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_1__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_1__.RbacService), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router)); };
    ManagerGuard.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: ManagerGuard, factory: ManagerGuard.ɵfac, providedIn: 'root' });
    return ManagerGuard;
}());



/***/ }),

/***/ 71314:
/*!*****************************************!*\
  !*** ./src/app/guards/payment.guard.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PaymentGuard": function() { return /* binding */ PaymentGuard; }
/* harmony export */ });
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bfastjs */ 59834);
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bfastjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 39895);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/dialog */ 22238);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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




var PaymentGuard = /** @class */ (function () {
    function PaymentGuard(router, dialog) {
        this.router = router;
        this.dialog = dialog;
    }
    PaymentGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var cache, status_1, reason_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        cache = bfastjs__WEBPACK_IMPORTED_MODULE_0__.bfast.cache({ database: 'payment', collection: 'subscription' });
                        return [4 /*yield*/, cache.get('status', { secure: true })];
                    case 1:
                        status_1 = _a.sent();
                        if (status_1 && status_1.subscription === true) {
                            resolve(true);
                        }
                        else if (status_1 && status_1.subscription === false) {
                            reject(false);
                            this.router.navigateByUrl('/account/bill').catch(function (_) {
                            });
                        }
                        else {
                            resolve(true);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        reason_1 = _a.sent();
                        resolve(true);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    PaymentGuard.ɵfac = function PaymentGuard_Factory(t) { return new (t || PaymentGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialog)); };
    PaymentGuard.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: PaymentGuard, factory: PaymentGuard.ɵfac, providedIn: 'root' });
    return PaymentGuard;
}());



/***/ }),

/***/ 9751:
/*!*************************************!*\
  !*** ./src/app/guards/web.guard.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebGuard": function() { return /* binding */ WebGuard; }
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../environments/environment */ 92340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @smartstocktz/core-libs */ 87525);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 39895);




var WebGuard = /** @class */ (function () {
    function WebGuard(userDatabase, router) {
        this.userDatabase = userDatabase;
        this.router = router;
    }
    WebGuard.prototype.canActivate = function (next, state) {
        if (_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.electron === true) {
            this.router.navigateByUrl('/dashboard').catch();
            return false;
        }
        else {
            return true;
        }
    };
    WebGuard.ɵfac = function WebGuard_Factory(t) { return new (t || WebGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router)); };
    WebGuard.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: WebGuard, factory: WebGuard.ɵfac, providedIn: 'root' });
    return WebGuard;
}());



/***/ }),

/***/ 82847:
/*!**************************************!*\
  !*** ./src/app/smartstock.module.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SmartstockModule": function() { return /* binding */ SmartstockModule; }
/* harmony export */ });
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/platform-browser/animations */ 75835);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../environments/environment */ 92340);
/* harmony import */ var _angular_material_slider__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/slider */ 54436);
/* harmony import */ var _angular_material_stepper__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/stepper */ 94553);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/tooltip */ 11436);
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bfastjs */ 59834);
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bfastjs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ 55041);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/router */ 39895);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/snack-bar */ 77001);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/common/http */ 91841);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/material/core */ 5015);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @angular/platform-browser */ 39075);
/* harmony import */ var _guards_authentication_guard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./guards/authentication.guard */ 66924);
/* harmony import */ var _guards_admin_guard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./guards/admin.guard */ 31896);
/* harmony import */ var _guards_active_shop_guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./guards/active-shop.guard */ 92869);
/* harmony import */ var _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @smartstocktz/core-libs */ 87525);
/* harmony import */ var _guards_manager_guard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./guards/manager.guard */ 71540);
/* harmony import */ var _guards_web_guard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./guards/web.guard */ 9751);
/* harmony import */ var firebase__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! firebase */ 76797);
/* harmony import */ var _guards_payment_guard__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./guards/payment.guard */ 71314);
/* harmony import */ var _components_payment_dialog_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/payment-dialog.component */ 51306);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/material/dialog */ 22238);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/material/button */ 51095);
/* harmony import */ var _angular_service_worker__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/service-worker */ 72249);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 36410);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _smartstocktz_sales__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @smartstocktz/sales */ 56711);
/* harmony import */ var _smartstocktz_reports__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @smartstocktz/reports */ 67944);
/* harmony import */ var _smartstocktz_stocks__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @smartstocktz/stocks */ 15240);
/* harmony import */ var _smartstocktz_purchases__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @smartstocktz/purchases */ 48081);
/* harmony import */ var _smartstocktz_expense__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @smartstocktz/expense */ 36104);
/* harmony import */ var _smartstocktz_store__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @smartstocktz/store */ 65338);
/* harmony import */ var _smartstocktz_accounts__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @smartstocktz/accounts */ 71774);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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




































var routes = [
    {
        path: '',
        canActivate: [_guards_web_guard__WEBPACK_IMPORTED_MODULE_7__.WebGuard],
        loadChildren: function () {
            return __webpack_require__.e(/*! import() */ "node_modules_smartstocktz_web___ivy_ngcc___fesm2015_smartstocktz-web_js").then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/web */ 98872)).then(function (mod) { return mod.WebModule; });
        },
    },
    {
        path: 'dashboard',
        canActivate: [_guards_payment_guard__WEBPACK_IMPORTED_MODULE_9__.PaymentGuard, _guards_authentication_guard__WEBPACK_IMPORTED_MODULE_3__.AuthenticationGuard, _guards_admin_guard__WEBPACK_IMPORTED_MODULE_4__.AdminGuard, _guards_active_shop_guard__WEBPACK_IMPORTED_MODULE_5__.ActiveShopGuard],
        loadChildren: function () { return __webpack_require__.e(/*! import() */ "node_modules_smartstocktz_dashboard___ivy_ngcc___fesm2015_smartstocktz-dashboard_js").then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/dashboard */ 7358)).then(function (mod) { return mod.DashboardModule; }); }
    },
    {
        path: 'report',
        canActivate: [_guards_payment_guard__WEBPACK_IMPORTED_MODULE_9__.PaymentGuard, _guards_authentication_guard__WEBPACK_IMPORTED_MODULE_3__.AuthenticationGuard, _guards_admin_guard__WEBPACK_IMPORTED_MODULE_4__.AdminGuard, _guards_active_shop_guard__WEBPACK_IMPORTED_MODULE_5__.ActiveShopGuard],
        loadChildren: function () { return Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/reports */ 67944)).then(function (mod) { return mod.ReportsModule; }); }
    },
    {
        path: 'sale',
        canActivate: [_guards_payment_guard__WEBPACK_IMPORTED_MODULE_9__.PaymentGuard, _guards_authentication_guard__WEBPACK_IMPORTED_MODULE_3__.AuthenticationGuard, _guards_active_shop_guard__WEBPACK_IMPORTED_MODULE_5__.ActiveShopGuard],
        loadChildren: function () { return Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/sales */ 56711)).then(function (mod) { return mod.SalesModule; }); }
    },
    {
        path: 'expense',
        canActivate: [_guards_payment_guard__WEBPACK_IMPORTED_MODULE_9__.PaymentGuard, _guards_manager_guard__WEBPACK_IMPORTED_MODULE_6__.ManagerGuard, _guards_active_shop_guard__WEBPACK_IMPORTED_MODULE_5__.ActiveShopGuard],
        loadChildren: function () { return Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/expense */ 36104)).then(function (mod) { return mod.ExpenseModule; }); }
    },
    {
        path: 'store',
        canActivate: [_guards_payment_guard__WEBPACK_IMPORTED_MODULE_9__.PaymentGuard, _guards_manager_guard__WEBPACK_IMPORTED_MODULE_6__.ManagerGuard, _guards_active_shop_guard__WEBPACK_IMPORTED_MODULE_5__.ActiveShopGuard],
        loadChildren: function () { return Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/store */ 65338)).then(function (mod) { return mod.StoreModule; }); }
    },
    {
        path: 'stock',
        canActivate: [_guards_payment_guard__WEBPACK_IMPORTED_MODULE_9__.PaymentGuard, _guards_authentication_guard__WEBPACK_IMPORTED_MODULE_3__.AuthenticationGuard, _guards_manager_guard__WEBPACK_IMPORTED_MODULE_6__.ManagerGuard, _guards_active_shop_guard__WEBPACK_IMPORTED_MODULE_5__.ActiveShopGuard],
        loadChildren: function () { return __awaiter(void 0, void 0, void 0, function () {
            var shop;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_11__.StorageService(new _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_11__.EventService()).getActiveShop()];
                    case 1:
                        shop = _a.sent();
                        if (shop && shop.settings && shop.settings.module && shop.settings.module.stock) {
                            switch (shop.settings.module.stock.toString().trim()) {
                                case '@smartstocktz/stocks':
                                    return [2 /*return*/, Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/stocks */ 15240)).then(function (mod) { return mod.StocksModule; })];
                                case '@smartstocktz/stocks-real-estate':
                                    return [2 /*return*/, __webpack_require__.e(/*! import() */ "node_modules_smartstocktz_stocks-real-estate___ivy_ngcc___fesm2015_smartstocktz-stocks-real-e-2eb3d8").then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/stocks-real-estate */ 40390)).then(function (mod) { return mod.StocksModule; })];
                                default:
                                    return [2 /*return*/, Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/stocks */ 15240)).then(function (mod) { return mod.StocksModule; })];
                            }
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/stocks */ 15240)).then(function (mod) { return mod.StocksModule; })];
                        }
                        return [2 /*return*/];
                }
            });
        }); }
    },
    {
        path: 'purchase',
        canActivate: [_guards_payment_guard__WEBPACK_IMPORTED_MODULE_9__.PaymentGuard, _guards_authentication_guard__WEBPACK_IMPORTED_MODULE_3__.AuthenticationGuard, _guards_manager_guard__WEBPACK_IMPORTED_MODULE_6__.ManagerGuard, _guards_active_shop_guard__WEBPACK_IMPORTED_MODULE_5__.ActiveShopGuard],
        loadChildren: function () { return Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/purchases */ 48081)).then(function (mod) { return mod.PurchasesModule; }); }
    },
    {
        path: 'account',
        loadChildren: function () { return Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! @smartstocktz/accounts */ 71774)).then(function (mod) { return mod.AccountModule; }); }
    },
    {
        path: 'home',
        redirectTo: 'dashboard'
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
var SmartstockModule = /** @class */ (function () {
    function SmartstockModule(config, salesNav, reportNav, stockNav, purchaseNav, expenseNav, storeNav, accountNav) {
        var _this = this;
        this.config = config;
        this.salesNav = salesNav;
        this.reportNav = reportNav;
        this.stockNav = stockNav;
        this.purchaseNav = purchaseNav;
        this.expenseNav = expenseNav;
        this.storeNav = storeNav;
        this.accountNav = accountNav;
        firebase__WEBPACK_IMPORTED_MODULE_8__.default.initializeApp(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.firebase);
        firebase__WEBPACK_IMPORTED_MODULE_8__.default.analytics();
        // @ts-ignore
        __webpack_require__.e(/*! import() */ "package_json").then(__webpack_require__.t.bind(__webpack_require__, /*! ../../package.json */ 60306, 19)).then(function (pkg) {
            _this.config.versionName = pkg.version;
            _this.config.production = true;
        });
        bfastjs__WEBPACK_IMPORTED_MODULE_1__.BFast.init({
            applicationId: _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.smartstock.applicationId,
            projectId: _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.smartstock.projectId,
            appPassword: _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.smartstock.pass
        });
        bfastjs__WEBPACK_IMPORTED_MODULE_1__.BFast.init({
            applicationId: _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.fahamupay.applicationId,
            projectId: _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.fahamupay.projectId,
            appPassword: _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.fahamupay.pass
        }, _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.fahamupay.projectId);
        [
            {
                name: 'Dashboard',
                link: '/dashboard',
                roles: ['admin'],
                icon: 'dashboard',
                pages: []
            },
            {
                name: 'Report',
                link: '/report',
                roles: ['admin'],
                icon: 'table_chart',
                pages: []
            },
            {
                name: 'Sale',
                link: '/sale',
                roles: ['*'],
                icon: 'shop_front',
                pages: []
            },
            {
                name: 'Purchase',
                link: '/purchase',
                roles: ['manager', 'admin'],
                icon: 'receipt',
                pages: []
            },
            {
                name: 'Stock',
                link: '/stock',
                roles: ['manager', 'admin'],
                icon: 'store',
                pages: []
            },
            {
                name: 'Store',
                link: '/store',
                roles: ['manager', 'admin'],
                icon: 'widgets',
                pages: []
            },
            {
                name: 'Expense',
                link: '/expense',
                roles: ['manager', 'admin'],
                icon: 'receipt',
                pages: []
            },
            {
                name: 'Account',
                link: '/account',
                roles: ['*'],
                icon: 'supervisor_account',
                pages: []
            },
        ].forEach(function (menu) {
            _this.config.addMenu(menu);
        });
        this.reportNav.init();
        this.salesNav.init();
        this.stockNav.init();
        this.purchaseNav.init();
        this.storeNav.init();
        this.expenseNav.init();
        this.accountNav.init();
        config.selectedModuleName = '';
    }
    SmartstockModule.ɵfac = function SmartstockModule_Factory(t) { return new (t || SmartstockModule)(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_11__.ConfigsService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_smartstocktz_sales__WEBPACK_IMPORTED_MODULE_13__.SalesNavigationService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_smartstocktz_reports__WEBPACK_IMPORTED_MODULE_14__.ReportNavigationService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_smartstocktz_stocks__WEBPACK_IMPORTED_MODULE_15__.StockNavigationService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_smartstocktz_purchases__WEBPACK_IMPORTED_MODULE_16__.PurchaseNavigationService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_smartstocktz_expense__WEBPACK_IMPORTED_MODULE_17__.ExpenseNavigationService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_smartstocktz_store__WEBPACK_IMPORTED_MODULE_18__.StoreNavigationService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵinject"](_smartstocktz_accounts__WEBPACK_IMPORTED_MODULE_19__.AccountsNavigationService)); };
    SmartstockModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineNgModule"]({ type: SmartstockModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__.AppComponent] });
    SmartstockModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineInjector"]({ imports: [[
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_20__.BrowserAnimationsModule,
                _angular_router__WEBPACK_IMPORTED_MODULE_21__.RouterModule.forRoot(routes),
                _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_11__.LibModule,
                _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.desktop ? _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_11__.LibModule : _angular_service_worker__WEBPACK_IMPORTED_MODULE_22__.ServiceWorkerModule.register('ngsw-worker.js', { enabled: _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.production }),
                _angular_material_stepper__WEBPACK_IMPORTED_MODULE_23__.MatStepperModule,
                _angular_common_http__WEBPACK_IMPORTED_MODULE_24__.HttpClientModule,
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_25__.MatTooltipModule,
                _angular_material_slider__WEBPACK_IMPORTED_MODULE_26__.MatSliderModule,
                _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_27__.MatSnackBarModule,
                _angular_router__WEBPACK_IMPORTED_MODULE_21__.RouterModule,
                _angular_material_core__WEBPACK_IMPORTED_MODULE_28__.MatNativeDateModule,
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_29__.HammerModule,
                _angular_material_dialog__WEBPACK_IMPORTED_MODULE_30__.MatDialogModule,
                _angular_material_button__WEBPACK_IMPORTED_MODULE_31__.MatButtonModule,
                _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_32__.MatBottomSheetModule
            ]] });
    return SmartstockModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsetNgModuleScope"](SmartstockModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_2__.AppComponent,
        _components_payment_dialog_component__WEBPACK_IMPORTED_MODULE_10__.PaymentDialogComponent], imports: [_angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_20__.BrowserAnimationsModule, _angular_router__WEBPACK_IMPORTED_MODULE_21__.RouterModule, _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_11__.LibModule, _angular_service_worker__WEBPACK_IMPORTED_MODULE_22__.ServiceWorkerModule, _angular_material_stepper__WEBPACK_IMPORTED_MODULE_23__.MatStepperModule,
        _angular_common_http__WEBPACK_IMPORTED_MODULE_24__.HttpClientModule,
        _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_25__.MatTooltipModule,
        _angular_material_slider__WEBPACK_IMPORTED_MODULE_26__.MatSliderModule,
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_27__.MatSnackBarModule,
        _angular_router__WEBPACK_IMPORTED_MODULE_21__.RouterModule,
        _angular_material_core__WEBPACK_IMPORTED_MODULE_28__.MatNativeDateModule,
        _angular_platform_browser__WEBPACK_IMPORTED_MODULE_29__.HammerModule,
        _angular_material_dialog__WEBPACK_IMPORTED_MODULE_30__.MatDialogModule,
        _angular_material_button__WEBPACK_IMPORTED_MODULE_31__.MatButtonModule,
        _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_32__.MatBottomSheetModule] }); })();


/***/ }),

/***/ 72714:
/*!***********************************************!*\
  !*** ./src/app/workers/background.service.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BackgroundService": function() { return /* binding */ BackgroundService; }
/* harmony export */ });
/* harmony import */ var _smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @smartstocktz/core-libs */ 87525);
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bfastjs */ 59834);
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bfastjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_payment_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/payment-dialog.component */ 51306);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _smartstocktz_accounts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @smartstocktz/accounts */ 71774);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/dialog */ 22238);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 39895);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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








var BackgroundService = /** @class */ (function () {
    function BackgroundService(eventApi, billing, dialog, router) {
        this.eventApi = eventApi;
        this.billing = billing;
        this.dialog = dialog;
        this.router = router;
        this.paymentDialogOpen = false;
    }
    BackgroundService.prototype.ngOnInit = function () {
    };
    BackgroundService.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        this._startPaymentWatch();
                        return [4 /*yield*/, this.startSalesProxy()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.startStockUpdateProxy()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.startSettingsWatch()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, 'Done start proxy'];
                    case 4:
                        e_1 = _a.sent();
                        console.warn(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BackgroundService.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._stopWorkers();
                return [2 /*return*/];
            });
        });
    };
    BackgroundService.prototype._stopWorkers = function () {
        // this.swSalesProxyService.stop();
        if (this.salesWorker) {
            this.salesWorker.terminate();
        }
        else {
            this.salesWorker = undefined;
        }
        if (this.stocksWorkerProxy) {
            this.stocksWorkerProxy.terminate();
        }
        else {
            this.stocksWorkerProxy = undefined;
        }
        if (this.settingsWorker) {
            this.settingsWorker.terminate();
        }
        else {
            this.settingsWorker = undefined;
        }
    };
    BackgroundService.prototype.startSalesProxy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (typeof Worker !== 'undefined') {
                        this.salesWorker = new Worker(__webpack_require__.tu(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_app_workers_sales_worker_ts"), __webpack_require__.b)), { type: undefined });
                        this.salesWorker.postMessage({});
                        return [2 /*return*/, 'Ok'];
                    }
                    else {
                        this._noWorkerSalesProxy();
                    }
                }
                catch (e) {
                    this._noWorkerSalesProxy();
                    throw { message: 'Fails to start sales proxy' };
                }
                return [2 /*return*/];
            });
        });
    };
    BackgroundService.prototype.startSettingsWatch = function () {
        try {
            if (typeof Worker !== 'undefined') {
                this.settingsWorker = new Worker(__webpack_require__.tu(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_app_workers_settings_worker_ts"), __webpack_require__.b)), { type: undefined });
                this.settingsWorker.postMessage({});
                return 'Ok';
            }
            else {
                this._noWorkerSettings();
            }
        }
        catch (e) {
            this._noWorkerSalesProxy();
            throw { message: 'Fails to start sales proxy' };
        }
    };
    BackgroundService.prototype.startStockUpdateProxy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    // if (Capacitor.isNative) {
                    //   this.swLocalDataService.start();
                    // } else {
                    if (typeof Worker !== 'undefined') {
                        this.stocksWorkerProxy = new Worker(__webpack_require__.tu(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_app_workers_stocks_worker_ts"), __webpack_require__.b)), { type: undefined });
                        this.stocksWorkerProxy.onmessage = function (_a) {
                            var data = _a.data;
                            _this.eventApi.broadcast(_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.SsmEvents.STOCK_UPDATED);
                        };
                        this.stocksWorkerProxy.postMessage({});
                        return [2 /*return*/, 'Ok'];
                    }
                    else {
                        this._noWorkerStockSync();
                    }
                    // }
                }
                catch (e) {
                    this._noWorkerStockSync();
                    throw { message: 'Fails to start stocks proxy' };
                }
                return [2 /*return*/];
            });
        });
    };
    BackgroundService.prototype._noWorkerSalesProxy = function () {
        // this.swSalesProxyService.start();
    };
    BackgroundService.prototype._noWorkerStockSync = function () {
    };
    BackgroundService.prototype._noWorkerSettings = function () {
    };
    BackgroundService.prototype._startPaymentWatch = function () {
        var _this = this;
        setInterval(function () {
            _this.billing.subscription().then(function (value) {
                return bfastjs__WEBPACK_IMPORTED_MODULE_0__.bfast.cache({ database: 'payment', collection: 'subscription' }).set('status', value, { secure: true });
            }).then(function (value) {
                if (value && value.subscription === false) {
                    _this.router.navigateByUrl('/account/bill').catch(function (_) {
                        // console.log(reason);
                    });
                    if (_this.paymentDialogOpen === false) {
                        _this.paymentDialogOpen = true;
                        _this.dialog.open(_components_payment_dialog_component__WEBPACK_IMPORTED_MODULE_1__.PaymentDialogComponent).afterClosed().subscribe(function (_1) {
                            _this.paymentDialogOpen = false;
                            _this.router.navigateByUrl('/account/bill').catch(function (_2) {
                            });
                        });
                    }
                }
            }).catch(function (_) {
                // console.log(reason, 'payment');
            });
        }, 1000 * 60 * 60);
    };
    BackgroundService.ɵfac = function BackgroundService_Factory(t) { return new (t || BackgroundService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_smartstocktz_core_libs__WEBPACK_IMPORTED_MODULE_2__.EventService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_smartstocktz_accounts__WEBPACK_IMPORTED_MODULE_4__.BillingService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router)); };
    BackgroundService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: BackgroundService, factory: BackgroundService.ɵfac, providedIn: 'root' });
    return BackgroundService;
}());



/***/ }),

/***/ 92340:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "environment": function() { return /* binding */ environment; }
/* harmony export */ });
var environment = {
    production: true,
    firebase: {
        apiKey: 'AIzaSyAlcMxXCZ25jAVWQ5RY98AUsdK5-UP_iew',
        authDomain: 'smart-stock-manager.firebaseapp.com',
        databaseURL: 'https://smart-stock-manager.firebaseio.com',
        projectId: 'smart-stock-manager',
        storageBucket: 'smart-stock-manager.appspot.com',
        messagingSenderId: '23694341104',
        appId: '1:23694341104:web:2905c54949c39987eca335',
        measurementId: 'G-GBR0FY21QZ'
    },
    browser: false,
    electron: true,
    desktop: false,
    android: false,
    printerUrl: 'https://localhost:8080',
    functionsURL: 'https://smartstock-faas.bfast.fahamutech.com',
    databaseURL: 'https://smartstock-daas.bfast.fahamutech.com',
    smartstock: {
        applicationId: 'smartstock_lb',
        projectId: 'smartstock',
        pass: 'ZMUGVn72o3yd8kSbMGhfWpI80N9nA2IHjxWKlAhG',
        functionsURL: 'https://smartstock-faas.bfast.fahamutech.com',
        databaseURL: 'https://smartstock-daas.bfast.fahamutech.com'
    },
    fahamupay: {
        applicationId: 'fahamupay',
        projectId: 'fahamupay',
        pass: 'paMnho3EsBF6MxHelep94gQW3nIODMBq8lG9vapX'
    }
};


/***/ }),

/***/ 14431:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 39075);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _app_smartstock_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/smartstock.module */ 82847);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 92340);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_smartstock_module__WEBPACK_IMPORTED_MODULE_0__.SmartstockModule)
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 46700:
/*!***************************************************!*\
  !*** ./node_modules/moment/locale/ sync ^\.\/.*$ ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./af": 26431,
	"./af.js": 26431,
	"./ar": 81286,
	"./ar-dz": 1616,
	"./ar-dz.js": 1616,
	"./ar-kw": 9759,
	"./ar-kw.js": 9759,
	"./ar-ly": 43160,
	"./ar-ly.js": 43160,
	"./ar-ma": 62551,
	"./ar-ma.js": 62551,
	"./ar-sa": 79989,
	"./ar-sa.js": 79989,
	"./ar-tn": 6962,
	"./ar-tn.js": 6962,
	"./ar.js": 81286,
	"./az": 15887,
	"./az.js": 15887,
	"./be": 14572,
	"./be.js": 14572,
	"./bg": 3276,
	"./bg.js": 3276,
	"./bm": 93344,
	"./bm.js": 93344,
	"./bn": 58985,
	"./bn-bd": 83990,
	"./bn-bd.js": 83990,
	"./bn.js": 58985,
	"./bo": 94391,
	"./bo.js": 94391,
	"./br": 46728,
	"./br.js": 46728,
	"./bs": 5536,
	"./bs.js": 5536,
	"./ca": 41043,
	"./ca.js": 41043,
	"./cs": 70420,
	"./cs.js": 70420,
	"./cv": 33513,
	"./cv.js": 33513,
	"./cy": 6771,
	"./cy.js": 6771,
	"./da": 47978,
	"./da.js": 47978,
	"./de": 46061,
	"./de-at": 25204,
	"./de-at.js": 25204,
	"./de-ch": 2653,
	"./de-ch.js": 2653,
	"./de.js": 46061,
	"./dv": 85,
	"./dv.js": 85,
	"./el": 8579,
	"./el.js": 8579,
	"./en-au": 25724,
	"./en-au.js": 25724,
	"./en-ca": 10525,
	"./en-ca.js": 10525,
	"./en-gb": 52847,
	"./en-gb.js": 52847,
	"./en-ie": 67216,
	"./en-ie.js": 67216,
	"./en-il": 39305,
	"./en-il.js": 39305,
	"./en-in": 73364,
	"./en-in.js": 73364,
	"./en-nz": 79130,
	"./en-nz.js": 79130,
	"./en-sg": 11161,
	"./en-sg.js": 11161,
	"./eo": 50802,
	"./eo.js": 50802,
	"./es": 40328,
	"./es-do": 45551,
	"./es-do.js": 45551,
	"./es-mx": 75615,
	"./es-mx.js": 75615,
	"./es-us": 64790,
	"./es-us.js": 64790,
	"./es.js": 40328,
	"./et": 96389,
	"./et.js": 96389,
	"./eu": 52961,
	"./eu.js": 52961,
	"./fa": 26151,
	"./fa.js": 26151,
	"./fi": 7997,
	"./fi.js": 7997,
	"./fil": 58898,
	"./fil.js": 58898,
	"./fo": 37779,
	"./fo.js": 37779,
	"./fr": 28174,
	"./fr-ca": 3287,
	"./fr-ca.js": 3287,
	"./fr-ch": 38867,
	"./fr-ch.js": 38867,
	"./fr.js": 28174,
	"./fy": 50452,
	"./fy.js": 50452,
	"./ga": 45014,
	"./ga.js": 45014,
	"./gd": 74127,
	"./gd.js": 74127,
	"./gl": 72124,
	"./gl.js": 72124,
	"./gom-deva": 6444,
	"./gom-deva.js": 6444,
	"./gom-latn": 37953,
	"./gom-latn.js": 37953,
	"./gu": 76604,
	"./gu.js": 76604,
	"./he": 1222,
	"./he.js": 1222,
	"./hi": 74235,
	"./hi.js": 74235,
	"./hr": 622,
	"./hr.js": 622,
	"./hu": 37735,
	"./hu.js": 37735,
	"./hy-am": 90402,
	"./hy-am.js": 90402,
	"./id": 59187,
	"./id.js": 59187,
	"./is": 30536,
	"./is.js": 30536,
	"./it": 35007,
	"./it-ch": 94667,
	"./it-ch.js": 94667,
	"./it.js": 35007,
	"./ja": 62093,
	"./ja.js": 62093,
	"./jv": 80059,
	"./jv.js": 80059,
	"./ka": 66870,
	"./ka.js": 66870,
	"./kk": 80880,
	"./kk.js": 80880,
	"./km": 1083,
	"./km.js": 1083,
	"./kn": 68785,
	"./kn.js": 68785,
	"./ko": 21721,
	"./ko.js": 21721,
	"./ku": 37851,
	"./ku.js": 37851,
	"./ky": 1727,
	"./ky.js": 1727,
	"./lb": 40346,
	"./lb.js": 40346,
	"./lo": 93002,
	"./lo.js": 93002,
	"./lt": 64035,
	"./lt.js": 64035,
	"./lv": 56927,
	"./lv.js": 56927,
	"./me": 5634,
	"./me.js": 5634,
	"./mi": 94173,
	"./mi.js": 94173,
	"./mk": 86320,
	"./mk.js": 86320,
	"./ml": 11705,
	"./ml.js": 11705,
	"./mn": 31062,
	"./mn.js": 31062,
	"./mr": 92805,
	"./mr.js": 92805,
	"./ms": 11341,
	"./ms-my": 59900,
	"./ms-my.js": 59900,
	"./ms.js": 11341,
	"./mt": 37734,
	"./mt.js": 37734,
	"./my": 19034,
	"./my.js": 19034,
	"./nb": 9324,
	"./nb.js": 9324,
	"./ne": 46495,
	"./ne.js": 46495,
	"./nl": 70673,
	"./nl-be": 76272,
	"./nl-be.js": 76272,
	"./nl.js": 70673,
	"./nn": 72486,
	"./nn.js": 72486,
	"./oc-lnc": 46219,
	"./oc-lnc.js": 46219,
	"./pa-in": 2829,
	"./pa-in.js": 2829,
	"./pl": 78444,
	"./pl.js": 78444,
	"./pt": 53170,
	"./pt-br": 66117,
	"./pt-br.js": 66117,
	"./pt.js": 53170,
	"./ro": 96587,
	"./ro.js": 96587,
	"./ru": 39264,
	"./ru.js": 39264,
	"./sd": 42135,
	"./sd.js": 42135,
	"./se": 95366,
	"./se.js": 95366,
	"./si": 93379,
	"./si.js": 93379,
	"./sk": 46143,
	"./sk.js": 46143,
	"./sl": 196,
	"./sl.js": 196,
	"./sq": 21082,
	"./sq.js": 21082,
	"./sr": 91621,
	"./sr-cyrl": 98963,
	"./sr-cyrl.js": 98963,
	"./sr.js": 91621,
	"./ss": 41404,
	"./ss.js": 41404,
	"./sv": 55685,
	"./sv.js": 55685,
	"./sw": 3872,
	"./sw.js": 3872,
	"./ta": 54106,
	"./ta.js": 54106,
	"./te": 39204,
	"./te.js": 39204,
	"./tet": 83692,
	"./tet.js": 83692,
	"./tg": 86361,
	"./tg.js": 86361,
	"./th": 31735,
	"./th.js": 31735,
	"./tk": 1568,
	"./tk.js": 1568,
	"./tl-ph": 96129,
	"./tl-ph.js": 96129,
	"./tlh": 13759,
	"./tlh.js": 13759,
	"./tr": 81644,
	"./tr.js": 81644,
	"./tzl": 90875,
	"./tzl.js": 90875,
	"./tzm": 16878,
	"./tzm-latn": 11041,
	"./tzm-latn.js": 11041,
	"./tzm.js": 16878,
	"./ug-cn": 74357,
	"./ug-cn.js": 74357,
	"./uk": 74810,
	"./uk.js": 74810,
	"./ur": 86794,
	"./ur.js": 86794,
	"./uz": 28966,
	"./uz-latn": 77959,
	"./uz-latn.js": 77959,
	"./uz.js": 28966,
	"./vi": 35386,
	"./vi.js": 35386,
	"./x-pseudo": 23156,
	"./x-pseudo.js": 23156,
	"./yo": 68028,
	"./yo.js": 68028,
	"./zh-cn": 9330,
	"./zh-cn.js": 9330,
	"./zh-hk": 89380,
	"./zh-hk.js": 89380,
	"./zh-mo": 60874,
	"./zh-mo.js": 60874,
	"./zh-tw": 96508,
	"./zh-tw.js": 96508
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 46700;

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["vendor"], function() { return __webpack_exec__(14431); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map