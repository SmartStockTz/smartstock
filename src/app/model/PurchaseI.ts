import {Stock} from './stock';
import {SupplierI} from './SupplierI';

export interface PurchaseI {
  objectId?: string;
  createdAt?: any;
  updatedAt?: any;
  date: any;
  due: any;
  refNumber: string;
  amount: number;
  paid: boolean;
  draft?: boolean;
  supplier: SupplierI;
  type: 'invoice' | 'receipt';
  items: {
    product: Stock,
    amount: number,
    purchase: number,
    quantity: number
  }[];
}
