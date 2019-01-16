import {UserI} from '../../model/UserI';

export interface UserDataSource {
  login(user: UserI, callback?: (value: UserI) => void);

  logout(user: UserI, callback?: (value: any) => void);

  register(user: UserI, callback?: (value: any) => void);

  resetPassword(user: UserI, callback?: (value: any) => void);

  getAllUser(callback?: (users: UserI[]) => void);

  getUser(user: UserI, callback?: (user: UserI) => void);

  deleteUser(user: UserI, callback?: (value: any) => void);

  updateUser(user: UserI, callback?: (value: any) => void);

  createUser(user: UserI, callback?: (value: any) => void);
}
