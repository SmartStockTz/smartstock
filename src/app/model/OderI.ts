import {CartI} from './cart';

export interface OrderI {
  idOld: string;
  objectId?: string;
  amount: number;
  customer: string;
  date: string;
  cart: CartI[];
  complete: boolean;
}
