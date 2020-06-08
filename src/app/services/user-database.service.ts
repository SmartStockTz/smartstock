import {Injectable} from '@angular/core';
import {UserDataSource} from '../adapter/UserDataSource';
import {UserI} from '../model/UserI';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from './settings.service';
import {ShopI} from '../model/ShopI';
import {StorageService} from './storage.service';
import {BFast} from 'bfastjs';
import {MatDialog} from '@angular/material/dialog';
import {LogService} from './log.service';
import {VerifyEMailDialogComponent} from '../landing/login/verify-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UserDatabaseService implements UserDataSource {


  constructor(private readonly _httpClient: HttpClient,
              private readonly _settings: SettingsService,
              private readonly dialog: MatDialog,
              private readonly logger: LogService,
              private readonly _storage: StorageService) {
  }

  async currentUser(): Promise<UserI> {
    this.refreshToken().catch(reason => {
      if (reason && reason.response && reason.response.data && reason.response.data.code === 209) {
        return BFast.auth().logOut();
      }
      return {};
    }).catch(this.logger.w);
    const user = await BFast.auth().currentUser<UserI>();
    if (user && user.verified === true) {
      return user;
    } else {
      return await BFast.auth().setCurrentUser(undefined);
    }
  }

  async deleteUser(user: UserI): Promise<any> {
    return BFast.functions()
      .request('/functions/users/' + user.objectId)
      .delete({context: {admin: await BFast.auth().currentUser()}});
  }

  async getAllUser(pagination: { size: number, skip: number }): Promise<UserI[]> {
    const projectId = await this._settings.getCustomerProjectId();
    return BFast.database(projectId).collection('_User').query().find<UserI>({
      size: pagination.size,
      skip: pagination.skip,
      filter: {
        projectId: projectId,
        // @ts-ignore
        role: {
          '$in': ['user', 'manager']
        }
      }
    });
  }

  getUser(user: UserI, callback?: (user: UserI) => void) {

  }

  async login(user: { username: string, password: string }): Promise<UserI> {
    const authUser = await BFast.auth().logIn<UserI>(user.username, user.password);
    if (authUser && authUser.role !== 'admin') {
      return authUser;
    }
    if (authUser && authUser.verified === true) {
      await this._storage.saveActiveUser(authUser);
      return authUser;
    } else {
      await BFast.functions().request(this._settings.ssmFunctionsURL + '/functions/users/reVerifyAccount/' + user.username).post();
      this.dialog.open(VerifyEMailDialogComponent, {
        closeOnNavigation: true,
        disableClose: true
      });
      throw {code: 4003, err: 'account not verified'};
    }
  }

  async logout(user: UserI) {
    await BFast.auth().logOut();
    await this._storage.removeActiveUser();
    await this._storage.removeActiveShop();
    return;
  }

  async register(user: UserI): Promise<UserI> {
    try {
      user.settings = {
        printerFooter: 'Thank you',
        printerHeader: '',
        saleWithoutPrinter: true,
        allowRetail: true,
        allowWholesale: true
      };
      user.shops = [];
      await BFast.functions().request('/functions/users/create').post(user, {
        headers: this._settings.ssmFunctionsHeader
      });
    } catch (e) {
      if (e && e.response && e.response.data) {
        return e.response.data;
      } else {
        return e;
      }
    }
  }

  resetPassword(user: UserI, callback?: (value: any) => void) {
    callback('');
  }

  async refreshToken(): Promise<any> {
    return BFast.auth().authenticated();
  }

  addUser(user: UserI): Promise<UserI> {
    return new Promise<UserI>(async (resolve, reject) => {
      const shop = await this._storage.getActiveShop();
      const shops = user.shops ? user.shops : [];
      const shops1 = shops.filter(value => value.applicationId !== shop.applicationId);
      user.applicationId = shop.applicationId;
      user.projectUrlId = shop.projectUrlId;
      user.projectId = shop.projectId;
      user.businessName = shop.businessName;
      user.settings = shop.settings;
      user.shops = shops1;
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
