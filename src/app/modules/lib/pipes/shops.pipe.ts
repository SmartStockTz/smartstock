import {Pipe, PipeTransform} from '@angular/core';
import {ShopModel} from '../../account/models/shop.model';
import {UserService} from '../../account/services/user.service';

@Pipe({
  name: 'shopsPipe'
})
export class ShopsPipe implements PipeTransform {

  constructor(private readonly userApi: UserService) {
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
