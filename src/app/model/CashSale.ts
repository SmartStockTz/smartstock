import {StockModel} from '../modules/stocks/models/stock.model';

export interface SalesModel {
  objectId?: string;
  idTra?: string;
  date: string;
  product: string;
  category: string;
  unit: string;
  quantity: number;
  amount: number;
  customer?: string;
  cartId?: string; // for retrieve sold items per cart/order
  discount: number;
  user: string;
  channel: string;
  stock: StockModel;
  batch?: string; // for offline sync
  stockId: string;
}
