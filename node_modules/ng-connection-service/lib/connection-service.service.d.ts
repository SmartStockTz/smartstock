import { Observable } from 'rxjs';
export declare class ConnectionService {
    private connectionMonitor;
    constructor();
    monitor(): Observable<boolean>;
}
