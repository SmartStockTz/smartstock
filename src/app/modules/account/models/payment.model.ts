export interface PaymentModel {
  date: any;
  receipt: string;
  amount: number;
  objectId: string;
}

export interface InvoiceModel {
  amount: number;
  date: string;
  name: string;
}
