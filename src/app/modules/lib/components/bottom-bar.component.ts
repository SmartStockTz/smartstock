import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-bottom-bar',
  template: `
    <mat-toolbar class="fixed-bottom bottom-app-bar">

      <div class="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
        <button mat-icon-button *ngIf="activeNav('dashboard')" mat-flat-button routerLink="/dashboard">
          <mat-icon color="{{activeNav('dashboard')?'primary':''}}">dashboard</mat-icon>
        </button>
        <button *ngIf="!activeNav('dashboard')" mat-icon-button routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon>
        </button>
        <!--    <span *ngIf="activeNav('dashboard')">Dashboard</span>-->
      </div>

      <div class="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
        <button mat-icon-button *ngIf="activeNav('sale')" mat-flat-button routerLink="/sale">
          <mat-icon color="{{activeNav('sale')?'primary':''}}">shop</mat-icon>
        </button>
        <button *ngIf="!activeNav('sale')" mat-icon-button routerLink="/sale">
          <mat-icon>shop</mat-icon>
        </button>
        <!--    <span *ngIf="activeNav('sale')">Sale</span>-->
      </div>

      <div class="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
        <button mat-icon-button *ngIf="activeNav('purchase')" mat-flat-button routerLink="/purchase">
          <mat-icon color="{{activeNav('purchase')?'primary':''}}">receipt</mat-icon>
        </button>
        <button *ngIf="!activeNav('purchase')" mat-icon-button routerLink="/purchase">
          <mat-icon>receipt</mat-icon>
        </button>
        <!--    <span *ngIf="activeNav('purchase')">Purchase</span>-->
      </div>

      <div class="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
        <button mat-icon-button *ngIf="activeNav('stock')" mat-flat-button routerLink="/stock">
          <mat-icon color="{{activeNav('stock')?'primary':''}}">store</mat-icon>
        </button>
        <button *ngIf="!activeNav('stock')" mat-icon-button routerLink="/stock">
          <mat-icon>store</mat-icon>
        </button>
        <!--    <span *ngIf="activeNav('stock')">StockModel</span>-->
      </div>

      <div class="flex-grow-1 d-flex justify-content-center align-items-center flex-column">
        <button mat-icon-button *ngIf="activeNav('settings')" mat-flat-button routerLink="/settings">
          <mat-icon color="{{activeNav('settings')?'primary':''}}">settings</mat-icon>
        </button>
        <button *ngIf="!activeNav('settings')" mat-icon-button routerLink="/settings">
          <mat-icon>settings</mat-icon>
        </button>
        <!--    <span *ngIf="activeNav('settings')">Settings</span>-->
      </div>

    </mat-toolbar>
  `,
  styleUrls: ['../styles/bottom-bar.style.css']
})
export class BottomBarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  activeNav(route: string) {
    const url = new URL(location.href);
    return url.pathname.startsWith('/' + route);
  }
}
