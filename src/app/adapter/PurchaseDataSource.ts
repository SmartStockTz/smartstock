import {PurchaseModel} from '../modules/purchase/models/purchase.model';
import {ReceiptModel} from '../modules/purchase/models/receipt.model';

export interface PurchaseDataSource {
  recordPayment(objectId: string): Promise<any>;

  addPurchase(purchase: PurchaseModel, callback: (value: any) => void);

  addAllPurchase(purchases: PurchaseModel[], callback: (value: any) => void);

  getPurchase(id: string, callback: (purchase: PurchaseModel) => void);

  getAllPurchase(pagination: { size?: number, skip?: number }): Promise<PurchaseModel[]>;

  updatePurchase(id: string, callback: (value: any) => void);

  deletePurchase(id: string, callback: (value: any) => void);

  getInvoice(id: string, callback: (invoice: ReceiptModel) => void);

  getAllInvoice(callback: (invoices: ReceiptModel[]) => void);

  addInvoice(invoice: ReceiptModel, callback: (value: any) => void);

  addAllInvoices(invoices: ReceiptModel[], callback: (value: any) => void);

  deleteInvoice(id: string, callback: (value: any) => void);

  getReceipt(id: string, callback: (invoice: ReceiptModel) => void);

  getAllReceipts(callback: (invoices: ReceiptModel[]) => void);

  addReceipt(invoice: ReceiptModel, callback: (value: any) => void);

  addAllReceipts(invoices: ReceiptModel[], callback: (value: any) => void);

  deleteReceipts(id: string, callback: (value: any) => void);
}
