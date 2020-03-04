export interface SellerReportAdapter {
  getTotalSaleOfUserByDate(date: string): Promise<{ total: number }[]>;

  getTotalCostOfGoodSoldOfUserByDate(date: string): Promise<{ total: number }[]>;

  getSalesTrendByUserAndDates(from: string, to: string): Promise<any>;

  getSoldProductsByDate(date: string): Promise<any>;
}
