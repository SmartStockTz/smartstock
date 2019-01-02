import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {UserDatabaseService} from '../services/user-database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  usernameControlInput = new FormControl();
  passwordControlInput = new FormControl();

  constructor(public routes: Router, private userDatabase: UserDatabaseService) {
  }

  ngOnInit() {
    this.userDatabase.login({
      username: 'lina',
      password: 'jeremiah',
    }, {
      success(data: any) {
        console.log(data);
      },
      error(data: any) {
        console.log(data);
      }
    });
  }

  goHome() {
    console.log('back is clicked');
    this.routes.navigateByUrl('/').catch(reason => {
      console.log(reason.toString());
    });
  }

  login() {
    if (this.username === '') {
      alert('Enter user name please');
    } else if (this.password === '') {
      alert('Please enter password');
    } else {
      console.log('error go to sale');
      this.routes.navigateByUrl('sale').catch(reason => {
        console.log(reason.toString());
      });
    }

  }
}
