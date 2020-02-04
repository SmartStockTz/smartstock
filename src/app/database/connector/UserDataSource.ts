import {UserI} from '../../model/UserI';
import {ShopI} from '../../model/ShopI';

export interface UserDataSource {

  addUser(user: UserI): Promise<UserI>;

  login(user: { username: string, password: string }): Promise<UserI>;

  logout(user: UserI, callback?: (value: any) => void);

  register(user: UserI): Promise<UserI>;

  resetPassword(user: UserI, callback?: (value: any) => void);

  getAllUser(pagination: { size: number, skip: number }): Promise<UserI[]>;

  getUser(user: UserI, callback?: (user: UserI) => void);

  deleteUser(user: UserI): Promise<any>;

  updateUser(user: { objectId: string, value: string, field: string }, callback?: (value: any) => void);

  createUser(user: UserI, callback?: (value: any) => void);

  refreshToken(user: UserI, callback: (value: any) => void);

  getShops(): Promise<ShopI[]>;

  createShop(data: { admin: UserI, shop: ShopI }): Promise<ShopI>;

  deleteShop(shop: ShopI): Promise<ShopI>;

  getCurrentShop(): Promise<ShopI>;

  saveCurrentShop(shop: ShopI): Promise<ShopI>;
}
