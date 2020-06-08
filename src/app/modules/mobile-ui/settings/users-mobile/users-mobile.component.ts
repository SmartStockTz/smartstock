import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {DeviceInfo} from '../../../shared/DeviceInfo';
import {UserI} from '../../../../model/UserI';
import {UserDatabaseService} from '../../../../services/user-database.service';
import {InfoMessageService} from '../../../../services/info-message.service';
import {
  DialogUserDeleteComponent,
  DialogUserNewComponent,
  UpdateUserPasswordDialogComponent
} from '../../../settings/users/users.component';


@Component({
  selector: 'app-users-mobile',
  templateUrl: './users-mobile.component.html',
  styleUrls: ['./users-mobile.component.css']
})
export class UsersMobileComponent extends DeviceInfo implements OnInit {

  usersArray: UserI[];
  fetchUsersFlag = false;
  users: Observable<UserI[]>;

  constructor(private readonly _userDatabase: UserDatabaseService,
              private readonly _formBuilder: FormBuilder,
              private readonly _infoMessage: InfoMessageService,
              private readonly _dialog: MatDialog) {
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
    this._userDatabase.getAllUser({size: 100, skip: 0}).then(data => {
      this.usersArray = JSON.parse(JSON.stringify(data));
      this.users = of(this.usersArray);
      this.fetchUsersFlag = false;
    }).catch(reason => {
      console.log(reason);
      this.users = of([]);
      this.fetchUsersFlag = false;
    });
  }

  deleteUser(element: any) {
    this._dialog.open(DialogUserDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.usersArray = this.usersArray.filter(value => value.objectId !== element.objectId);
        this.users = of(this.usersArray);
        this._infoMessage.showMobileInfoMessage('User deleted', 3000);
      } else {
        this._infoMessage.showMobileInfoMessage('User not deleted', 3000);
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

  updateUser(user: { objectId: string, value: string, field: string }) {
    // this.snack.open('Update in progress..', 'Ok');
    // this.userDatabase.updateUser(user).then(data => {
    //   const editedObjectIndex = this.usersArray.findIndex(value => value.objectId === data.objectId);
    //   this.usersArray = this.usersArray.filter(value => value.objectId !== user.objectId);
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
    this._dialog.open(DialogUserNewComponent, {
      closeOnNavigation: true,
      hasBackdrop: true,
      maxWidth: '400px',
      minWidth: '80%'
    }).afterClosed().subscribe(value => {
      if (value) {
        this.usersArray.push(value);
        this.users = of(this.usersArray);
      }
    });
  }

  updatePassword(element: any) {
    this._dialog.open(UpdateUserPasswordDialogComponent, {
      data: element
    });
  }
}
