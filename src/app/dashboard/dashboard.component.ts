import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatSidenav, MatSnackBar} from '@angular/material';
import {NgForage} from 'ngforage';
import {UserDatabaseService} from '../services/user-database.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLogin = false;
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(private routes: Router, private indexDb: NgForage,
              private userDatabase: UserDatabaseService,
              private snack: MatSnackBar) {
  }

  ngOnInit() {
    this.userDatabase.currentUser(value => {
      if (value === null) {
        this.routes.navigateByUrl('login').catch(reason => console);
      } else {
        if (value.role !== 'admin') {
          this.routes.navigateByUrl('sale').catch(reason => console.log(reason));
          this.snack.open('Your not an admin, we redirect you to sale');
        } else {
          this.isLogin = true;
        }
      }
    });
  }

  // openDrawer() {
  //   this.sidenav.open()
  //     .then(value => {
  //       console.log(value);
  //     }).catch(reason => {
  //     console.log(reason.toString());
  //   });
  // }
}
