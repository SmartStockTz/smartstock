import {SalesModel} from './CashSale';

export interface BatchModel {
  method: string;
  path: string;
  body: SalesModel;
}
