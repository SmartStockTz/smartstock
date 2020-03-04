import {Stock} from '../model/stock';
import {CategoryI} from '../model/CategoryI';
import {SupplierI} from '../model/SupplierI';
import {UnitsI} from '../model/UnitsI';
import {PurchaseI} from '../model/PurchaseI';

export interface StockDataSource {
  getStock(id: string, callback: (stock: Stock) => void);

  getAllStock(callback: (stocks: Stock[]) => void);

  deleteStock(stock: Stock, callback?: (value: any) => void);

  deleteAllStock(stocks: Stock[], callback?: (value: any) => void);

  addStock(stock: Stock): Promise<Stock>;

  addAllStock(stocks: Stock[], callback: (value: any) => void);

  updateStock(stock: Stock): Promise<Stock>;

  updateAllStock(stocks: Stock[], callback?: (value: any) => void);

  getCategory(id: string, callback: (category: CategoryI) => void);

  getAllCategory(pagination: { size?: number, skip?: number }): Promise<CategoryI[]>;

  addCategory(category: CategoryI): Promise<any>;

  addAllCategory(categories: CategoryI[], callback?: (value: any) => void);

  updateCategory(category: any): Promise<any>;

  updateAllCategory(categories: CategoryI[], callback?: (value: any) => void);

  deleteCategory(category: CategoryI): Promise<any>;

  deleteAllCategory(categories: CategoryI[], callback: (value: any) => void);

  addSupplier(supplier: SupplierI, callback: (value: any) => void);

  addAllSupplier(suppliers: SupplierI[], callback: (value: any) => void);

  getSupplier(id: string, callback: (supplier: SupplierI) => void);

  getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierI[]>;

  updateSupplier(data: {objectId: string, field: string, value: string}): Promise<any>;

  updateUnit(unit: { objectId: string; value: string; field: string }): Promise<any>;

  addPurchase(purchaseI: PurchaseI): Promise<any>;

  updateAllSupplier(callback?: (value: any) => void);

  deleteSupplier(objectId: string): Promise<any>;

  deleteAllSupplier(suppliers: SupplierI[], callback?: (value: any) => void);

  addUnit(unit: UnitsI): Promise<any>;

  getAllUnit(pagination: { size?: number, skip?: number }): Promise<UnitsI[]>;

}
