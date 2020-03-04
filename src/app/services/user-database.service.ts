import {Injectable} from '@angular/core';
import {UserDataSource} from '../adapter/UserDataSource';
import {UserI} from '../model/UserI';
import {serverUrl} from '../adapter/ParseBackend';
import {HttpClient} from '@angular/common/http';
import {SettingsServiceService} from './Settings-service.service';
import {ShopI} from '../model/ShopI';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserDatabaseService implements UserDataSource {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _settings: SettingsServiceService,
              private readonly _storage: LocalStorageService) {
  }

  async currentUser(): Promise<UserI> {
    return this._storage.getActiveUser();
  }

  createUser(user: UserI, callback?: (value: any) => void) {
  }

  // implement on cloud functions
  deleteUser(user: UserI): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._httpClient.delete(this._settings.ssmFunctionsURL + '/functions/users/' + user.objectId, {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  getAllUser(pagination: { size: number, skip: number }): Promise<UserI[]> {
    return new Promise<UserI[]>(async (resolve, reject) => {
      const projectId = await this._settings.getCustomerProjectId();
      const where = {
        projectId: projectId,
        role: {
          '$in': ['user', 'manager']
        }
      };
      const urlencoded = encodeURI(JSON.stringify(where) + '&limit=' + 1000000);
      this._httpClient.get<any>(this._settings.ssmServerURL + '/users?where=' + urlencoded, {
        headers: this._settings.ssmHeader
      }).subscribe(value => {
        resolve(value.results);
      }, error1 => {
        reject(error1);
      });
    });
  }

  getUser(user: UserI, callback?: (user: UserI) => void) {

  }

  // needs to be reviewed
  async login(user: { username: string, password: string }): Promise<UserI> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<UserI>(this._settings.ssmServerURL + '/login', {
        params: {
          'username': user.username,
          'password': user.password
        },
        headers: this._settings.ssmHeader
      }).subscribe(async value => {
        try {
          // empty local storage if current project differ from last one
          if (value.role !== 'admin') {
            const cProjectId = await this._storage.getCurrentProjectId();
            if (cProjectId && cProjectId !== value.projectId) {
              await this._storage.clearSsmStorage();
            }
            // set current shop
            await this._storage.saveCurrentProjectId(value.projectId);
            // set active shop
            await this._storage.saveActiveShop({
              settings: value.settings,
              businessName: value.businessName,
              projectId: value.projectId,
              category: value.category,
              projectUrlId: value.projectUrlId,
              applicationId: value.applicationId
            });
          }
          await this._storage.saveActiveUser(value);
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
      await this._storage.removeActiveUser();
      await this._storage.removeActiveShop();
      callback('Ok');
    } catch (reason) {
      console.log(reason);
      callback(null);
    }
  }

  register(user: UserI): Promise<UserI> {
    return new Promise<UserI>((resolve, reject) => {
      user.settings = {
        printerFooter: 'Thank you',
        printerHeader: '',
        saleWithoutPrinter: true,
      };
      this._httpClient.post<UserI>(this._settings.ssmFunctionsURL + '/functions/users/create', user, {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(value => {
        this._storage.saveActiveUser(value).then(_ => {
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
    this._httpClient.get(serverUrl + '/sessions/me', {
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
      const shop = await this._storage.getActiveShop();
      user.shops = [];
      user.applicationId = shop.applicationId;
      user.projectUrlId = shop.projectUrlId;
      user.projectId = shop.projectId;
      user.businessName = shop.businessName;
      user.settings = shop.settings;
      this._httpClient.post<UserI>(this._settings.ssmFunctionsURL + '/functions/users/seller', user, {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  async getShops(): Promise<ShopI[]> {
    try {
      const user = await this._storage.getActiveUser();
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
      const activeShop = await this._storage.getActiveShop();
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
      const cProjectId = await this._storage.getCurrentProjectId();
      if (cProjectId && cProjectId !== shop.projectId) {
        await this._storage.removeStocks();
      }
      await this._storage.saveCurrentProjectId(shop.projectId);
      return await this._storage.saveActiveShop(shop);
    } catch (e) {
      throw e;
    }
  }

  createShop(data: { admin: UserI, shop: ShopI }): Promise<ShopI> {
    return undefined;
    // return new Promise<ShopI>(async (resolve, reject) => {
    //   this.httpClient.post<ShopI>(this.settings.ssmFunctionsURL + '/functions/shop', data, {
    //     headers: this.settings.ssmFunctionsHeader
    //   }).subscribe(value => {
    //     resolve(value);
    //   }, error => {
    //     reject(error);
    //   });
    // });
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
      this._httpClient.put<any>(this._settings.ssmFunctionsURL + '/functions/users/password/' + user.objectId, {
        password: password
      }, {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  updateUser(user: UserI, data: { [p: string]: any }): Promise<UserI> {
    return new Promise(async (resolve, reject) => {
      this._httpClient.put<UserI>(this._settings.ssmFunctionsURL + '/functions/users/' + user.objectId, data, {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(value => resolve(value), error1 => {
        reject(error1);
      });
    });
  }

  async updateCurrentUser(user: UserI): Promise<UserI> {
    try {
      return await this._storage.saveActiveUser(user);
    } catch (e) {
      throw e;
    }
  }

  changePasswordFromOld(data: { lastPassword: string; password: string; user: UserI }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._httpClient.put<UserI>(this._settings.ssmFunctionsURL + '/functions/users/password/change/' + data.user.objectId, {
        lastPassword: data.lastPassword,
        username: data.user.username,
        password: data.password
      }, {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(value => resolve(value), error1 => {
        reject(error1);
      });
    });
  }
}
