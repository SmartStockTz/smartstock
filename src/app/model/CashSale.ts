import {Stock} from './stock';

export interface CashSaleI {
  idOld: string;
  objectId?: string;
  idTra: string;
  date: string;
  product: string;
  category: string;
  unit: string;
  quantity: number;
  amount: number;
  discount: number;
  user: string;
  channel: string;
  stock: Stock,
  stockId: string;
}
