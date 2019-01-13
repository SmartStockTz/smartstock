import {CashSaleI} from '../../model/CashSale';
import {OrderI} from '../../model/OderI';

export interface SalesDatasource {
  addCashSale(sale: CashSaleI, callback: (value: any) => void);

  addAllCashSale(sale: CashSaleI[], callback: (value: any) => void);

  getCashSale(id: string, callback: (sale: CashSaleI) => void);

  getAllCashSale(callback: (sales: CashSaleI[]) => void);

  getAllCashSaleOfUser(id: string, results: (sales: CashSaleI[]) => void);

  updateCashSale(sale: CashSaleI, callback: (value: any) => void);

  deleteCashSale(sale: CashSaleI, callback: (value: any) => void);

  getAllWholeCashSaleOfUser(id: string, results: (sales: CashSaleI[]) => void);

  addWholeCashSale(sale: CashSaleI[], callback: (value: any) => void);

  getOrder(id: string, callback: (order: OrderI) => void);

  getAllOrders(callback: (orders: OrderI[]) => void);

  deleteOrder(order: OrderI, callback: (value: any) => void);

  updateOrder(order: OrderI, callback: (value: any) => void);

  addOrder(order: OrderI, callback: (value: any) => void);

  addOrders(orders: OrderI[], callback: (value: any) => void);
}
