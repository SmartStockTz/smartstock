import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../services/user-database.service';
import {MatSnackBar} from '@angular/material';
import {NgForage} from 'ngforage';
import {UserI} from '../model/UserI';

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
              private userDatabase: UserDatabaseService) {
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
    this.indexDb.getItem<UserI>('user').then(user => {
      this.userDatabase.logout(user, value => {
        if (value === null) {
          this.snack.open('Can\'t log you out', 'Ok', {duration: 3000});
        } else {
          this.router.navigateByUrl('').catch(reason => console.log(reason));
        }
      });
    }).catch(reason => {
      console.log(reason);
      this.snack.open('Can\'t log you out', 'Ok', {duration: 3000});
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
