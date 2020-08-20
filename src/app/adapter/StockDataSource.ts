
import {CategoryI} from '../model/CategoryI';
import {SupplierI} from '../model/SupplierI';
import {UnitsI} from '../model/UnitsI';
import {PurchaseModel} from '../modules/purchase/models/purchase.model';
import {StockModel} from '../modules/stocks/models/stock.model';

export interface StockDataSource {

  // importStocks(): Promise<any>;

  getStock(id: string, callback: (stock: StockModel) => void);

  getAllStock(callback: (stocks: StockModel[]) => void);

  deleteStock(stock: StockModel, callback?: (value: any) => void);

  deleteAllStock(stocks: StockModel[], callback?: (value: any) => void);

  addStock(stock: StockModel): Promise<StockModel>;

  importStocks(stocks: StockModel[]): Promise<any>;

  updateStock(stock: StockModel): Promise<StockModel>;

  updateAllStock(stocks: StockModel[], callback?: (value: any) => void);

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

  updateSupplier(data: { objectId: string, field: string, value: string }): Promise<any>;

  updateUnit(unit: { objectId: string; value: string; field: string }): Promise<any>;

  addPurchase(purchaseI: PurchaseModel): Promise<any>;

  updateAllSupplier(callback?: (value: any) => void);

  deleteSupplier(objectId: string): Promise<any>;

  deleteAllSupplier(suppliers: SupplierI[], callback?: (value: any) => void);

  addUnit(unit: UnitsI): Promise<any>;

  getAllUnit(pagination: { size?: number, skip?: number }): Promise<UnitsI[]>;

}
