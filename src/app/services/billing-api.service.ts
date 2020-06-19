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

  async getDueBalance(currency: 'TZS' | 'USD'): Promise<any> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`http://localhost:3000/billing/${owner.objectId}/dueBilling`).get();
  }

  async getUnInvoicesBalance(currency: 'TZS' | 'USD'): Promise<any> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`http://localhost:3000/billing/${owner.objectId}/unInvoicedBalance`).get();
  }
}
