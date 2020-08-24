import {SalesModel} from './sale.model';

export interface BatchModel {
  method: string;
  path: string;
  body: SalesModel;
}
