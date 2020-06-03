import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {EventApiService} from 'src/app/services/event-api.service';
import {StorageService} from '../../../services/storage.service';
import {UserDatabaseService} from '../../../services/user-database.service';
import {UserI} from '../../../model/UserI';
import {SsmEvents} from '../../../utils/eventsNames';
import {environment} from '../../../../environments/environment';

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
  isMobile = environment.android;

  constructor(private readonly router: Router,
              private readonly storage: StorageService,
              private readonly userDatabase: UserDatabaseService,
              private readonly eventService: EventApiService) {
  }

  ngOnInit() {
    this.storage.getActiveUser().then(user => {
      this.currentUser = user;
    });
    this.searchInputControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(_ => {
      this.searchCallback.emit(this.searchInputControl.value);
    });

    this.getProductsInCart();
    this._clearSearchInputListener();
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

  private _clearSearchInputListener() {
    // this.eventService.listen(SsmEvents.ADD_CART, data => {
    //   this.searchInputControl.reset('');
    // });
  }
}
