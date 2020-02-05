import {Injectable} from '@angular/core';
import {UserDataSource} from '../database/connector/UserDataSource';
import {UserI} from '../model/UserI';
import {NgForage} from 'ngforage';
import {ParseBackend, serverUrl} from '../database/ParseBackend';
import {HttpClient} from '@angular/common/http';
import {SettingsServiceService} from './Settings-service.service';
import {ShopI} from '../model/ShopI';

@Injectable({
  providedIn: 'root'
})
export class UserDatabaseService extends ParseBackend implements UserDataSource {

  constructor(private readonly httpClient: HttpClient,
              private readonly settings: SettingsServiceService,
              private readonly indexD: NgForage) {
    super();
  }

  async currentUser(): Promise<UserI> {
    try {
      return await this.indexD.getItem<UserI>('user');
    } catch (reason) {
      console.log(reason);
      throw {message: 'Fails to get current user'};
    }
  }

  createUser(user: UserI, callback?: (value: any) => void) {
    this.httpClient.post<UserI>(this.serverUrl + '/users', user, {
      headers: this.postHeaderUser
    }).subscribe(value => {
      this.indexD.setItem<UserI>('user_created', value).then(value1 => {
        console.log('saved user_created in cache is ---> ' + value1.objectId);
        callback(value);
      }).catch(reason => {
        console.log(reason);
        callback(null);
      });
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  // implement on cloud functions
  deleteUser(user: UserI): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.delete(this.settings.ssmFunctionsURL + '/functions/users/' + user.objectId, {
        headers: this.settings.ssmFunctionsHeader
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  getAllUser(pagination: { size: number, skip: number }): Promise<UserI[]> {
    return new Promise<UserI[]>(async (resolve, reject) => {
      const projectId = await this.settings.getCustomerProjectId();
      const where = {
        projectId: projectId,
        role: {
          '$in': ['user', 'manager']
        }
      };
      const urlencoded = encodeURI(JSON.stringify(where) + '&limit=' + 1000000);
      // console.log(urlencoded);
      this.httpClient.get<any>(this.settings.ssmServerURL + '/users?where=' + urlencoded, {
        headers: this.settings.ssmHeader
      }).subscribe(value => {
        resolve(value.results);
      }, error1 => {
        reject(error1);
      });
    });
  }

  getUser(user: UserI, callback?: (user: UserI) => void) {
    // this.httpClient.get<UserI>(this.serverUrl + '/users/' + user.objectId, {
    //   headers: this.getHeader
    // }).subscribe(value => {
    //   callback(value);
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
  }

  // needs to be reviewed
  async login(user: { username: string, password: string }): Promise<UserI> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<UserI>(this.settings.ssmServerURL + '/login', {
        params: {
          'username': user.username,
          'password': user.password
        },
        headers: this.settings.ssmHeader
      }).subscribe(async value => {
        try {
          // empty local storage if current project differ from last one
          if (value.role !== 'admin') {
            const cProjectId = await this.indexD.getItem('cPID');
            if (cProjectId && cProjectId !== value.projectId) {
              await this.indexD.clear();
            }
            // set current shop
            await this.indexD.setItem('cPID', value.projectId);
            // set active shop
            await this.indexD.setItem<ShopI>('activeShop', {
              settings: value.settings,
              businessName: value.businessName,
              projectId: value.projectId,
              projectUrlId: value.projectUrlId,
              applicationId: value.applicationId
            });
          }
          await this.indexD.setItem<UserI>('user', value);
          resolve(value);
        } catch (e) {
          reject(e);
        }
      }, error1 => {
        reject(error1);
      });
    });
  }

  async logout(user: UserI, callback?: (value: any) => void) {
    try {
      await this.indexD.removeItem('user');
      await this.indexD.removeItem('activeShop');
      callback('Ok');
    } catch (reason) {
      console.log(reason);
      callback(null);
    }
  }

  register(user: UserI): Promise<UserI> {
    return new Promise<UserI>((resolve, reject) => {
      // console.log(user);
      user.settings = {
        printerFooter: 'Thank you',
        printerHeader: '',
        saleWithoutPrinter: true,
      };
      this.httpClient.post<UserI>(this.settings.ssmFunctionsURL + '/functions/users/create', user, {
        headers: this.settings.ssmFunctionsHeader
      }).subscribe(value => {
        this.indexD.setItem<UserI>('user', value).then(_ => {
          resolve(value);
        }).catch(reason => {
          reject(reason);
        });
      }, error => {
        reject(error);
      });
    });
  }

  resetPassword(user: UserI, callback?: (value: any) => void) {
    callback('');
    // this.httpClient.post(this.serverUrl + '/requestPasswordReset', {
    //   'email': user.meta.email
    // }, {
    //   headers: this.postHeader
    // }).subscribe(value => {
    //   callback(value);
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
  }

  refreshToken(user: UserI, callback: (value: any) => void) {
    this.httpClient.get(serverUrl + '/sessions/me', {
      headers: {
        'X-Parse-Application-Id': 'lbpharmacy',
        'X-Parse-Session-Token': user.sessionToken
      }
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addUser(user: UserI): Promise<UserI> {
    return new Promise<UserI>(async (resolve, reject) => {
      const shop = await this.indexD.getItem<ShopI>('activeShop');
      user.shops = [];
      user.applicationId = shop.applicationId;
      user.projectUrlId = shop.projectUrlId;
      user.projectId = shop.projectId;
      user.businessName = shop.businessName;
      user.settings = shop.settings;
      this.httpClient.post<UserI>(this.settings.ssmFunctionsURL + '/functions/users/seller', user, {
        headers: this.settings.ssmFunctionsHeader
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  async getShops(): Promise<UserI[]> {
    try {
      const user = await this.indexD.getItem<UserI>('user');
      const shops = [];
      user.shops.forEach(element => {
        shops.push(element);
      });
      shops.push({
        businessName: user.businessName,
        projectId: user.projectId,
        applicationId: user.applicationId,
        projectUrlId: user.projectUrlId,
        settings: user.settings,
        street: user.street,
        country: user.country,
        region: user.region
      });
      return shops;
    } catch (e) {
      throw e;
    }
  }

  async getCurrentShop(): Promise<ShopI> {
    try {
      const activeShop = await this.indexD.getItem<ShopI>('activeShop');
      if (activeShop && activeShop.projectId && activeShop.applicationId && activeShop.projectUrlId) {
        return activeShop;
      } else {
        throw new Error('No active shop in records');
      }
    } catch (e) {
      throw e;
    }
  }

  async saveCurrentShop(shop: ShopI): Promise<ShopI> {
    try {
      const cProjectId = await this.indexD.getItem('cPID');
      if (cProjectId && cProjectId !== shop.projectId) {
        await this.indexD.removeItem('stocks');
      }
      await this.indexD.setItem('cPID', shop.projectId);
      return await this.indexD.setItem<ShopI>('activeShop', shop);
    } catch (e) {
      throw e;
    }
  }

  createShop(data: { admin: UserI, shop: ShopI }): Promise<ShopI> {
    return new Promise<ShopI>(async (resolve, reject) => {
      this.httpClient.post<ShopI>(this.settings.ssmFunctionsURL + '/functions/shop', data, {
        headers: this.settings.ssmFunctionsHeader
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  deleteShop(shop: ShopI): Promise<ShopI> {
    return undefined;
    // return new Promise<ShopI>((resolve, reject) => {
    //   this.httpClient.delete(this.settings.ssmFunctionsURL + '/functions/shop', {
    //   })
    // });
  }

  updatePassword(user: UserI, password: string): Promise<any> {
    return new Promise<UserI>((resolve, reject) => {
      this.httpClient.put<any>(this.settings.ssmFunctionsURL + '/functions/users/password/' + user.objectId, {
        password: password
      }, {
        headers: this.settings.ssmFunctionsHeader
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  updateUser(user: UserI, data: { [p: string]: any }): Promise<UserI> {
    return new Promise(async (resolve, reject) => {
      this.httpClient.put<UserI>(this.settings.ssmFunctionsURL + '/functions/users/' + user.objectId, data, {
        headers: this.settings.ssmFunctionsHeader
      }).subscribe(value => resolve(value), error1 => {
        reject(error1);
      });
    });
  }

  async updateCurrentUser(user: UserI): Promise<UserI> {
    try {
      return await this.indexD.setItem<UserI>('user', user);
    } catch (e) {
      throw e;
    }
  }

  changePasswordFromOld(data: { lastPassword: string; password: string; user: UserI }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.put<UserI>(this.settings.ssmFunctionsURL + '/functions/users/password/change/' + data.user.objectId, {
        lastPassword: data.lastPassword,
        username: data.user.username,
        password: data.password
      }, {
        headers: this.settings.ssmFunctionsHeader
      }).subscribe(value => resolve(value), error1 => {
        reject(error1);
      });
    });
  }
}
