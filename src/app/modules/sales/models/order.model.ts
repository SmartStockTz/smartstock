import {CartModel} from './cart.model';

export interface OrderModel {
  id?: string;
  amount: number;
  customer: any;
  date: string;
  cart: CartModel[];
  status: 'pending' | 'processed' | 'delivered';
  complete: boolean;
}
