import {Pipe, PipeTransform} from '@angular/core';
import {ShopI} from '../../../model/ShopI';
import {UserDatabaseService} from '../../../services/user-database.service';

@Pipe({
  name: 'shopsPipe'
})
export class ShopsPipe implements PipeTransform {

  constructor(private readonly userApi: UserDatabaseService) {
  }

  async transform(shops: ShopI[], ...args: unknown[]): Promise<string[]> {
    try {
      const shop = await this.userApi.getCurrentShop();
      shops.push(shop);
      return shops.map(value => value.businessName);
    } catch (e) {
      return [];
    }
  }

}
