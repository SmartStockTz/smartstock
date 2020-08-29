export interface PaymentModel {
  date: any;
  receipt: string;
  amount: number;
  id: string;
}

export interface InvoiceModel {
  amount: number;
  date: string;
  name: string;
}
