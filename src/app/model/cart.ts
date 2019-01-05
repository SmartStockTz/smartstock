import {Stock} from './stock';

export interface CartI {
  product: string;
  quantity: number;
  amount: number;
  discount: number;
  stock: Stock;
}
