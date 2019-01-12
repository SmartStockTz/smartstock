import {Stock} from '../../model/stock';
import {CategoryI} from '../../model/CategoryI';
import {SupplierI} from '../../model/SupplierI';
import {UnitsI} from '../../model/UnitsI';

export interface StockDataSource {
  getStock(id: string, callback: (stock: Stock) => void);

  getAllStock(callback: (stocks: Stock[]) => void);

  deleteStock(stock: Stock, callback?: (value: any) => void);

  deleteAllStock(stocks: Stock[], callback?: (value: any) => void);

  addStock(stock: Stock, callback?: (value: any) => void);

  addAllStock(stocks: Stock[], callback: (value: any) => void);

  updateStock(stock: Stock, callback?: (value: any) => void);

  updateAllStock(stocks: Stock[], callback?: (value: any) => void);

  getCategory(id: string, callback: (category: CategoryI) => void);

  getAllCategory(callback: (categories: CategoryI[]) => void);

  addCategory(category: CategoryI, callback?: (value: any) => void);

  addAllCategory(categories: CategoryI[], callback?: (value: any) => void);

  updateCategory(category: CategoryI, callback?: (value: any) => void);

  updateAllCategory(categories: CategoryI[], callback?: (value: any) => void);

  deleteCategory(category: CategoryI, callback?: (value: any) => void);

  deleteAllCategory(categories: CategoryI[], callback: (value: any) => void);

  addSupplier(supplier: SupplierI, callback: (value: any) => void);

  addAllSupplier(suppliers: SupplierI[], callback: (value: any) => void);

  getSupplier(id: string, callback: (supplier: SupplierI) => void);

  getAllSupplier(callback: (suppliers: SupplierI[]) => void);

  updateSupplier(id: string, callback?: (value: any) => void);

  updateAllSupplier(callback?: (value: any) => void);

  deleteSupplier(supplier: SupplierI, callback?: (value: any) => void);

  deleteAllSupplier(suppliers: SupplierI[], callback?: (value: any) => void);

  addUnit(unit: UnitsI, callback?: (value: any) => void);

  getAllUnit(callback: (value: UnitsI[]) => void);

}
