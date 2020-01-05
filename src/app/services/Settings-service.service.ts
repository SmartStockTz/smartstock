import {Injectable} from '@angular/core';
import {NgForage} from 'ngforage';

@Injectable({
  providedIn: 'root'
})
export class SettingsServiceService {
  ssmServerURL = 'https://smartstock-daas.bfast.fahamutech.com';
  ssmHeader = {
    'X-Parse-Application-Id': 'smartstock_lb'
  };
  ssmFunctionsHeader = {
    'bfast-application-id': 'smartstock_lb',
    'content-type': 'application/json'
  };
  ssmFunctionsURL = 'https://smartstock-faas.bfast.fahamutech.com/functions';

  constructor(private indexDb: NgForage) {
  }

  getCustomerApplicationId(): string {
    return 'lbpharmacy'; // replace with fetch from index db
  }

  getCustomerServerURLId(): string {
    return 'lbpharmacy-daas'; // replace with fetch from index db
  }

  getCustomerHeader(): any {
    return {
      'X-Parse-Application-Id': this.getCustomerApplicationId()
    };
  }

  getCustomerPostHeader(): any {
    return {
      'X-Parse-Application-Id': this.getCustomerApplicationId(),
      'content-type': 'application/json'
    };
  }

  getCustomerServerURL(): string {
    return `https://${this.getCustomerServerURLId()}.bfast.fahamutech.com`;
  }

  getCustomerProjectId(): string {
    return 'lbpharmacy'; // replace with fetch from index db
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
