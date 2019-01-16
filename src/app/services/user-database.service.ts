import {Injectable} from '@angular/core';
import {UserDataSource} from '../database/connector/UserDataSource';
import {UserI} from '../model/UserI';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {NgForage} from 'ngforage';
import {ParseBackend} from '../database/ParseBackend';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserDatabaseService extends ParseBackend implements UserDataSource {

  constructor(private firestore: AngularFirestore,
              private httpClient: HttpClient,
              private fireAuth: AngularFireAuth,
              private indexD: NgForage) {
    super();
  }

  createUser(user: UserI, callback?: (value: any) => void) {
    this.httpClient.post<UserI>(this.serverUrl + '/users', user, {
      headers: this.postHeaderUser
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  // implement on cloud functions
  deleteUser(user: UserI, callback?: (value: any) => void) {
  }

  getAllUser(callback?: (users: UserI[]) => void) {
    this.httpClient.get<any>(this.serverUrl + '/users', {
      headers: this.getHeader
    }).subscribe(value => {
      callback(value.results);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  getUser(user: UserI, callback?: (user: UserI) => void) {
    this.httpClient.get<UserI>(this.serverUrl + '/users/' + user.objectId, {
      headers: this.getHeader
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  login(user: UserI, callback?: (value: UserI) => void) {
    this.httpClient.get<UserI>(this.serverUrl + '/login', {
      params: {
        'username': user.username + '@ssm.com',
        'password': user.password
      },
      headers: this.getHeaderUser
    }).subscribe(value => {
      this.indexD.setItem<UserI>('user', value).then(value1 => {
        console.log('saved user in cache is ---> ' + value1.objectId);
        callback(value);
      }).catch(reason => callback(null));
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  logout(user: UserI, callback?: (value: any) => void) {
    this.httpClient.post(this.serverUrl + '/logout', {}, {
      headers: {
        'X-Parse-Application-Id': 'ssm',
        'X-Parse-Session-Token': 'r:' + user.sessionToken
      }
    }).subscribe(value => callback(value), error1 => {
      console.log(error1);
      callback(null);
    });
  }

  register(user: UserI, callback?: (value: any) => void) {
    this.createUser(user, callback);
  }

  resetPassword(user: UserI, callback?: (value: any) => void) {
    this.httpClient.post(this.serverUrl + '/requestPasswordReset', {
      'email': user.meta.email
    }, {
      headers: this.postHeader
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  updateUser(user: UserI, callback?: (value: any) => void) {
    this.httpClient.put(this.serverUrl + '/users/' + user.objectId, user, {
      headers: {
        'X-Parse-Application-Id': 'ssm',
        'X-Parse-Session-Token': 'r:' + user.sessionToken,
        'Content-Type': 'application/json'
      }
    }).subscribe(value => callback(value), error1 => {
      console.log(error1);
      callback(null);
    });
  }
}
