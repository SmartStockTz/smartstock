/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export class ConnectionService {
    constructor() {
        this.connectionMonitor = new Observable((observer) => {
            window.addEventListener('offline', (e) => {
                observer.next(false);
            });
            window.addEventListener('online', (e) => {
                observer.next(true);
            });
        });
    }
    /**
     * @return {?}
     */
    monitor() {
        return this.connectionMonitor;
    }
}
ConnectionService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
ConnectionService.ctorParameters = () => [];
/** @nocollapse */ ConnectionService.ngInjectableDef = i0.defineInjectable({ factory: function ConnectionService_Factory() { return new ConnectionService(); }, token: ConnectionService, providedIn: "root" });
if (false) {
    /** @type {?} */
    ConnectionService.prototype.connectionMonitor;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1jb25uZWN0aW9uLXNlcnZpY2UvIiwic291cmNlcyI6WyJsaWIvY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFLbEMsTUFBTTtJQUdKO1FBQ0UsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDbkQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3RCLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNyQixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7S0FDSjs7OztJQUVELE9BQU87UUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0tBQy9COzs7WUFuQkYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU2VydmljZSB7XG4gIHByaXZhdGUgY29ubmVjdGlvbk1vbml0b3I6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gIFxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbm5lY3Rpb25Nb25pdG9yID0gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIChlKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgKGUpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbW9uaXRvcigpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uTW9uaXRvcjtcbiAgfVxufVxuIl19