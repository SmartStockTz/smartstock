import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSidenav, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {NgForage} from 'ngforage';
import {UserDatabaseService} from '../../services/user-database.service';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

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
  @Input() searchPlaceholder: string | 'Type to search';

  constructor(private router: Router, private indexDb: NgForage,
              private userDatabase: UserDatabaseService) {
  }

  ngOnInit() {
    this.searchInputControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchCallback.emit(this.searchInputControl.value);
    });
  }

  logout() {
    this.userDatabase.logout(null, value => {
      this.router.navigateByUrl('').catch(reason => console.log(reason));
    });
  }

  searchItem() {
    // this.searchInputControl.reset();
  }
}
