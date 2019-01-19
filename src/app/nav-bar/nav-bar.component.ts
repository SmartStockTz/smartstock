import {Component, Input, OnInit} from '@angular/core';
import {MatSidenav, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {NgForage} from 'ngforage';
import {UserDatabaseService} from '../services/user-database.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input()
  heading: string;
  @Input()
  showProgress = false;
  @Input()
  sidenav: MatSidenav;

  constructor(private router: Router, private indexDb: NgForage,
              private snack: MatSnackBar,
              private userDatabase: UserDatabaseService) {
  }

  ngOnInit() {
  }

  openDrawer() {
    this.sidenav.open().catch(reason => {
      console.log(reason.toString());
    });
  }

  home() {
    this.router.navigateByUrl('').catch(reason => {
      console.log(reason.toString());
    });
  }

  logout() {
    this.userDatabase.currentUser(user => {
      if (user === null) {
        this.snack.open('Can\'t log you out, there is no current user', 'Ok', {duration: 3000});
        this.router.navigateByUrl('login').catch(reason => console.log(reason));
      } else {
        this.userDatabase.logout(user, value => {
          if (value === null) {
            this.snack.open('Can\'t log you out', 'Ok', {duration: 3000});
          } else {
            this.router.navigateByUrl('').catch(reason => console.log(reason));
          }
        });
      }
    });
  }

}
