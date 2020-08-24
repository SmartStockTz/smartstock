import {Pipe, PipeTransform} from '@angular/core';
import {ShopModel} from '../../account/models/shop.model';
import {UserDatabaseService} from '../../account/services/user-database.service';

@Pipe({
  name: 'shopsPipe'
})
export class ShopsPipe implements PipeTransform {

  constructor(private readonly userApi: UserDatabaseService) {
  }

  async transform(shops: ShopModel[], ...args: unknown[]): Promise<string[]> {
    try {
      const shop = await this.userApi.getCurrentShop();
      shops.push(shop);
      return shops.map(value => value.businessName);
    } catch (e) {
      return [];
    }
  }

}
