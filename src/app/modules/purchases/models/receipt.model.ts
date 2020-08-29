export interface ReceiptModel {
  date: string;
  reference: string;
  idOld: string;
  id?: string;
  type: string;
  paid: boolean;
  due: string;
}
