export interface AdminReportAdapter {
  getTotalSale(beginDate: Date, endDate: Date): Promise<number>;

  getTotalCostOfGoodSold(beginDate: Date, endDate: Date): Promise<{ total: number }[]>;

  getSalesTrend(beginDate: Date, endDate: Date): Promise<any>;

  getFrequentlySoldProducts(beginDate: Date, endDate: Date): Promise<any>;
}
