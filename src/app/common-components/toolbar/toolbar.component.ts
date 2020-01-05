import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSidenav, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {NgForage} from 'ngforage';
import {UserDatabaseService} from '../../services/user-database.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() heading: string;
  @Input() showProgress = false;
  @Input() sidenav: MatSidenav;
  @Input() showSearch = false;
  @Output() searchCallback = new EventEmitter<string>();
  searchInputControl = new FormControl('', [Validators.nullValidator, Validators.required]);

  constructor(private router: Router, private indexDb: NgForage,
              private snack: MatSnackBar,
              private userDatabase: UserDatabaseService) {
  }

  ngOnInit() {
    this.searchInputControl.valueChanges.subscribe(query => {
      this.searchCallback.emit(this.searchInputControl.value);
    });
  }

  logout() {
    this.userDatabase.currentUser(user => {
      this.userDatabase.logout(user, value => {
        this.router.navigateByUrl('').catch(reason => console.log(reason));
      });
    });
  }

  searchItem() {
    // this.searchInputControl.reset();
  }
}
