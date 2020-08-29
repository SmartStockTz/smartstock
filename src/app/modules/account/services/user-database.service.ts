import {Injectable} from '@angular/core';
import {UserModel} from '../models/user.model';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from './settings.service';
import {ShopModel} from '../models/shop.model';
import {StorageService} from '../../lib/services/storage.service';
import {BFast} from 'bfastjs';
import {MatDialog} from '@angular/material/dialog';
import {LogService} from '../../lib/services/log.service';
import {VerifyEMailDialogComponent} from '../components/verify-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UserDatabaseService {


  constructor(private readonly _httpClient: HttpClient,
              private readonly _settings: SettingsService,
              private readonly dialog: MatDialog,
              private readonly logger: LogService,
              private readonly _storage: StorageService) {
  }

  async currentUser(): Promise<UserModel> {
    // this.refreshToken().catch(reason => {
    //   if (reason && reason.response && reason.response.data && reason.response.data.code === 209) {
    //     return BFast.auth().logOut();
    //   }
    //   return {};
    // }).catch(this.logger.w);
    const user = await BFast.auth().currentUser<UserModel>();
    if (user && user.role !== 'admin') {
      return user;
    } else if (user && user.verified === true) {
      return user;
    } else {
      return await BFast.auth().setCurrentUser(undefined);
    }
  }

  async deleteUser(user: UserModel): Promise<any> {
    return BFast.functions()
      .request('/functions/users/' + user.id)
      .delete({
        data: {context: {admin: await BFast.auth().currentUser()}}
      });
  }

  async getAllUser(pagination: { size: number, skip: number }): Promise<UserModel[]> {
    const projectId = await this._settings.getCustomerProjectId();
    return BFast.database().collection('_User')
      .query()
      .equalTo('projectId', projectId)
      .includesIn('role', ['user', 'manager'])
      .size(pagination.size)
      .skip(pagination.skip)
      .find<UserModel[]>({
        useMasterKey: true
      });
  }

  getUser(user: UserModel, callback?: (user: UserModel) => void) {

  }

  async login(user: { username: string, password: string }): Promise<UserModel> {
    const authUser = await BFast.auth().logIn<UserModel>(user.username, user.password);
    console.log(authUser);
    await this._storage.removeActiveShop();
    if (authUser && authUser.role !== 'admin') {
      await this._storage.saveActiveUser(authUser);
      return authUser;
    } else if (authUser && authUser.verified === true) {
      await this._storage.saveActiveUser(authUser);
      return authUser;
    } else {
      await BFast.functions().request('/functions/users/reVerifyAccount/' + user.username).post();
      this.dialog.open(VerifyEMailDialogComponent, {
        closeOnNavigation: true,
        disableClose: true
      });
      throw {code: 403, err: 'account not verified'};
    }
  }

  async logout(user: UserModel) {
    await BFast.auth().logOut();
    await this._storage.removeActiveUser();
    await this._storage.removeActiveShop();
    return;
  }

  async register(user: UserModel): Promise<UserModel> {
    try {
      user.settings = {
        printerFooter: 'Thank you',
        printerHeader: '',
        saleWithoutPrinter: true,
        allowRetail: true,
        allowWholesale: true
      };
      user.shops = [];
      await this._storage.removeActiveShop();
      return await BFast.functions().request('/functions/users/create').post(user, {
        headers: this._settings.ssmFunctionsHeader
      });
    } catch (e) {
      if (e && e.response && e.response.data) {
        throw e.response.data;
      } else {
        throw e.toString();
      }
    }
  }

  resetPassword(username: string): Promise<any> {
    return BFast.functions().request('/functions/users/resetPassword/' + encodeURIComponent(username)).get();
  }

  async refreshToken(): Promise<any> {
    return BFast.auth().currentUser();
  }

  addUser(user: UserModel): Promise<UserModel> {
    return new Promise<UserModel>(async (resolve, reject) => {
      const shop = await this._storage.getActiveShop();
      const shops = user.shops ? user.shops : [];
      const shops1 = shops.filter(value => value.applicationId !== shop.applicationId);
      user.applicationId = shop.applicationId;
      user.projectUrlId = shop.projectUrlId;
      user.projectId = shop.projectId;
      user.businessName = shop.businessName;
      user.settings = shop.settings;
      user.shops = shops1;
      this._httpClient.post<UserModel>(this._settings.ssmFunctionsURL + '/functions/users/seller', user, {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  async getShops(): Promise<ShopModel[]> {
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

  async getCurrentShop(): Promise<ShopModel> {
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

  async saveCurrentShop(shop: ShopModel): Promise<ShopModel> {
    try {
      await this._storage.saveCurrentProjectId(shop.projectId);
      return await this._storage.saveActiveShop(shop);
    } catch (e) {
      throw e;
    }
  }

  createShop(data: { admin: UserModel, shop: ShopModel }): Promise<ShopModel> {
    return undefined;
    // return new Promise<ShopModel>(async (resolve, reject) => {
    //   this.httpClient.post<ShopModel>(this.settings.ssmFunctionsURL + '/functions/shop', data, {
    //     headers: this.settings.ssmFunctionsHeader
    //   }).subscribe(value => {
    //     resolve(value);
    //   }, error => {
    //     reject(error);
    //   });
    // });
  }

  deleteShop(shop: ShopModel): Promise<ShopModel> {
    return undefined;
    // return new Promise<ShopModel>((resolve, reject) => {
    //   this.httpClient.delete(this.settings.ssmFunctionsURL + '/functions/shop', {
    //   })
    // });
  }

  updatePassword(user: UserModel, password: string): Promise<any> {
    return new Promise<UserModel>((resolve, reject) => {
      this._httpClient.put<any>(this._settings.ssmFunctionsURL + '/functions/users/password/' + user.id, {
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

  updateUser(user: UserModel, data: { [p: string]: any }): Promise<UserModel> {
    return new Promise(async (resolve, reject) => {
      this._httpClient.put<UserModel>(this._settings.ssmFunctionsURL + '/functions/users/' + user.id, data, {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(value => resolve(value), error1 => {
        reject(error1);
      });
    });
  }

  async updateCurrentUser(user: UserModel): Promise<UserModel> {
    try {
      return await this._storage.saveActiveUser(user);
    } catch (e) {
      throw e;
    }
  }

  changePasswordFromOld(data: { lastPassword: string; password: string; user: UserModel }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._httpClient.put<UserModel>(this._settings.ssmFunctionsURL + '/functions/users/password/change/' + data.user.id, {
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
