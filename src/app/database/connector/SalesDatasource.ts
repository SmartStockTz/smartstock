import {CashSaleI} from '../../model/CashSale';
import {DatabaseCallback} from '../DatabaseCallback';

export interface SalesDatasource {
  addCashSale(sale: CashSaleI[], callback?: DatabaseCallback);

  getCashSale(id: string, callback?: DatabaseCallback);

  getAllCashSale(callback?: DatabaseCallback);

  getAllCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void, callback?: DatabaseCallback);

  updateCashSale(sale: CashSaleI, callback?: DatabaseCallback);

  deleteCashSale(sale: CashSaleI, callback?: DatabaseCallback);

  getAllWholeCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void, callback?: DatabaseCallback);

  addWholeCashSale(sale: CashSaleI[], callback?: DatabaseCallback);
}
