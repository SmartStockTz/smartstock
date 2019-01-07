export interface PurchaseI {
  id: string;
  date: string;
  due: string;
  receipt: string;
  product: string;
  quantity: number;
  purchase: number;
  amount: number;
  paid: true;
  channel: string;
}
