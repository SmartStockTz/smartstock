import {Injectable} from '@angular/core';
import {UserDataSource} from '../database/connector/UserDataSource';
import {UserI} from '../model/UserI';
import {NgForage} from 'ngforage';
import {ParseBackend, serverUrl} from '../database/ParseBackend';
import {HttpClient} from '@angular/common/http';
import {SettingsServiceService} from './Settings-service.service';

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
  deleteUser(user: UserI, callback?: (value: any) => void) {
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
          const cProjectId = await this.indexD.getItem('cPID');
          if (cProjectId && cProjectId !== value.projectId) {
            await this.indexD.clear();
          }
          await this.indexD.setItem<UserI>('user', value);
          await this.indexD.setItem('cPID', value.projectId);
          resolve(value);
        } catch (e) {
          reject(e);
        }
      }, error1 => {
        reject(error1);
      });
    });
  }

  logout(user: UserI, callback?: (value: any) => void) {
    // console.log(this.serverUrl + '/logout');
    // console.log(user.sessionToken);
    // this.httpClient.post(this.serverUrl + '/logout', {}, {
    //   headers: {
    //     'X-Parse-Application-Id': 'lbpharmacy',
    //     'X-Parse-Session-Token': user.sessionToken
    //   }
    // }).subscribe(value => {
    this.indexD.removeItem('user').then(value1 => {
      // console.log('user removed from cache is ---> successful');
      callback('Ok');
    }).catch(reason => {
      console.log(reason);
      callback(null);
    });
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
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

  updateUser(user: { objectId: string, value: string, field: string }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.httpClient.put(this.settings.ssmFunctionsURL + '/functions/users/update' + user.objectId, user, {
        headers: await this.settings.getCustomerPostHeader()
      }).subscribe(value => resolve(value), error1 => {
        console.log(error1);
        reject(null);
      });
    });
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
    return new Promise<UserI>((resolve, reject) => {
      this.httpClient.post<UserI>(this.settings.ssmFunctionsURL + '/functions/users/create', user, {
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
      const user = await this.indexD.getItem('user');
    } catch (e) {

    }
  }
}
