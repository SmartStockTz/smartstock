import {Injectable} from '@angular/core';
import {ConnectionService} from 'ng-connection-service';
import {HttpClient} from '@angular/common/http';
import {NgForage} from 'ngforage';
import {ParseBackend} from '../database/ParseBackend';

@Injectable({
  providedIn: 'root'
})
export class SalesProxyService extends ParseBackend {

  constructor(private netStatus: ConnectionService,
              private indexDb: NgForage,
              private httpClient: HttpClient) {
    super();
  }

  saleProxy() {
    setInterval(() => {
      this.indexDb.clone({name: 'ssmsales'}).keys().then(keys => {
        if (keys === null) {

        } else if (keys.length === 0) {

        } else if (keys.length > 0) {
          this.salesBackground(keys);
          // keys.forEach(key => {
          //   this.indexDb.clone({name: 'ssmsales'}).getItem<BatchI[]>(key).then(value => {
          //     this.httpClient.post<BatchI[]>(this.serverUrl + '/batch', {
          //         'requests': value
          //       },
          //       {
          //         headers: this.getHeader
          //       }
          //     ).subscribe(_ => {
          //       this.indexDb.clone({name: 'ssmsales'}).removeItem(key).catch(reason => console.log(reason));
          //     }, error1 => {
          //       console.log(error1);
          //     });
          //   }).catch(reason => console.log(reason));
          // });
        }
      }).catch(reason => {
        console.log(reason);
      });
    }, 1000);
  }

  salesBackground(keys: any) {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker('./sales-proxy.worker', {type: 'module'});
      worker.onmessage = ({data}) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage(keys);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

}
