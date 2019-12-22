import {Injectable} from '@angular/core';
import {ConnectionService} from 'ng-connection-service';
import {HttpClient} from '@angular/common/http';
import {NgForage} from 'ngforage';
import {ParseBackend} from '../database/ParseBackend';
import {BatchI} from '../model/batchI';

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
          keys.forEach(key => {
            this.indexDb.clone({name: 'ssmsales'}).getItem<BatchI[]>(key).then(value => {
              this.httpClient.post<BatchI[]>(this.serverUrl + '/batch', {
                  'requests': value
                },
                {
                  headers: this.getHeader
                }
              ).subscribe(_ => {
                this.indexDb.clone({name: 'ssmsales'}).removeItem(key).catch(reason => console.log(reason));
              }, error1 => {
                console.log(error1);
              });
            }).catch(reason => console.log(reason));
          });
        }
      }).catch(reason => {
        console.log(reason);
      });
    }, 1000);
  }
}
