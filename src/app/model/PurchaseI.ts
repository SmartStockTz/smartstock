export interface PurchaseI {
  idOld: string;
  objectId?: string;
  stockId: string;
  date: string;
  due: string;
  reference: string;
  product: string;
  quantity: number;
  purchase: number;
  amount: number;
  paid: boolean;
  channel: string;
  expire: string;
}
