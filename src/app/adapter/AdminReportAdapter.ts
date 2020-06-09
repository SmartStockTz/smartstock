import {Stock} from '../model/stock';

export interface AdminReportAdapter {
  getTotalSaleByDate(date: string): Promise<{ total: number }[]>;

  getTotalCostOfGoodSoldByDate(date: string): Promise<{ total: number }[]>;

  getSalesTrendByDates(from: string, to: string): Promise<any>;

  getFrequentlySoldProductsByDate(date: string): Promise<any>;

  getExpiredProducts(date: Date,  skip: number, size: number ): Promise<Stock[]>;
}
