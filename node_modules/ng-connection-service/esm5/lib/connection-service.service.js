/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
var ConnectionService = /** @class */ (function () {
    function ConnectionService() {
        this.connectionMonitor = new Observable(function (observer) {
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
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    ConnectionService.ctorParameters = function () { return []; };
    /** @nocollapse */ ConnectionService.ngInjectableDef = i0.defineInjectable({ factory: function ConnectionService_Factory() { return new ConnectionService(); }, token: ConnectionService, providedIn: "root" });
    return ConnectionService;
}());
export { ConnectionService };
if (false) {
    /** @type {?} */
    ConnectionService.prototype.connectionMonitor;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1jb25uZWN0aW9uLXNlcnZpY2UvIiwic291cmNlcyI6WyJsaWIvY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7O0lBUWhDO1FBQ0UsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksVUFBVSxDQUFDLFVBQUMsUUFBUTtZQUMvQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUMsQ0FBQztnQkFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0QixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQUMsQ0FBQztnQkFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNyQixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7S0FDSjs7OztJQUVELG1DQUFPOzs7SUFBUDtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7S0FDL0I7O2dCQW5CRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7Ozs0QkFMRDs7U0FNYSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25TZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjb25uZWN0aW9uTW9uaXRvcjogT2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29ubmVjdGlvbk1vbml0b3IgPSBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgKGUpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChmYWxzZSk7XG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCAoZSkgPT4ge1xuICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBtb25pdG9yKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25Nb25pdG9yO1xuICB9XG59XG4iXX0=