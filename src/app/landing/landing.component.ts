import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../services/user-database.service';
import {MatSnackBar} from '@angular/material';
import {NgForage} from 'ngforage';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  log: boolean;
  message = 'The revolution smart stock manage and sales point is here now. ' +
    'Let us take care of your business so you can focus on profit. Start using our service today, its easy, simple and secure';

  constructor(private router: Router,
              private snack: MatSnackBar,
              private indexDb: NgForage,
              private auth: UserDatabaseService) {
  }

  ngOnInit() {
    this.message = 'The revolution smart stock manage and sales point is here now. ' +
      'Let us take care of your business so you can focus on profit. Start using our service today, its easy, simple and secure';
    this.indexDb.getItem('user').then(value => {
      if (value !== null) {
        this.log = true;
      } else {
        this.log = false;
      }
    });
  }

  logout() {
    this.snack.open('Wait while we log you out');
    this.auth.logout().then(value => {
      this.snack.open('Successful logout', 'Ok', {duration: 3000});
      this.log = false;
    }).catch(reason => {
      this.snack.open(reason, 'Ok');
    });
  }

  login() {
    this.router.navigateByUrl('login')
      .catch(reason => {
        console.log(reason.toString());
      });
  }

  goToShop() {
    this.router.navigateByUrl('login').catch(reason => {
      console.log(reason.toString());
    });
  }
}
