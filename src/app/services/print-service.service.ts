import {Injectable} from '@angular/core';
import {OrderI} from '../model/OderI';
import {CartI} from '../model/cart';
import {HttpClient} from '@angular/common/http';
import {SsmSettingsServiceService} from './ssm-settings-service.service';

@Injectable({
  providedIn: 'root'
})
export class PrintServiceService {
  url: string;

  constructor(private ssmSettings: SsmSettingsServiceService, private httpC: HttpClient) {
  }

  printOrder(order: OrderI, callback: (value: any) => void) {
    let data = '';
    let tT = 0;
    order.cart.forEach((value, index) => {
      tT += <number>value.amount;
      data = data.concat('-----------------------------------\n' +
        (index + 1) + '.  ' + value.product + '\n' +
        '       Quantity : ' + (value.quantity / value.stock.wholesalePrice) + '\n' +
        '       Unit Price : ' + value.stock.wholesalePrice + '\n' +
        '       Amount   : ' + value.amount + ' \n');
    });
    data = data.concat('\n---------------------------------------\n| Total Bill : ' + tT + '\n---------------------------------------');
    this.ssmSettings.getPrinterAddress(value1 => {
      if (value1 === null) {
        this.url = 'http://localhost:8080/print';
      } else {
        this.url = value1.ip;
      }
      this.httpC.get(this.url, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          data: data,
          id: order.objectId
        }
      }).subscribe(value => {
        callback(value);
      }, error1 => {
        console.log(error1);
        callback(null);
      });
    });
  }

  printCart(carts: CartI[], callback: (value: any) => void) {
    let data = '';
    let tT = 0;
    carts.forEach((value, index) => {
      tT += <number>value.amount;
      data = data.concat('-----------------------------------\n' +
        (index + 1) + '.  ' + value.product + '\n' +
        '       Quantity : ' + (value.quantity / value.stock.wholesaleQuantity) + ' \n' +
        '       Unit Price : ' + value.stock.wholesalePrice + '\n' +
        '       Total Amount   : ' + value.amount + ' \n');
    });
    data = data.concat('\n---------------------------------------\n| Total Bill : ' + tT + '\n---------------------------------------');
    this.ssmSettings.getPrinterAddress(value1 => {
      if (value1 === null) {
        this.url = 'http://localhost:8080/print';
      } else {
        this.url = value1.ip;
      }
      this.httpC.get(this.url, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          data: data,
          id: 'test id'
        }
      }).subscribe(value => {
        callback(value);
      }, error1 => {
        console.log(error1);
        callback(null);
      });
    });
  }

  saveOrderToFile(order: OrderI, callback: (value: any) => void) {

  }

  saveCartToFile(cart: CartI[], callback: (value: any) => void) {

  }

}
