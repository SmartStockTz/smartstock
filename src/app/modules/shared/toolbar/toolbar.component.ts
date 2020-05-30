import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {EventApiService} from 'src/app/services/event-api.service';
import {StorageService} from '../../../services/storage.service';
import {UserDatabaseService} from '../../../services/user-database.service';
import {UserI} from '../../../model/UserI';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() heading: string;
  @Input() showProgress = false;
  @Input() sidenav: MatSidenav;
  @Input() cartdrawer: MatSidenav;
  @Input() showSearch = false;
  @Output() searchCallback = new EventEmitter<string>();
  searchInputControl = new FormControl('', [Validators.nullValidator, Validators.required]);
  @Input() searchPlaceholder: string | 'Type to search';
  currentUser: UserI;

  noOfProductsInCart;
  @Input() searchProgressFlag = false;

  constructor(private router: Router,
              private readonly _storage: StorageService,
              private userDatabase: UserDatabaseService,
              private readonly eventService: EventApiService) {
  }

  ngOnInit() {
    this._storage.getActiveUser().then(user => {
      this.currentUser = user;
    });
    this.searchInputControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchCallback.emit(this.searchInputControl.value);
    });

    this.getProductsInCart();
  }

  getProductsInCart() {
    this.eventService.listen('noofProductsCart', (data) => {
      this.noOfProductsInCart = data.detail;
    });
  }

  logout() {
    this.userDatabase.logout(null).then(_ => {
      return this.router.navigateByUrl('');
    }).catch(reason => console.log(reason));
  }
}
