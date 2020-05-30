import {CartModel} from './cart';

export interface OrderModel {
  objectId?: string;
  amount: number;
  customer: any;
  date: string;
  cart: CartModel[];
  status: 'pending' | 'processed' | 'delivered';
  complete: boolean;
}
