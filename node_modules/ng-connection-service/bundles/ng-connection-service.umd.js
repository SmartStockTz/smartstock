(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('ng-connection-service', ['exports', '@angular/core', 'rxjs'], factory) :
    (factory((global['ng-connection-service'] = {}),global.ng.core,global.rxjs));
}(this, (function (exports,i0,rxjs) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ConnectionService = (function () {
        function ConnectionService() {
            this.connectionMonitor = new rxjs.Observable(function (observer) {
                window.addEventListener('offline', function (e) {
                    observer.next(false);
                });
                window.addEventListener('online', function (e) {
                    observer.next(true);
                });
            });
        }
        /**
         * @return {?}
         */
        ConnectionService.prototype.monitor = /**
         * @return {?}
         */
            function () {
                return this.connectionMonitor;
            };
        ConnectionService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        ConnectionService.ctorParameters = function () { return []; };
        /** @nocollapse */ ConnectionService.ngInjectableDef = i0.defineInjectable({ factory: function ConnectionService_Factory() { return new ConnectionService(); }, token: ConnectionService, providedIn: "root" });
        return ConnectionService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ConnectionServiceModule = (function () {
        function ConnectionServiceModule() {
        }
        ConnectionServiceModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [],
                        providers: [ConnectionService]
                    },] },
        ];
        return ConnectionServiceModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.ConnectionService = ConnectionService;
    exports.ConnectionServiceModule = ConnectionServiceModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY29ubmVjdGlvbi1zZXJ2aWNlLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmctY29ubmVjdGlvbi1zZXJ2aWNlL2xpYi9jb25uZWN0aW9uLXNlcnZpY2Uuc2VydmljZS50cyIsIm5nOi8vbmctY29ubmVjdGlvbi1zZXJ2aWNlL2xpYi9jb25uZWN0aW9uLXNlcnZpY2UubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2Uge1xuICBwcml2YXRlIGNvbm5lY3Rpb25Nb25pdG9yOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICBcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uTW9uaXRvciA9IG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCAoZSkgPT4ge1xuICAgICAgICBvYnNlcnZlci5uZXh0KGZhbHNlKTtcbiAgICAgIH0pO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIChlKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQodHJ1ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG1vbml0b3IoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbk1vbml0b3I7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbm5lY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9jb25uZWN0aW9uLXNlcnZpY2Uuc2VydmljZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICBdLFxyXG4gIHByb3ZpZGVyczpbQ29ubmVjdGlvblNlcnZpY2VdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU2VydmljZU1vZHVsZSB7IH1cclxuIl0sIm5hbWVzIjpbIk9ic2VydmFibGUiLCJJbmplY3RhYmxlIiwiTmdNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtRQVNFO1lBQ0UsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUlBLGVBQVUsQ0FBQyxVQUFDLFFBQVE7Z0JBQy9DLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQyxDQUFDO29CQUNuQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN0QixDQUFDLENBQUM7Z0JBQ0gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxVQUFDLENBQUM7b0JBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3JCLENBQUMsQ0FBQzthQUNKLENBQUMsQ0FBQztTQUNKOzs7O1FBRUQsbUNBQU87OztZQUFQO2dCQUNFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO2FBQy9COztvQkFuQkZDLGFBQVUsU0FBQzt3QkFDVixVQUFVLEVBQUUsTUFBTTtxQkFDbkI7Ozs7O2dDQUxEOzs7Ozs7O0FDQUE7Ozs7b0JBR0NDLFdBQVEsU0FBQzt3QkFDUixPQUFPLEVBQUUsRUFDUjt3QkFDRCxTQUFTLEVBQUMsQ0FBQyxpQkFBaUIsQ0FBQztxQkFDOUI7O3NDQVBEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=