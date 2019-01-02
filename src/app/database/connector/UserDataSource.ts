import {UserI} from '../../model/UserI';
import {DatabaseCallback} from '../DatabaseCallback';

export interface UserDataSource {
  login(user: UserI, callback: DatabaseCallback);

  register(user: UserI, callback: DatabaseCallback);

  resetPassword(user: UserI, callback: DatabaseCallback);

  getAllUser(callback: DatabaseCallback);

  getUser(user: UserI, callback);

  deleteUser(user: UserI, callback: DatabaseCallback);

  updateUser(user: UserI, callback: DatabaseCallback);

  createUser(user: UserI, callback: DatabaseCallback);
}
