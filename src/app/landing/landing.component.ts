import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  log: boolean;
  message: string;

  constructor(private router: Router, private auth: AngularFireAuth) {
  }

  ngOnInit() {
    this.log = this.auth.auth.currentUser != null;
    this.auth.authState.subscribe(value => {
      if (value == null) {
        this.log = false;
        this.message = 'The revolution is here';
      } else {
        this.log = true;
        this.message = 'Welcome back ' + value.displayName + ' ';
      }
    }, error1 => {
      console.log('error in authenticate listener');
    });
  }

  register() {
    console.log('Register clicked');
  }

  logout() {
    console.log('logout clciked');
  }

  login() {
    this.router.navigateByUrl('login')
      .catch(reason => {
        console.log(reason.toString());
      });
  }

  profile() {
    console.log('profile clicked');
    if (!this.log) {
      this.router.navigateByUrl('login').catch(reason => {
        console.log(reason.toString());
      });
    }
  }
}
