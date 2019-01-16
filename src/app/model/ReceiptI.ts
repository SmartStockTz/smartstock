export interface ReceiptI {
  date: string;
  reference: string;
  idOld: string;
  objectId?: string;
  type: string;
  paid: boolean;
  due: string;
}
