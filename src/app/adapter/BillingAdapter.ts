export interface BillingAdapter {
  getDueBalance(currency: 'TZS' | 'USD'): Promise<any>;

  getUnInvoicesBalance(currency: 'TZS' | 'USD'): Promise<any>;
}

export interface ShopModel {
  businessName: string;
  applicationId: string;
  projectId: string;
}
