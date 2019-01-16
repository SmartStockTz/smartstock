import {Injectable} from '@angular/core';
import {NgForage} from 'ngforage';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SsmSettingsServiceService {

  constructor(private indexDb: NgForage, private httpClient: HttpClient) {
  }

  public getPrinterAddress(callback: (value: { ip: string, name: string }) => void) {
    this.indexDb.getItem<{ ip: string, name: string }>('printerAddress').then(value => {
      callback(value);
    }).catch(reason => {
      console.log(reason);
      callback(null);
    });
  }

  public setPrinterAddress(addr: { ip: string, name: string }, callback: (value: any) => void) {
    this.indexDb.setItem('printerAddress', addr).then(value => {
      callback(value);
    }).catch(reason => {
      console.log(reason);
      callback(null);
    });
  }

  setServerAddress(ip: string) {
    this.indexDb.setItem('serverAddress', ip).then(value => {

    }).catch(reason => console.log(reason));
  }

  getServerAddress(callback: (ip: string) => void) {

  }
}
