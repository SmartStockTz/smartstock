import {Injectable} from '@angular/core';
import {NgForage} from 'ngforage';
import {HttpClient} from '@angular/common/http';
import {UserI} from '../model/UserI';
import {ShopI} from '../model/ShopI';

@Injectable({
  providedIn: 'root'
})
export class SettingsServiceService {
  constructor(private readonly httpClient: HttpClient,
              private readonly indexDb: NgForage) {
  }

  ssmServerURL = 'https://smartstock-daas.bfast.fahamutech.com';
  ssmFunctionsURL = 'https://smartstock-faas.bfast.fahamutech.com';

  ssmHeader = {
    'X-Parse-Application-Id': 'smartstock_lb'
  };

  ssmFunctionsHeader = {
    'bfast-application-id': 'smartstock_lb',
    'content-type': 'application/json'
  };

  async getSSMUserHeader() {
    try {
      const user = await this.indexDb.getItem<UserI>('user');
      if (!user) {
        console.log('no user records found');
        throw new Error('no user records found');
      }
      if (user && user.sessionToken && user.applicationId) {
        return {
          'X-Parse-Application-Id': 'smartstock_lb',
          'X-Parse-Session-Token': user.sessionToken,
          'Content-Type': 'application/json'
        };
      } else {
        throw new Error('token not found');
      }
    } catch (e) {
      throw {message: 'Fails to get user, so to retrieve token'};
    }
  }

  async getCustomerApplicationId() {
    try {
      const user = await this.indexDb.getItem<UserI>('user');
      if (!user) {
        throw new Error('No user record');
      }
      return user.applicationId;
    } catch (e) {
      throw {message: 'Fails to get application id', reason: e.toString()};
    }
  }

  async getCustomerServerURLId() {
    try {
      const user = await this.indexDb.getItem<UserI>('user');
      if (!user) {
        throw new Error('No user in local storage');
      }
      return user.projectUrlId;
    } catch (reason) {
      throw {message: 'Fails to get user', reason: reason.toString()};
    }
  }

  async getCustomerHeader(): Promise<any> {
    try {
      return {
        'X-Parse-Application-Id': await this.getCustomerApplicationId()
      };
    } catch (e) {
      console.warn(e);
      return {};
    }
  }

  async getCustomerPostHeader(): Promise<any> {
    try {
      return {
        'X-Parse-Application-Id': await this.getCustomerApplicationId(),
        'content-type': 'application/json'
      };
    } catch (e) {
      throw {message: 'Fails to get customer post header', reason: e.toString()};
    }
  }

  async getCustomerServerURL(): Promise<string> {
    try {
      return `https://${await this.getCustomerServerURLId()}.bfast.fahamutech.com`;
    } catch (e) {
      throw {message: 'Fails to get server url', reason: e.toString()};
    }
  }

  async getCustomerProjectId(): Promise<string> {
    try {
      const user = await this.indexDb.getItem<UserI>('user');
      if (!user) {
        throw new Error('No user in local storage');
      }
      return user.projectId;
    } catch (e) {
      throw {message: 'Fails to get project id', reason: e.toString()};
    }
  }

  public getPrinterAddress(callback: (value: { ip: string, name: string }) => void) {
    this.indexDb.getItem<{ ip: string, name: string }>('printerAddress').then(value => {
      callback(null);
    }).catch(reason => {
      console.log(reason);
      callback(null);
    });
  }

  saveSettings(settings: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.indexDb.getItem<ShopI>('activeShop').then(async activeShop => {
        this.httpClient.put<any>(this.ssmFunctionsURL + '/settings/' + activeShop.projectId, settings, {
          headers: this.ssmFunctionsHeader
        }).subscribe(_ => {
          activeShop.settings = _.settings;
          this.indexDb.setItem('activeShop', activeShop).then(_1 => {
            resolve('Shop settings updated');
          }).catch(reason => {
            reject(reason);
          });
        }, error => {
          reject(error);
        });
      }).catch(reason => {
        reject(reason);
      });
    });
  }

  async getSettings(): Promise<{ printerFooter: string, printerHeader: string, saleWithoutPrinter: boolean }> {
    try {
      const activeShop = await this.indexDb.getItem<UserI>('activeShop');
      if (!activeShop || !activeShop.settings) {
        return {
          'printerFooter': 'Thank you',
          'printerHeader': '',
          'saleWithoutPrinter': true
        };
      }
      return activeShop.settings;
    } catch (e) {
      throw {message: 'Fails to get settings', reason: e.toString()};
    }
  }
}
