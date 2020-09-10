export interface OrderModel {
  paid?: boolean;
  displayName?: string;
  id?: string;
  total?: number;
  mobile?: number;
  date?: string;
  carts?: any[];
  user?: any;
  status?: 'PROCESSED' | 'DELIVERED';
  complete?: boolean;
}
