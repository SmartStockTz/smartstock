export interface OrderModel {
  displayName?: string;
  id?: string;
  total: number;
  mobile: number;
  date: string;
  cart: any[];
  user?: any;
  status: 'pending' | 'processed' | 'delivered';
  complete: boolean;
}
