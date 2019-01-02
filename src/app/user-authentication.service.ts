import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationService {

  constructor(private firestore: AngularFirestore, fireAuth: AngularFireAuth) {
  }

  login(username: string, password: string) {

  }
}
