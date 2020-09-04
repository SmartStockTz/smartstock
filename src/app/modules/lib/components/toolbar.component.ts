import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {EventService} from 'src/app/modules/lib/services/event.service';
import {StorageService} from '../services/storage.service';
import {UserService} from '../../account/services/user.service';
import {UserModel} from '../../account/models/user.model';
import {environment} from '../../../../environments/environment';
import {SsmEvents} from '../utils/eventsNames.util';

@Component({
  selector: 'smartstock-toolbar',
  template: `
    <mat-toolbar color="primary" class="sticky-top mat-elevation-z4">
      <mat-toolbar-row>
        <button *ngIf="(!hasBackRoute && !backLink) || !isMobile" mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <button routerLink="{{backLink}}" *ngIf="hasBackRoute && backLink && isMobile" mat-icon-button>
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>{{heading}}</span>
        <span *ngIf="isMobile" style="flex: 1 1 auto"></span>
        <span *ngIf="!isMobile && showSearch" style="width: 16px"></span>
        <span *ngIf="!isMobile && !showSearch" style="flex: 1 1 auto"></span>
        <smartstock-search-input [searchProgressFlag]="searchProgressFlag"
                          *ngIf="!isMobile && showSearch" style="flex: 1 1 auto"
                          [showSearch]="showSearch"
                          [searchInputControl]="searchInputControl"
                          [searchPlaceholder]="searchPlaceholder">
        </smartstock-search-input>
        <span *ngIf="!isMobile && showSearch" style="width: 16px"></span>
        <button *ngIf="noOfProductsInCart> 0 && !isMobile" mat-icon-button (click)="cartdrawer.toggle()"
                [matBadge]="noOfProductsInCart">
          <mat-icon>shopping_cart</mat-icon>
        </button>
        <button *ngIf="!isMobile" class="ft-button" mat-button [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
          <span *ngIf="currentUser">{{"  " + currentUser.username}}</span>
        </button>
        <button *ngIf="isMobile" mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
          <!--      <span *ngIf="currentUser">{{"  " + currentUser.username}}</span>-->
        </button>
        <mat-menu #menu>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            Logout
          </button>
          <button mat-menu-item routerLink="/account/profile">
            <mat-icon>person</mat-icon>
            My Profile
          </button>
        </mat-menu>
      </mat-toolbar-row>

      <mat-toolbar-row *ngIf="isMobile && showSearch">
        <!--    <span style="flex-grow: 1"></span>-->
        <smartstock-search-input [searchProgressFlag]="searchProgressFlag"
                          style="flex: 1 1 auto"
                          [showSearch]="showSearch"
                          [searchInputControl]="searchInputControl"
                          [searchPlaceholder]="searchPlaceholder">
        </smartstock-search-input>
        <!--    <span style="flex-grow: 1"></span>-->
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styleUrls: ['../styles/toolbar.style.css']
})
export class ToolbarComponent implements OnInit {
  @Input() heading: string;
  @Input() showProgress = false;
  @Input() sidenav: MatSidenav;
  @Input() hasBackRoute = false;
  @Input() backLink: string;
  @Input() cartdrawer: MatSidenav;
  @Input() showSearch = false;
  @Output() searchCallback = new EventEmitter<string>();
  @Input() searchInputControl = new FormControl('');
  @Input() searchPlaceholder: string | 'Type to search';
  currentUser: UserModel;

  noOfProductsInCart;
  @Input() searchProgressFlag = false;
  isMobile = environment.android;

  constructor(private readonly router: Router,
              private readonly storage: StorageService,
              private readonly userDatabase: UserService,
              private readonly eventService: EventService) {
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
    this.eventService.listen(SsmEvents.NO_OF_CART, (data) => {
      this.noOfProductsInCart = data.detail;
    });
  }

  logout() {
    this.userDatabase.logout(null).finally(() => {
      return this.router.navigateByUrl('');
    }).catch(err => console.log(''));
  }

  private _clearSearchInputListener() {
    // this.eventService.listen(SsmEvents.ADD_CART, data => {
    //   this.searchInputControl.reset('');
    // });
  }
}
