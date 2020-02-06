export interface AdminReportAdapter {
  getTotalSaleByDate(date: string): Promise<{ total: number }[]>;

  getTotalCostOfGoodSoldByDate(date: string): Promise<{ total: number }[]>;

  getSalesTrendByDates(from: string, to: string): Promise<any>;

  // getSoldProductsByDate(date: string): Promise<any>;
}
