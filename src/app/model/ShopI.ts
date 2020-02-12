export interface ShopI {
  businessName: string;
  applicationId: string;
  projectId: string;
  projectUrlId: string;
  category: string;
  settings: {
    saleWithoutPrinter: boolean,
    printerFooter: string,
    printerHeader: string
  };
}
