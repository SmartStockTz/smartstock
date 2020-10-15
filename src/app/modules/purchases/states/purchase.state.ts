import {Injectable} from '@angular/core';
import {PurchaseModel} from '../models/purchase.model';
import {HttpClient} from '@angular/common/http';
import {ReceiptModel} from '../models/receipt.model';
import {SettingsService} from '../../account/services/settings.service';
import {BFast} from 'bfastjs';
import {StorageService} from '@smartstock/core-libs';
import {SupplierModel} from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseState {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _storage: StorageService,
              private readonly _settings: SettingsService) {
  }

  async recordPayment(id: string): Promise<any> {
    const activeShop = await this._storage.getActiveShop();
    return BFast.database(activeShop.projectId).collection('purchases')
      .query()
      .byId(id)
      .updateBuilder()
      .set('paid', true)
      .update();
  }

  addAllInvoices(invoices: ReceiptModel[], callback: (value: any) => void) {
  }

  addAllPurchase(purchases: PurchaseModel[], callback: (value: any) => void) {
  }

  addAllReceipts(invoices: ReceiptModel[], callback: (value: any) => void) {
  }

  addInvoice(invoice: ReceiptModel, callback: (value: any) => void) {
    // this.addReceipt(invoice, callback);
  }

  async addPurchase(purchaseI: PurchaseModel): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.functions().request(
      this._settings.ssmFunctionsURL + '/functions/purchases/' + shop.projectId)
      .post(purchaseI, {
        headers: this._settings.ssmFunctionsHeader
      });
  }

  addReceipt(invoice: ReceiptModel, callback: (value: any) => void) {
  }

  deleteInvoice(id: string, callback: (value: any) => void) {
  }

  deleteReceipts(id: string, callback: (value: any) => void) {
  }

  getAllInvoice(callback: (invoices: ReceiptModel[]) => void) {
  }

  async deletePurchase(purchase: PurchaseModel): Promise<PurchaseModel> {
    const activeShop = await this._storage.getActiveShop();
    return BFast.database(activeShop.projectId).collection('purchase')
      .query()
      .byId(purchase.id)
      .delete();
  }

  async getAllPurchase(page: { size?: number, skip?: number }): Promise<PurchaseModel[]> {
    const activeShop = await this._storage.getActiveShop();
    return BFast.database(activeShop.projectId).collection('purchases')
      .query()
      .orderBy('_created_at', -1)
      .size(page.size)
      .skip(page.skip)
      .find();
  }

  // must be updated and its socket method
  getAllReceipts(callback: (invoices: ReceiptModel[]) => void) {
    // const query = new Parse.Query('purchaseRefs');
    // const subscription = query.subscribe();
    // subscription.on('open', () => {
    //   console.log('purchase refs socket connected');
    //   this.updateCachedPurchaseRefs();
    // });
    // subscription.on('update', value => {
    //   this.updateCachedPurchaseRefs();
    // });
    // subscription.on('delete', value => {
    //   this.updateCachedPurchaseRefs();
    // });
    // subscription.on('create', value => {
    //   this.updateCachedPurchaseRefs();
    // });
    callback(null);
  }

  getInvoice(id: string, callback: (invoice: ReceiptModel) => void) {
  }

  getPurchase(id: string, callback: (purchase: PurchaseModel) => void) {
  }

  async getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierModel[]> {
    const shop = await this._storage.getActiveShop();
    const suppliers: SupplierModel[] = await BFast.database(shop.projectId).collection<SupplierModel>('suppliers').getAll<SupplierModel>();
    suppliers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return suppliers;
  }

  getReceipt(id: string, callback: (invoice: ReceiptModel) => void) {
  }

  updatePurchase(id: string, callback: (value: any) => void) {
  }
}
