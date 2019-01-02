import {Injectable} from '@angular/core';
import {UserDataSource} from '../database/connector/UserDataSource';
import {DatabaseCallback} from '../database/DatabaseCallback';
import {UserI} from '../model/UserI';
import {HttpClient} from '@angular/common/http';
import {UrlsConstants} from '../model/urlsConstants';

@Injectable({
  providedIn: 'root'
})
export class UserDatabaseService implements UserDataSource {

  urlConst: UrlsConstants;
  constructor(private httpClient: HttpClient) {
    this.urlConst = new UrlsConstants('http://localhost:8080');
  }

  createUser(user: UserI, callback: DatabaseCallback) {
  }

  deleteUser(user: UserI, callback: DatabaseCallback) {
  }

  getAllUser(callback: DatabaseCallback) {
  }

  getUser(user: UserI, callback) {
  }

  login(user: UserI, callback: DatabaseCallback) {
    this.httpClient.get(this.urlConst.LOGIN_URL, {
      params: {
        n: user.username,
      }
    }).subscribe(value => {
      callback.success(value);
    }, error1 => {
      callback.error(error1);
    });
  }

  register(user: UserI, callback: DatabaseCallback) {
  }

  resetPassword(user: UserI, callback: DatabaseCallback) {
  }

  updateUser(user: UserI, callback: DatabaseCallback) {
  }
}
