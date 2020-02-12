import {PurchaseI} from '../model/PurchaseI';
import {ReceiptI} from '../model/ReceiptI';

export interface PurchaseDataSource {
  recordPayment(objectId: string): Promise<any>;

  addPurchase(purchase: PurchaseI, callback: (value: any) => void);

  addAllPurchase(purchases: PurchaseI[], callback: (value: any) => void);

  getPurchase(id: string, callback: (purchase: PurchaseI) => void);

  getAllPurchase(pagination: { size?: number, skip?: number }): Promise<PurchaseI[]>;

  updatePurchase(id: string, callback: (value: any) => void);

  deletePurchase(id: string, callback: (value: any) => void);

  getInvoice(id: string, callback: (invoice: ReceiptI) => void);

  getAllInvoice(callback: (invoices: ReceiptI[]) => void);

  addInvoice(invoice: ReceiptI, callback: (value: any) => void);

  addAllInvoices(invoices: ReceiptI[], callback: (value: any) => void);

  deleteInvoice(id: string, callback: (value: any) => void);

  getReceipt(id: string, callback: (invoice: ReceiptI) => void);

  getAllReceipts(callback: (invoices: ReceiptI[]) => void);

  addReceipt(invoice: ReceiptI, callback: (value: any) => void);

  addAllReceipts(invoices: ReceiptI[], callback: (value: any) => void);

  deleteReceipts(id: string, callback: (value: any) => void);
}
