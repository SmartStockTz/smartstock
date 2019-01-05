import {CartI} from './cart';

export interface OrderI {
  id: string;
  amount: number;
  customer: string;
  date: string;
  cart: CartI[];
  complete: boolean;
}
