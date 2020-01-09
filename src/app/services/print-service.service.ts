import {Injectable} from '@angular/core';
import {OrderI} from '../model/OderI';
import {CartI} from '../model/cart';
import {HttpClient} from '@angular/common/http';
import {SettingsServiceService} from './Settings-service.service';
import {environment} from '../../environments/environment';
import {randomString} from '../database/ParseBackend';

@Injectable({
  providedIn: 'root',
})
export class PrintServiceService {
  url: string;

  constructor(private ssmSettings: SettingsServiceService,
              private httpClient: HttpClient) {
  }

  printOrder(order: OrderI, callback: (value: any) => void) {
    let data = '\t' + new Date().toString() + '\n';
    data = data.concat('**************************\n');
    data = data.concat('To ---> ' + order.customer + '\n*************************\n');
    let tT = 0;
    order.cart.forEach((value, index) => {
      tT += <number>value.amount;
      data = data.concat('-----------------------------------\n' +
        (index + 1) + '.  ' + value.product + '\t' +
        'Quantity --> ' + (value.quantity / value.stock.wholesalePrice) + '\t' +
        'Unit Price --> ' + value.stock.wholesalePrice + '\t' +
        'Amount   --> ' + value.amount + ' \n');
    });
    data = data.concat('\n**********\n| Total Bill : ' + tT + '\n**********');
    this.ssmSettings.getPrinterAddress(value1 => {
      if (value1 === null) {
        this.url = `${environment.printerUrl}/print`;
      } else {
        this.url = value1.ip;
      }
      this.httpClient.post(this.url, {
        data: data,
        id: order.objectId
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          // data: data,
          // id: order.objectId
        }
      }).subscribe(_ => {
        callback('Ok');
      }, _ => {
        console.log('printer fails ');
        callback(null);
      });
    });
  }

  async printCartRetail(carts: CartI[], customer: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const cSettings = await this.ssmSettings.getSettings();
      let data = new Date().toString() + '\n';
      data = data.concat(cSettings.printerHeader + '\n');
      let tT = 0;
      carts.forEach((value, index) => {
        tT += <number>value.amount;
        data = data.concat('-----------------------------------\n' +
          (index + 1) + '.  ' + value.product + '\n' +
          'Quantity --> ' + (value.quantity) + ' \t' +
          'Price --> ' + value.stock.retailPrice + '\t' +
          'Amount  --> ' + value.amount + ' \t\n');
      });
      data = data.concat('-----------------------------------\n');
      data = data.concat('Total Bill : ' + tT + '\n');

      this.ssmSettings.getPrinterAddress(value1 => {
        // if (value1 === null) {
        this.url = `${environment.printerUrl}/print`;
        // } else {
        //   this.url = value1.ip;
        // }
        this.httpClient.post(this.url, {
          data: data,
          id: randomString(8),
        }, {
          headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }).subscribe(_ => {
          resolve('Ok');
        }, _ => {
          // console.log(_);
          if (_.status === 200) {
            resolve('Ok');
          } else {
            reject(null);
          }
        });
      });
    });
    // try {
    // } catch (reason) {
    //   console.log(reason);
    //   throw {message: 'Fails to print your cart', reason: reason};
    // }
  }

  printCart(carts: CartI[], customer: string, callback: (value: any) => void) {
    let data = '\t' + new Date().toString() + '\n';
    data = data.concat('**************************\n');
    data = data.concat('To ---> ' + customer + '\n*************************\n');
    let tT = 0;
    carts.forEach((value, index) => {
      tT += <number>value.amount;
      data = data.concat('-----------------------------------\n' +
        (index + 1) + '.  ' + value.product + '\n' +
        'Quantity --> ' + (value.quantity / value.stock.wholesaleQuantity) + ' \t' +
        'Unit Price --> ' + value.stock.wholesalePrice + '\t' +
        'Total Amount  --> ' + value.amount + ' \t');
    });
    data = data.concat('\n*************\n| Total Bill : ' + tT + '\n*************');
    this.ssmSettings.getPrinterAddress(value1 => {
      // if (value1 === null) {
      this.url = `${environment.printerUrl}/print`;
      // } else {
      //   this.url = value1.ip;
      // }
      this.httpClient.post(this.url, {
        data: data,
        id: Date.now().toString()
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          // data: data,
          // id: Date.now().toString()
        }
      }).subscribe(_ => {
        callback('Ok');
      }, _ => {
        console.log(_);
        if (_.status === 200) {
          callback('Ok');
        } else {
          callback(null);
        }
      });
    });
  }

}
