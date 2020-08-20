import {StockModel} from './stock.model';
import {SupplierModel} from './supplier.model';

export interface PurchaseModel {
  objectId?: string;
  createdAt?: any;
  updatedAt?: any;
  date: any;
  due: any;
  refNumber: string;
  amount: number;
  paid: boolean;
  draft?: boolean;
  supplier: SupplierModel;
  type: 'invoice' | 'receipt';
  items: {
    product: StockModel,
    amount: number,
    purchase: number,
    quantity: number
  }[];
}
