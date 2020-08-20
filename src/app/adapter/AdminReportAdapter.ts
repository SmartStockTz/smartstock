import {StockModel} from '../modules/stocks/models/stock.model';

export interface AdminReportAdapter {
  getTotalSale(beginDate: Date, endDate: Date): Promise<number>;

  getTotalCostOfGoodSold(beginDate: Date, endDate: Date): Promise<{ total: number }[]>;

  getSalesTrend(beginDate: string, endDate: string): Promise<any>;

  getFrequentlySoldProducts(beginDate: Date, endDate: Date): Promise<any>;

  getExpiredProducts(date: Date, skip: number, size: number): Promise<StockModel[]>;

  getStockStatus(): Promise<{ x: string, y: number }[]>;
  getStockStatusByCategory(): Promise<{ x: string, y: number }[]>;
}
