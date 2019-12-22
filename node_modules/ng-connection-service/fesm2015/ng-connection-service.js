import { Injectable, NgModule, defineInjectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ConnectionService {
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
/** @nocollapse */ ConnectionService.ngInjectableDef = defineInjectable({ factory: function ConnectionService_Factory() { return new ConnectionService(); }, token: ConnectionService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ConnectionServiceModule {
}
ConnectionServiceModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                providers: [ConnectionService]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { ConnectionService, ConnectionServiceModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY29ubmVjdGlvbi1zZXJ2aWNlLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZy1jb25uZWN0aW9uLXNlcnZpY2UvbGliL2Nvbm5lY3Rpb24tc2VydmljZS5zZXJ2aWNlLnRzIiwibmc6Ly9uZy1jb25uZWN0aW9uLXNlcnZpY2UvbGliL2Nvbm5lY3Rpb24tc2VydmljZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU2VydmljZSB7XG4gIHByaXZhdGUgY29ubmVjdGlvbk1vbml0b3I6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gIFxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbm5lY3Rpb25Nb25pdG9yID0gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIChlKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgKGUpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbW9uaXRvcigpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uTW9uaXRvcjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29ubmVjdGlvblNlcnZpY2UgfSBmcm9tICcuL2Nvbm5lY3Rpb24tc2VydmljZS5zZXJ2aWNlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOltDb25uZWN0aW9uU2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25TZXJ2aWNlTW9kdWxlIHsgfVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0lBU0U7UUFDRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxRQUFRO1lBQy9DLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3RCLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUNsQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztLQUNKOzs7O0lBRUQsT0FBTztRQUNMLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0tBQy9COzs7WUFuQkYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7Ozs7Ozs7O0FDTEQ7OztZQUdDLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsRUFDUjtnQkFDRCxTQUFTLEVBQUMsQ0FBQyxpQkFBaUIsQ0FBQzthQUM5Qjs7Ozs7Ozs7Ozs7Ozs7OyJ9