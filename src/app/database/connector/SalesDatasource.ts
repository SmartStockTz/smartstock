import {CashSaleI} from '../../model/CashSale';
import {DatabaseCallback} from '../DatabaseCallback';
import {OrderI} from '../../model/OderI';

export interface SalesDatasource {
  addCashSale(sale: CashSaleI[], callback?: DatabaseCallback);

  getCashSale(id: string, callback?: DatabaseCallback);

  getAllCashSale(callback?: DatabaseCallback);

  getAllCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void, callback?: DatabaseCallback);

  updateCashSale(sale: CashSaleI, callback?: DatabaseCallback);

  deleteCashSale(sale: CashSaleI, callback?: DatabaseCallback);

  getAllWholeCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void, callback?: DatabaseCallback);

  addWholeCashSale(sale: CashSaleI[], callback?: DatabaseCallback);

  getOrder(id: string, callback: (order: OrderI) => void);

  getAllOrders(callback: (orders: OrderI[]) => void);

  deleteOrder(order: OrderI, callback?: (value) => void);

  updateOrder(order: OrderI, callback?: (value) => void);

  addOrder(order: OrderI, callback?: (value) => void);

  addOrders(orders: OrderI[], callback?: (value) => void);
}
