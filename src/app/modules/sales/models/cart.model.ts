import {StockModel} from './stock.model';

export interface CartModel {
  product: string;
  quantity: number;
  amount: number;
  discount?: number;
  stock: StockModel;
}
