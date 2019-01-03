import {Stock} from '../../model/stock';

export interface StockDataSource {
  getStock(id: string): Stock;

  getAllStock(callback?: Function): Stock[];

  deleteStock(id: string, callback?: Function);

  addStock(stock: Stock, callback?: Function);
}
