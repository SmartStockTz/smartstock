import {Injectable} from '@angular/core';
import {SalesDatasource} from '../adapter/SalesDatasource';
import {CashSaleI} from '../model/CashSale';
import {OrderI} from '../model/OderI';
import {NgForage} from 'ngforage';
import {CartI} from '../model/cart';
import {BatchI} from '../model/batchI';
import {randomString} from '../adapter/ParseBackend';
import {ShopI} from '../model/ShopI';

@Injectable({
  providedIn: 'root'
})
export class SalesDatabaseService implements SalesDatasource {

  constructor(private indexDb: NgForage) {
  }

  addAllCashSale(sales: CashSaleI[]): Promise<any> {
    // console.log(sales);
    return new Promise<any>(async (resolve, reject) => {
      try {
        const batchs: BatchI[] = [];
        sales.forEach(value => {
          batchs.push({
            method: 'POST',
            body: value,
            path: '/classes/sales'
          });
        });
        const activeShop = await this.indexDb.getItem<ShopI>('activeShop');
        this.indexDb
          .clone({name: activeShop.projectId + '_sales'})
          .setItem<BatchI[]>(randomString(12), batchs).then(_ => {
          resolve('Ok');
        }).catch(reason => {
          console.log(reason);
          reject(null);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  addWholeCashSale(sale: CashSaleI[]): Promise<any> {
    return this.addAllCashSale(sale);
  }

  deleteCashSale(sale: CashSaleI, callback: (value: any) => void) {
  }

  getAllCashSale(callback: (sales: CashSaleI[]) => void) {
  }

  getCashSale(id: string, callback: (sale: CashSaleI) => void) {
  }

  updateCashSale(sale: CashSaleI, callback: (value: any) => void) {
  }

  getAllCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void) {
  }

  private getSales(id: string, res: any) {
  }

  private getWholeSale(id: string, res: any) {
  }

  getAllWholeCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void) {
  }

  addOrder(order: OrderI, callback?: (value) => void) {
  }

  addOrders(orders: OrderI[], callback?: (value) => void) {
  }

  deleteOrder(order: OrderI, callback?: (value) => void) {
  }

  getAllOrders(callback: (orders: OrderI[]) => void) {
  }

  private getOrders(res: any) {
  }

  getOrder(id: string, callback: (order: OrderI) => void) {
  }

  updateOrder(order: OrderI, callback?: (value) => void) {
  }

  addCashSale(sale: CashSaleI, callback: (value: any) => void) {
  }

  addCashSaleToCache(sales: CartI[], callback: (value: any) => void) {
    callback('Ok');
  }
}
