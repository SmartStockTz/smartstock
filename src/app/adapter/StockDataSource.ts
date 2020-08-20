
import {CategoryModel} from '../modules/stocks/models/category.model';
import {SupplierModel} from '../modules/stocks/models/supplier.model';
import {UnitsModel} from '../modules/stocks/models/units.model';
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

  getCategory(id: string, callback: (category: CategoryModel) => void);

  getAllCategory(pagination: { size?: number, skip?: number }): Promise<CategoryModel[]>;

  addCategory(category: CategoryModel): Promise<any>;

  addAllCategory(categories: CategoryModel[], callback?: (value: any) => void);

  updateCategory(category: any): Promise<any>;

  updateAllCategory(categories: CategoryModel[], callback?: (value: any) => void);

  deleteCategory(category: CategoryModel): Promise<any>;

  deleteAllCategory(categories: CategoryModel[], callback: (value: any) => void);

  addSupplier(supplier: SupplierModel, callback: (value: any) => void);

  addAllSupplier(suppliers: SupplierModel[], callback: (value: any) => void);

  getSupplier(id: string, callback: (supplier: SupplierModel) => void);

  getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierModel[]>;

  updateSupplier(data: { objectId: string, field: string, value: string }): Promise<any>;

  updateUnit(unit: { objectId: string; value: string; field: string }): Promise<any>;

  addPurchase(purchaseI: PurchaseModel): Promise<any>;

  updateAllSupplier(callback?: (value: any) => void);

  deleteSupplier(objectId: string): Promise<any>;

  deleteAllSupplier(suppliers: SupplierModel[], callback?: (value: any) => void);

  addUnit(unit: UnitsModel): Promise<any>;

  getAllUnit(pagination: { size?: number, skip?: number }): Promise<UnitsModel[]>;

}
