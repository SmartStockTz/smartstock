export interface OrderModel {
  paid?: boolean;
  displayName?: string;
  id?: string;
  total?: number;
  mobile?: number;
  date?: string;
  carts?: {quantity: number, product: any}[];
  user?: any;
  status?: 'PROCESSED' | 'DELIVERED' | "COMPLETED";
  complete?: boolean;
}
