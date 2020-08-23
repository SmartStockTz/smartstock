import {Injectable} from '@angular/core';
import {BFast} from 'bfastjs';
import {StorageService} from '../../lib/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class BillingApiService {

  constructor(private readonly storage: StorageService) {
  }

  async getDueBalance(currency: 'TZS' | 'USD'): Promise<any> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`/billing/${owner.objectId}/dueBilling`).get();
  }

  async getUnInvoicesBalance(currency: 'TZS' | 'USD'): Promise<any> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`/billing/${owner.objectId}/unInvoicedBalance`).get();
  }

  async getPaymentReference(): Promise<any> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`/billing/${owner.objectId}/referenceNumber`).get();
  }

  async getInvoices(): Promise<{ businessName: string, invoice: { _id: string, amount: number, accountId: string }[] }[]> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`/billing/${owner.objectId}/invoices`).get();
  }

  async getReceipt(): Promise<{ payments: any[] }> {
    const owner = await this.storage.getActiveUser();
    return BFast.functions().request(`/billing/${owner.objectId}/receipts`).get();
  }

}
