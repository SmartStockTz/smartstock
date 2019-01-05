import {CashSaleI} from '../../model/CashSale';
import {DatabaseCallback} from '../DatabaseCallback';

export interface SalesDatasource {
  addCashSale(sale: CashSaleI, callback?: DatabaseCallback);

  getCashSale(id: string, callback?: DatabaseCallback);

  getAllCashSale(callback?: DatabaseCallback);

  updateCashSale(sale: CashSaleI, callback?: DatabaseCallback);

  deleteCashSale(sale: CashSaleI, callback?: DatabaseCallback);
}
