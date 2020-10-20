import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShopModel} from '../models/shop.model';
import {StorageService} from '@smartstocktz/core-libs';
import {Observable, of} from 'rxjs';
import {UserService} from '../services/user.service';
import {UserModel} from '../models/user.model';
import {LogService} from '@smartstocktz/core-libs';
import {environment} from '../../../../environments/environment';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {UserCreateDialogComponent} from '../components/user-create-dialog.component';
import {UserUpdateDialogComponent} from '../components/user-update-dialog.component';
import {UserDeleteDialogComponent} from '../components/user-delete-dialog.component';

@Component({
  selector: 'smartstock-users',
  template: `
      <mat-sidenav-container *ngIf="!isMobile" class="match-parent">
          <mat-sidenav class="match-parent-side"
                       [fixedInViewport]="true"
                       #sidenav
                       [mode]="enoughWidth()?'side':'over'"
                       [opened]="true">
              <smartstock-drawer></smartstock-drawer>
          </mat-sidenav>

          <mat-sidenav-content>
              <smartstock-toolbar [heading]=""
                                  [sidenav]="sidenav"
                                  [showProgress]="false">
              </smartstock-toolbar>

              <div class="container my-users-wrapper">
                  <mat-tab-group class="container">
                      <mat-tab label="All Users">
                          <div class="">
                              <mat-card class="mat-elevation-z0">
                                  <mat-card-title class="d-flex flex-row">
                                      <button (click)="openAddUserDialog()" color="primary" class="ft-button" mat-flat-button>
                                          Add User
                                      </button>
                                      <span class="toolbar-spacer"></span>
                                      <button [matMenuTriggerFor]="menuUsers" mat-icon-button>
                                          <mat-icon>more_vert</mat-icon>
                                      </button>
                                      <mat-menu #menuUsers>
                                          <button (click)="getUsers()" mat-menu-item>Reload Users</button>
                                      </mat-menu>
                                  </mat-card-title>
                                  <mat-card-content>

                                      <table style="margin-top: 16px" class="my-input"
                                             *ngIf="!fetchUsersFlag && usersArray && usersArray.length > 0"
                                             mat-table
                                             [dataSource]="usersDatasource">

                                          <ng-container matColumnDef="name">
                                              <th mat-header-cell *matHeaderCellDef>Username</th>
                                              <td class="" matRipple mat-cell
                                                  *matCellDef="let element">
                                                  {{element.username}}
                                              </td>
                                          </ng-container>

                                          <ng-container matColumnDef="role">
                                              <th mat-header-cell *matHeaderCellDef>Role</th>
                                              <td class=""
                                                  matRipple mat-cell
                                                  *matCellDef="let element">{{element.role === 'user' ? 'SELLER' : 'MANAGER'}}
                                              </td>
                                          </ng-container>

                                          <ng-container matColumnDef="shops">
                                              <th mat-header-cell *matHeaderCellDef>Shops</th>
                                              <td class=""
                                                  matRipple mat-cell
                                                  *matCellDef="let element">{{element.shops | shopsPipe | async }}
                                              </td>
                                          </ng-container>

                                          <ng-container matColumnDef="actions">
                                              <th mat-header-cell *matHeaderCellDef>
                                                  <div class="d-flex justify-content-end align-items-end">
                                                      Actions
                                                  </div>
                                              </th>
                                              <td mat-cell *matCellDef="let element">
                                                  <div class="d-flex justify-content-end align-items-end">
                                                      <button [matMenuTriggerFor]="opts" color="primary" mat-icon-button>
                                                          <mat-icon>more_vert</mat-icon>
                                                      </button>
                                                      <mat-menu #opts>
                                                          <button (click)="deleteUser(element)" mat-menu-item>
                                                              Delete
                                                          </button>
                                                          <button mat-menu-item (click)="updatePassword(element)">
                                                              Update password
                                                          </button>
                                                      </mat-menu>
                                                  </div>
                                              </td>
                                          </ng-container>

                                          <tr mat-header-row *matHeaderRowDef="usersTableColums"></tr>
                                          <tr mat-row class="table-data-row" *matRowDef="let row; columns: usersTableColums;"></tr>

                                      </table>
                                      <div *ngIf="fetchUsersFlag">
                                          <mat-progress-spinner matTooltip="fetch users" [diameter]="30" mode="indeterminate"
                                                                color="primary"></mat-progress-spinner>
                                      </div>
                                  </mat-card-content>
                              </mat-card>
                          </div>
                      </mat-tab>
                  </mat-tab-group>
              </div>

          </mat-sidenav-content>

      </mat-sidenav-container>
  `,
  styleUrls: ['../style/users.style.css']
})
export class UsersPage extends DeviceInfoUtil implements OnInit {

  usersDatasource: MatTableDataSource<UserModel>;
  usersTableColums = ['name', 'role', 'shops', 'actions'];
  usersArray: UserModel[];
  fetchUsersFlag = false;

  isMobile = environment.android;

  constructor(private readonly userDatabase: UserService,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly logger: LogService,
              private readonly snack: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this.getUsers();
  }

  searchUser(query: string) {
    // if ($event && $event.query) {
    //   this.fetchUsersFlag = true;
    //   this.userDatabase.searchUser($event.query, {size: 20}).then(data => {
    //     this.usersArray = JSON.parse(JSON.stringify(data));
    //     // this.skip +=this.productsArray.length;
    //     this.usersDatasource = new MatTableDataSource(this.usersArray);
    //     this.fetchUsersFlag = false;
    //     // this.size = 0;
    //   }).catch(reason => {
    //     this.snack.open(reason, 'Ok', {
    //       duration: 3000
    //     });
    //     this.fetchUsersFlag = false;
    //   });
    // } else {
    //   this.getUsers();
    // }
  }

  getUsers() {
    this.fetchUsersFlag = true;
    this.userDatabase.getAllUser({size: 100, skip: 0}).then(data => {
      this.usersArray = JSON.parse(JSON.stringify(data));
      this.usersDatasource = new MatTableDataSource<UserModel>(this.usersArray);
      this.fetchUsersFlag = false;
    }).catch(reason => {
      this.logger.i(reason);
      this.fetchUsersFlag = false;
    });
  }

  deleteUser(element: any) {
    this.dialog.open(UserDeleteDialogComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.usersArray = this.usersArray.filter(value => value.id !== element.id);
        this.usersDatasource = new MatTableDataSource<UserModel>(this.usersArray);
        this.snack.open('User deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.snack.open('User not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  updateUserName(user, matMenu: MatMenuTrigger) {
    // matMenu.toggleMenu();
    // if (user && user.value) {
    //   user.field = 'username';
    //   this.updateUser(user);
    // }
  }

  updateUser(user: { id: string, value: string, field: string }) {
    // this.snack.open('Update in progress..', 'Ok');
    // this.userDatabase.updateUser(user).then(data => {
    //   const editedObjectIndex = this.usersArray.findIndex(value => value.id === data.id);
    //   this.usersArray = this.usersArray.filter(value => value.id !== user.id);
    //   if (editedObjectIndex !== -1) {
    //     const updatedObject = this.usersArray[editedObjectIndex];
    //     updatedObject[user.field] = user.value;
    //     this.usersDatasource.data[editedObjectIndex] = updatedObject;
    //   } else {
    //     console.warn('fails to update user table');
    //   }
    //   this.snack.open('User updated', 'Ok', {
    //     duration: 3000
    //   });
    // }).catch(reason => {
    //   this.snack.open(reason && reason.message ? reason.message : 'Fail to update user', 'Ok', {
    //     duration: 3000
    //   });
    // });
  }

  updateUserDescription(user, matMenu: MatMenuTrigger) {
    // matMenu.toggleMenu();
    // if (user && user.value) {
    //   user.field = 'description';
    //   this.updateUser(user);
    // }
  }

  openAddUserDialog() {
    this.dialog.open(UserCreateDialogComponent, {
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.usersArray.push(value);
        this.usersDatasource.data = this.usersArray;
      }
    });
  }

  updatePassword(element: any) {
    this.dialog.open(UserUpdateDialogComponent, {
      data: element
    });
  }
}

