import {CashSaleI} from './CashSale';

export interface BatchI {
  method: string;
  path: string;
  body: CashSaleI;
}
