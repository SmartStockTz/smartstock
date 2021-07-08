/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 28485:
/*!*********************************************!*\
  !*** ./node_modules/crypto-hash/browser.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* eslint-env browser */

/* global globalThis:readonly */
 // Ponyfill for `globalThis`

var _regeneratorRuntime = __webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ 88774);

var _objectSpread = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/objectSpread2 */ 84539).default;

var _asyncToGenerator = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/asyncToGenerator */ 91052).default;

var _globalThis = function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof self !== 'undefined') {
    return self;
  }
  /* istanbul ignore next */


  if (typeof window !== 'undefined') {
    return window;
  }
  /* istanbul ignore next */


  if (typeof global !== 'undefined') {
    return global;
  }
}();

var bufferToHex = function bufferToHex(buffer) {
  var view = new DataView(buffer);
  var hexCodes = '';

  for (var i = 0; i < view.byteLength; i += 4) {
    hexCodes += view.getUint32(i).toString(16).padStart(8, '0');
  }

  return hexCodes;
};

var create = function create(algorithm) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(buffer, options) {
      var hash;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (typeof buffer === 'string') {
                buffer = new _globalThis.TextEncoder().encode(buffer);
              }

              options = _objectSpread({
                outputFormat: 'hex'
              }, options);
              _context.next = 4;
              return _globalThis.crypto.subtle.digest(algorithm, buffer);

            case 4:
              hash = _context.sent;
              return _context.abrupt("return", options.outputFormat === 'hex' ? bufferToHex(hash) : hash);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.sha1 = create('SHA-1');
exports.sha256 = create('SHA-256');
exports.sha384 = create('SHA-384');
exports.sha512 = create('SHA-512');

/***/ }),

/***/ 93361:
/*!******************************************!*\
  !*** ./src/app/workers/stocks.worker.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bfastjs */ 59834);
/* harmony import */ var bfastjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bfastjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var crypto_hash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto-hash */ 28485);
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


function run() {
    init();
    startStockSocket().catch(function (_) {
    });
}
function init() {
    bfastjs__WEBPACK_IMPORTED_MODULE_0___default().init({
        applicationId: 'smartstock_lb',
        projectId: 'smartstock'
    });
}
function startStockSocket() {
    return __awaiter(this, void 0, void 0, function () {
        var smartStockCache, shop;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    smartStockCache = bfastjs__WEBPACK_IMPORTED_MODULE_0___default().cache({ database: 'smartstock', collection: 'config' });
                    return [4 /*yield*/, smartStockCache.get('activeShop')];
                case 1:
                    shop = _a.sent();
                    bfastjs__WEBPACK_IMPORTED_MODULE_0___default().init({ applicationId: shop.applicationId, projectId: shop.projectId }, shop.projectId);
                    bfastjs__WEBPACK_IMPORTED_MODULE_0___default().database(shop.projectId).collection('stocks')
                        .query()
                        .changes(function () {
                        console.log('stocks socket connect');
                        getMissedStocks(shop).catch(function (_) {
                            console.log(_);
                        });
                    }, function () {
                        console.log('stocks socket disconnected');
                    }).addListener(function (response) {
                        updateLocalStock(response.body, shop).catch(function (_) { return console.log(''); });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function getMissedStocks(shop) {
    return __awaiter(this, void 0, void 0, function () {
        var localStocks_3, hashesMap_1, _i, localStocks_1, value, _a, _b, missed_1, _c, localStocks_2, value;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(shop && shop.applicationId && shop.projectId)) return [3 /*break*/, 8];
                    bfastjs__WEBPACK_IMPORTED_MODULE_0___default().init({ applicationId: shop.applicationId, projectId: shop.projectId }, shop.projectId);
                    return [4 /*yield*/, bfastjs__WEBPACK_IMPORTED_MODULE_0___default().cache({ database: 'stocks', collection: shop.projectId }).get('all')];
                case 1:
                    localStocks_3 = _d.sent();
                    if (!localStocks_3) {
                        localStocks_3 = [];
                    }
                    hashesMap_1 = {};
                    _i = 0, localStocks_1 = localStocks_3;
                    _d.label = 2;
                case 2:
                    if (!(_i < localStocks_1.length)) return [3 /*break*/, 5];
                    value = localStocks_1[_i];
                    _a = hashesMap_1;
                    _b = value.id;
                    return [4 /*yield*/, (0,crypto_hash__WEBPACK_IMPORTED_MODULE_1__.sha1)(JSON.stringify(value))];
                case 3:
                    _a[_b] = _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, bfastjs__WEBPACK_IMPORTED_MODULE_0___default().functions(shop.projectId)
                        .request("https://" + shop.projectId + "-daas.bfast.fahamutech.com/functions/stocks/sync")
                        .post(hashesMap_1)];
                case 6:
                    missed_1 = _d.sent();
                    hashesMap_1 = {};
                    for (_c = 0, localStocks_2 = localStocks_3; _c < localStocks_2.length; _c++) {
                        value = localStocks_2[_c];
                        hashesMap_1[value.id] = value;
                    }
                    Object.keys(missed_1).forEach(function (mKey) {
                        if (missed_1[mKey] === 'DELETE') {
                            delete hashesMap_1[mKey];
                        }
                        else {
                            hashesMap_1[mKey] = missed_1[mKey];
                        }
                    });
                    localStocks_3 = [];
                    Object.keys(hashesMap_1).forEach(function (value) {
                        localStocks_3.push(hashesMap_1[value]);
                    });
                    return [4 /*yield*/, bfastjs__WEBPACK_IMPORTED_MODULE_0___default().cache({ database: 'stocks', collection: shop.projectId }).set('all', localStocks_3)];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function updateLocalStock(body, shop) {
    return __awaiter(this, void 0, void 0, function () {
        var stocksCache, localStocks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(body && body.change)) return [3 /*break*/, 3];
                    return [4 /*yield*/, bfastjs__WEBPACK_IMPORTED_MODULE_0___default().cache({ database: 'stocks', collection: shop.projectId })];
                case 1:
                    stocksCache = _a.sent();
                    return [4 /*yield*/, stocksCache.get('all')];
                case 2:
                    localStocks = _a.sent();
                    if ((body.change.name === 'create' || 'update') && body.change.snapshot) {
                        localStocks = localStocks.filter(function (x) { return x.id !== body.change.snapshot.id; });
                        localStocks.unshift(body.change.snapshot);
                        stocksCache.set('all', localStocks);
                    }
                    else if (body.change.name === 'delete' && body.change.snapshot) {
                        stocksCache.set('all', localStocks.filter(function (value) { return value.id !== body.change.snapshot.id; }));
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
addEventListener('message', function (_a) {
    var data = _a.data;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            run();
            return [2 /*return*/];
        });
    });
});


/***/ }),

/***/ 91052:
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/***/ (function(module) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ }),

/***/ 84539:
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/objectSpread2.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var defineProperty = __webpack_require__(/*! ./defineProperty.js */ 53837);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

module.exports = _objectSpread2;
module.exports.default = module.exports, module.exports.__esModule = true;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = function() {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["default-node_modules_bfastjs_dist_bfast_js"], function() { return __webpack_require__(93361); })
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = function(chunkId) {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tu = function(url) {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScriptURL: function(url) { return url; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("angular#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy.createScriptURL(url);
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"src_app_workers_stocks_worker_ts": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = function(data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = function(chunkId, promises) {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.tu(__webpack_require__.p + __webpack_require__.u(chunkId)));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksmartstock"] = self["webpackChunksmartstock"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	!function() {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = function() {
/******/ 			return __webpack_require__.e("default-node_modules_bfastjs_dist_bfast_js").then(next);
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=src_app_workers_stocks_worker_ts.js.map