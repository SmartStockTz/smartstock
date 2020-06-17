export interface BillingAdapter {
  getDueBalance(currency: 'TZS' | 'USD'): Promise<number>;

  getUnInvoicesBalance(currency: 'TZS' | 'USD'): Promise<number>;
}

export interface ShopModel {
  businessName: string;
  applicationId: string;
  projectId: string;
}
