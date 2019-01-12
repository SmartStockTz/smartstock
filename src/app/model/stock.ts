export interface Stock {
  id?: string;
  objectId?: string;
  product: string;
  unit: string;
  category: string;
  shelf: string;
  quantity: number;
  wholesaleQuantity: number;
  q_status: string;
  reorder: number;
  purchase: number;
  retailPrice: number;
  wholesalePrice: any;
  profit: number;
  times: number;
  supplier: string;
  expire: string;
  nhifPrice: number;
  retailWholesalePrice: number;
  retail_stockcol: string;

  // id: string;
  // product: string;
  // category: string;
  // profit: number;
  // purchase: number;
  // quantity: number;
  // reorder: number;
  // retailPrice: number;
  // retailWholesalePrice: number;
  // shelf: string;
  // supplier: string;
  // unit: string;
  // wholesaleQuantity: number;
  // wholesalePrice: number;
  // nhifPrice: number;
}
