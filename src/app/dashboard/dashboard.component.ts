import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private fireAuth: AngularFireAuth, private routes: Router) {
  }

  ngOnInit() {
    // if (this.fireAuth.auth.currentUser == null) {
    //   console.log('user is null');
    //   this.routes.navigateByUrl('login');
    // } else {
    //   console.log('user is not null');
    // }
  }

  getstate() {
    this.fireAuth.authState.subscribe(value => {
      if (value.email == null) {
        console.log('user is null');
      } else {
        console.log('user is not null : ' + value.email);
      }
    });
  }

}
