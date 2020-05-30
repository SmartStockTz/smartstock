import {Stock} from './stock';

export interface CartModel {
  product: string;
  quantity: number;
  amount: number;
  discount?: number;
  stock: Stock;
}
