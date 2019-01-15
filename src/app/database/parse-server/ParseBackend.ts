import * as Parse from 'node_modules/parse';

export class ParseBackend {
  stocksObject: any;
  unitsObject: any;
  categoriesObject: any;
  suppliersCategory: any;

  constructor() {
    // Parse.initialize('ssm');
    // Parse.serverURL = 'http://localhost:3000/parse';
    // const StockObject = Parse.Object.extend('stocks');
    // const UnitObject = Parse.Object.extend('units');
    // const CategoryObject = Parse.Object.extend('categories');
    // const SupplierObject = Parse.Object.extend('suppliers');
    // this.stocksObject = new StockObject();
    // this.unitsObject = new UnitObject();
    // this.categoriesObject = new CategoryObject();
    // this.suppliersCategory = new SupplierObject();
  }

  public getParse(): Parse {
    return Parse;
  }

}


