import {Injectable} from '@angular/core';
import {UserDataSource} from '../database/connector/UserDataSource';
import {DatabaseCallback} from '../database/DatabaseCallback';
import {UserI} from '../model/UserI';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {NgForage} from 'ngforage';

@Injectable({
  providedIn: 'root'
})
export class UserDatabaseService implements UserDataSource {

  constructor(private firestore: AngularFirestore, private fireAuth: AngularFireAuth, private indexD: NgForage) {
  }

  createUser(user: UserI, callback?: DatabaseCallback) {
  }

  deleteUser(user: UserI, callback?: DatabaseCallback) {
  }

  getAllUser(callback?: DatabaseCallback) {
  }

  getUser(user: UserI, callback?: DatabaseCallback) {
  }

  async login(user: UserI, callback?: Function) {
    const userCredential = await this.fireAuth.auth.signInWithEmailAndPassword(user.username, user.password);
    const roleU = await this.firestore.collection('users').ref.limit(1)
      .where('id', '==', userCredential.user.uid).get();
    await this.indexD.setItem<UserI>('user', {
      username: user.username,
      password: '',
      id: userCredential.user.uid,
      role: roleU.docs[0].get('role')
    });
  }

  async logout(callback?: Function) {
    await this.fireAuth.auth.signOut();
    await this.indexD.setItem('user', null);
  }

  register(user: UserI, callback?: DatabaseCallback) {
  }

  async resetPassword(user: UserI, callback?: DatabaseCallback) {
    await this.fireAuth.auth.sendPasswordResetEmail(user.username);
  }

  updateUser(user: UserI, callback?: DatabaseCallback) {
  }
}
