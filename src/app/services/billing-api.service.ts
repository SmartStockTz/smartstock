import {Injectable} from '@angular/core';
import {BillingAdapter} from '../adapter/BillingAdapter';
import {BFast} from 'bfastjs';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class BillingApiService implements BillingAdapter {

  constructor(private readonly storage: StorageService) {
  }

  async getDueBalance(currency: 'TZS' | 'USD'): Promise<number> {
    const shop = await this.storage.getActiveShop();
    return BFast.functions().request('http://localhost:3000/billing/dueBilling').post<number>({
      applicationId: shop.applicationId,
      projectId: shop.projectId,
      businessName: shop.businessName
    });
  }

  async getUnInvoicesBalance(currency: 'TZS' | 'USD'): Promise<number> {
    const shop = await this.storage.getActiveShop();
    return BFast.functions().request('http://localhost:3000/billing/unInvoicedBalance').post({
      applicationId: shop.applicationId,
      projectId: shop.projectId,
      businessName: shop.businessName
    });
  }
}
