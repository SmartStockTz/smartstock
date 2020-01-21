import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {NgForage} from 'ngforage';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  slides = [11, 2, 4, 5, 7];
  log: boolean;
  message = 'The revolution smart stock manage and sales point is here now. ' +
    'Let us take care of your business so you can focus on profit. Start using' +
    ' our service today, its easy, simple and secure';

  constructor(private router: Router,
              private snack: MatSnackBar,
              private indexDb: NgForage) {
  }

  ngOnInit() {
    // this.message = 'The revolution smart stock manage and sales point is here now. ' +
    //   'Let us take care of your business so you can focus on profit. Start using our service today, its easy, simple and secure';
  }

  logout() {
    // this.userDatabase.currentUser(user => {
    //   if (user === null) {
    //     this.snack.open('Can\'t log you out', 'Ok', {duration: 3000});
    //   } else {
    //     this.userDatabase.logout(user, value => {
    //       if (value === null) {
    //         this.snack.open('Can\'t log you out', 'Ok', {duration: 3000});
    //       } else {
    //         this.router.navigateByUrl('').catch(reason => console.log(reason));
    //       }
    //     });
    //   }
    // });
  }

  login() {
    this.router.navigateByUrl('login')
      .catch(reason => {
        console.log(reason.toString());
      });
  }

  goToShop() {
    this.login();
  }
}
