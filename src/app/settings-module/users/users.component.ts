import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger, MatSnackBar, MatTableDataSource} from '@angular/material';
import {UserI} from '../../model/UserI';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDatabaseService} from '../../services/user-database.service';
import {DeviceInfo} from '../../common-components/DeviceInfo';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends DeviceInfo implements OnInit {

  usersDatasource: MatTableDataSource<UserI>;
  usersTableColums = ['name', 'role', 'actions'];
  usersArray: UserI[];
  fetchUsersFlag = false;

  constructor(private readonly userDatabase: UserDatabaseService,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
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
      this.usersDatasource = new MatTableDataSource<UserI>(this.usersArray);
      this.fetchUsersFlag = false;
    }).catch(reason => {
      console.log(reason);
      this.fetchUsersFlag = false;
    });
  }

  deleteUser(element: any) {
    this.dialog.open(DialogUserDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.usersArray = this.usersArray.filter(value => value.objectId !== element.objectId);
        this.usersDatasource = new MatTableDataSource<UserI>(this.usersArray);
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
    this.dialog.open(DialogUserNewComponent, {
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
    this.dialog.open(UpdateUserPasswordDialogComponent, {
      data: element
    });
  }
}

@Component({
  selector: 'app-dialog-user-delete',
  templateUrl: 'app-user-delete.html',
  styleUrls: ['users.component.css']
})
export class DialogUserDeleteComponent {
  deleteProgress = false;
  errorUserMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogUserDeleteComponent>,
    private readonly userDatabase: UserDatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  deleteUser(user: any) {
    this.errorUserMessage = undefined;
    this.deleteProgress = true;
    this.userDatabase.deleteUser(user).then(value => {
      this.dialogRef.close(user);
      this.deleteProgress = false;
      console.log(value);
    }).catch(reason => {
      this.errorUserMessage = reason && reason.message ? reason.message : reason.toString();
      this.deleteProgress = false;
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}


@Component({
  selector: 'app-new-user',
  templateUrl: 'app-new-users.html',
  styleUrls: ['users.component.css'],
})
export class DialogUserNewComponent implements OnInit {
  newUserForm: FormGroup;
  createUserProgress = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly userDatabase: UserDatabaseService,
    public dialogRef: MatDialogRef<DialogUserDeleteComponent>) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm() {
    this.newUserForm = this.formBuilder.group({
      username: ['', [Validators.nullValidator, Validators.required]],
      password: ['', [Validators.nullValidator, Validators.required]],
      role: ['user', [Validators.nullValidator, Validators.required]],
    });
  }

  createUser() {
    if (!this.newUserForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.createUserProgress = true;
    this.userDatabase.addUser(this.newUserForm.value).then(value => {
      this.createUserProgress = false;
      value.username = this.newUserForm.value.username;
      value.role = this.newUserForm.value.role;
      this.dialogRef.close(value);
      this.snack.open('User created', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      console.log(reason);
      this.createUserProgress = false;
      this.snack.open(reason && reason.error && reason.error.message ? reason.error.message : 'User not created, try again', 'Ok', {
        duration: 3000
      });
    });
  }

  cancel($event: Event) {
    $event.preventDefault();
    this.dialogRef.close(null);
  }
}

@Component({
  selector: 'app-user-update-password',
  templateUrl: 'app-user-update-password.html',
  styleUrls: ['users.component.css']
})
export class UpdateUserPasswordDialogComponent implements OnInit {
  updatePasswordFormGroup: FormGroup;
  updateProgress = false;

  constructor(public dialogRef: MatDialogRef<UpdateUserPasswordDialogComponent>,
              private readonly _formBuilder: FormBuilder,
              private readonly _snack: MatSnackBar,
              private readonly _userApi: UserDatabaseService,
              @Inject(MAT_DIALOG_DATA) public data: UserI) {
  }

  ngOnInit(): void {
    this.updatePasswordFormGroup = this._formBuilder.group({
      password: ['', [Validators.required, Validators.nullValidator]]
    });
  }


  updatePassword() {
    if (this.updatePasswordFormGroup.valid) {
      this.updateProgress = true;
      this._userApi.updatePassword(this.data, this.updatePasswordFormGroup.value.password).then(value => {
        this._snack.open('Password updated successful', 'Ok', {
          duration: 3000
        });
        this.updateProgress = false;
        this.dialogRef.close();
      }).catch(reason => {
        console.log(reason);
        this._snack.open('Failure when try to update password, try again', 'Ok', {
          duration: 3000
        });
        this.updateProgress = false;
      });
    } else {
      this._snack.open('Please enter new password', 'Ok', {
        duration: 3000
      });
    }
  }
}
