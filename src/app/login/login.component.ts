import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(public routes: Router) {
  }

  ngOnInit() {
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
