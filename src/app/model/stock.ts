export interface Stock {
  idOld?: string;
  createdAt?: any;
  updatedAt?: any;
  image?: any;
  objectId?: string;
  _id?: string;
  product: string;
  active?: boolean | true;
  canExpire?: boolean | true;
  description?: string;
  unit: string;
  category: string;
  shelf?: string;
  quantity: number;
  wholesaleQuantity: number;
  q_status?: string;
  reorder: number;
  purchase: number;
  retailPrice: number;
  wholesalePrice: any;
  profit?: number;
  times?: number;
  supplier: string;
  expire: string;
  nhifPrice?: number;
  retailWholesalePrice?: number;
  retail_stockcol?: string;
}
