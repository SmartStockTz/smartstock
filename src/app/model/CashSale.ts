import {Stock} from './stock';

export interface CashSaleI {
  objectId?: string;
  idTra?: string;
  date: string;
  product: string;
  category: string;
  unit: string;
  quantity: number;
  amount: number;
  syncId?: string;
  discount: number;
  user: string;
  channel: string;
  stock: Stock;
  batch: string;
  stockId: string;
}
