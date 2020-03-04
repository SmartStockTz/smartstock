import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Stock} from '../../model/stock';
import {UserI} from '../../model/UserI';
import {Observable, of} from 'rxjs';
import {CartI} from '../../model/cart';
import {SalesDatabaseService} from '../../services/sales-database.service';
import {CashSaleI} from '../../model/CashSale';
import {PrintServiceService} from '../../services/print-service.service';
import {randomString} from '../../adapter/ParseBackend';
import {DeviceInfo} from '../../common-components/DeviceInfo';
import {SettingsServiceService} from '../../services/Settings-service.service';
import {toSqlDate} from '../../utils/date';
import {LocalStorageService} from '../../services/local-storage.service';
import {StockDatabaseService} from '../../services/stock-database.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
  providers: [
    SalesDatabaseService
  ]
})
export class SaleComponent extends DeviceInfo implements OnInit {
  private currentUser: UserI;
  isAdmin = false;
  isLogin = false;
  showProgress = false;
  totalPrice = 0;
  priceUnit = 0;
  changePrice = 0;
  totalBill = 0;
  totalSaleAmount = 0;
  productNameControlInput = new FormControl();
  receiveControlInput = new FormControl();
  quantityControlInput = new FormControl();
  discountControlInput = new FormControl();
  searchSaleControl = new FormControl();
  retailWholesaleRadioInput = new FormControl();
  traRadioControl = new FormControl();
  nhifRadioInput = new FormControl();
  filteredOptions: Observable<Stock[]>;
  stocks: Stock[];
  stock: Stock = {
    category: '',
    objectId: '',
    nhifPrice: 0,
    product: '',
    profit: 0,
    purchase: 0,
    quantity: 0,
    reorder: 0,
    retailPrice: 0,
    retailWholesalePrice: 0,
    shelf: '',
    supplier: '',
    q_status: '',
    times: 0,
    expire: '',
    retail_stockcol: '',
    unit: '',
    wholesalePrice: 0,
    wholesaleQuantity: 0,
  };
  cartDatasourceArray: CartI[];
  cartDatasource: MatTableDataSource<CartI>;
  saleDatasourceArray: CashSaleI[];
  salesDatasource: MatTableDataSource<CashSaleI>;
  cartColums = ['product', 'quantity', 'amount', 'discount', 'action'];
  activeTab = 0;
  @ViewChild('cartPaginator', {static: false}) paginator: MatPaginator;

  printProgress = false;
  refreshProductsProgress = false;

  constructor(private router: Router,
              private readonly _stockApi: StockDatabaseService,
              private readonly _storage: LocalStorageService,
              private readonly snack: MatSnackBar,
              private readonly settings: SettingsServiceService,
              private readonly printS: PrintServiceService,
              private readonly saleDatabase: SalesDatabaseService) {
    super();
  }

  ngOnInit() {
    this._storage.getActiveUser().then(value => {
      if (value === null) {
        this.router.navigateByUrl('login').catch(reason => console.log(reason));
      } else {
        this.currentUser = value;
        this.initializeView();
      }
    }).catch(reason => {
      console.log(reason);
    });
  }

  private getProduct(product: string) {
    this._storage.getStocks().then(value => {
      if (value) {
        const stocksFiltered: Stock[] = value.filter(value1 => (value1.product.toLowerCase().includes(product.toLowerCase())));
        this.filteredOptions = of(stocksFiltered);
      } else {
        this.snack.open('No products found, try again or refresh products', 'Ok', {
          duration: 3000
        });
      }
    }).catch(reason => {
      console.log(reason);
      this.snack.open(reason, 'Ok');
    });
  }

  addToCart() {
    if (this.productNameControlInput.value === null) {
      this.snack.open('Please enter the product to sell', 'Ok', {duration: 3000});
    } else if (this.quantityControlInput.value === null) {
      this.snack.open('Please enter quantity of a product you sell', 'Ok', {duration: 3000});
    } else if (this.totalPrice === 0) {
      this.snack.open('Can\'t sell zero product', 'Ok');
    } else if (this.cartDatasourceArray.length === 50) {
      this.snack.open('Cart can accommodate only 50 products at once save them or sale them first then add another products',
        'Ok', {duration: 3000});
    } else {
      if (this.activeTab !== 0) {
        this.activeTab = 0;
      }
      const showTotalPrice = this.showTotalPrice();
      this.cartDatasourceArray.push({
        product: this.productNameControlInput.value,
        quantity: showTotalPrice.quantity,
        amount: showTotalPrice.amount,
        discount: this.discountControlInput.value,
        stock: this.stock,
      });
      this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
      this.cartDatasource.paginator = this.paginator;
      this.updateTotalBill();
      this.clearInputs();
    }
  }

  removeItemFromCart(element: CartI) {
    this.cartDatasourceArray = this.cartDatasourceArray.filter(value => value !== element);
    this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
    this.cartDatasource.paginator = this.paginator;
    this.updateTotalBill();
  }

  updateSelectedStock(st: Stock) {
    this.stock = st;
    this.showTotalPrice();
  }

  submitBill() {
    this.showProgressBar();
    const stringDate = toSqlDate(new Date());
    let idTra: string;
    let channel: string;
    if (this.traRadioControl.value === false) {
      idTra = 'n';
    } else {
      idTra = 'n/n';
    }
    if (this.nhifRadioInput.value === true) {
      channel = 'nhif';
    } else {
      channel = 'retail';
    }
    const saleM: CashSaleI[] = [];
    this.cartDatasourceArray.forEach(value => {
      saleM.push({
        amount: value.amount,
        discount: value.discount,
        quantity: value.quantity,
        product: value.product,
        category: value.stock.category,
        unit: value.stock.unit,
        channel: channel,
        date: stringDate,
        idOld: randomString(8),
        idTra: idTra,
        user: this.currentUser.objectId,
        batch: randomString(12),
        stock: value.stock,
        stockId: value.stock.objectId// for reference only
      });
    });

    this.saleDatabase.addAllCashSale(saleM).then(value => {
      this.hideProgressBar();
      // this.printCart();
      this.cartDatasourceArray = [];
      this.cartDatasource = new MatTableDataSource(this.cartDatasourceArray);
      this.cartDatasource.paginator = this.paginator;
      this.updateTotalBill();
      // this.snack.open('Done save sales', 'Ok', {duration: 3000});
    }).catch(reason => {
      this.saleDatabase.addCashSaleToCache(this.cartDatasourceArray, value1 => {
      });
      this.snack.open('Product not saved, try again', 'Ok');
      this.hideProgressBar();
    });
  }

  async printCart() {
    try {
      this.printProgress = true;
      const settings = await this.settings.getSettings();
      if (settings && settings.saleWithoutPrinter) {
        this.submitBill();
        this.snack.open('Cart saved successful', 'Ok', {
          duration: 3000
        });
        this.printProgress = false;
      } else {
        this.printS.printCartRetail(this.cartDatasourceArray, this.currentUser.username).then(_ => {
          this.submitBill();
          this.snack.open('Cart printed and saved', 'Ok', {duration: 3000});
          this.printProgress = false;
        }).catch(reason => {
          console.log(reason);
          this.snack.open('Printer is not connected or printer software is not running',
            'Ok', {duration: 3000});
          this.printProgress = false;
        });
      }
    } catch (reason) {
      console.error(reason);
      this.snack.open('General failure when try to submit your sales, contact support', 'Ok', {
        duration: 5000
      });
    }
  }

  private clearInputs() {
    this.productNameControlInput.setValue('');
    this.quantityControlInput.setValue(null);
    this.discountControlInput.setValue(0);
    this.retailWholesaleRadioInput.setValue(false);
    this.nhifRadioInput.setValue(false);
    this.receiveControlInput.setValue(0);
    this.changePrice = 0;
    this.totalPrice = 0;
    this.priceUnit = 0;
    this.stock = {
      category: '',
      objectId: '',
      nhifPrice: 0,
      product: '',
      profit: 0,
      purchase: 0,
      quantity: 0,
      reorder: 0,
      retailPrice: 0,
      retailWholesalePrice: 0,
      shelf: '',
      supplier: '',
      q_status: '',
      times: 0,
      expire: '',
      retail_stockcol: '',
      unit: '',
      wholesalePrice: 0,
      wholesaleQuantity: 0,
    };
  }

  private showProgressBar() {
    this.showProgress = true;
  }

  private hideProgressBar() {
    this.showProgress = false;
  }

  private initializeView() {
    this.retailWholesaleRadioInput.setValue(false);
    this.nhifRadioInput.setValue(false);
    this.traRadioControl.setValue(false);
    this.discountControlInput.setValue(0);
    this.receiveControlInput.setValue(0);
    this.cartDatasourceArray = [];
    this.saleDatasourceArray = [];
    this.productNameControlInput.valueChanges.subscribe(value => {
      this.getProduct(value);
    }, error1 => {
      console.log(error1);
    });
    this.quantityControlInput.valueChanges.subscribe(value => {
      if (value === null) {
        // this.snack.open('Quantity must be number', 'Ok', {duration: 3000});
        this.showTotalPrice();
      } else {
        this.showTotalPrice();
      }
    }, error1 => {
      console.log(error1);
    });
    this.discountControlInput.valueChanges.subscribe(value => {
      if (value === null) {
        this.snack.open('Discount must be a number', 'Ok', {duration: 3000});
        this.showTotalPrice();
      } else {
        this.showTotalPrice();
      }
    }, error1 => {
      console.log(error1);
    });
    this.searchSaleControl.valueChanges.subscribe(value => {
      this.salesDatasource.filter = value.toString().toLowerCase();
    }, error1 => {
      console.log(error1);
    });
    this.receiveControlInput.valueChanges.subscribe(value => {
      if (value === null) {
        this.snack.open('Please enter number ', 'Ok', {duration: 3000});
      } else {
        this.showChanges();
      }
    }, error1 => {
      console.log(error1);
    });
    this.retailWholesaleRadioInput.valueChanges.subscribe(value => {
      if (value === true) {
        if (this.nhifRadioInput.value === true) {
          this.nhifRadioInput.setValue(false);
        }
      }
      this.showTotalPrice();
    }, error1 => {
      console.log(error1);
    });
    this.nhifRadioInput.valueChanges.subscribe(value => {
      if (value === true) {
        if (this.retailWholesaleRadioInput.value === true) {
          this.retailWholesaleRadioInput.setValue(false);
        }
      }
      this.showTotalPrice();
    }, error1 => console.log(error1));

    // // live database
    // this.saleDatabase.getAllCashSaleOfUser(this.currentUser.objectId, datasource => {
    //   this.saleDatasourceArray = [];
    //   this.saleDatasourceArray = datasource;
    //   this.salesDatasource = new MatTableDataSource(this.saleDatasourceArray);
    //   this.salesDatasource.paginator = this.salePaginator;
    //   this.updateTotalSales();
    // });
  }

  private showChanges() {
    this.changePrice = this.receiveControlInput.value - this.totalPrice;
  }

  private showTotalPrice(): { quantity: number, amount: number } {
    if (this.nhifRadioInput.value === true) {
      this.priceUnit = this.stock.nhifPrice;
      this.totalPrice = (this.quantityControlInput.value * this.stock.nhifPrice) - (<number>this.discountControlInput.value);
      return {amount: this.totalPrice, quantity: this.quantityControlInput.value};
    } else if (this.retailWholesaleRadioInput.value === true) {
      this.priceUnit = this.stock.wholesalePrice;
      const a: number = (Number(this.quantityControlInput.value) * Number(this.stock.wholesaleQuantity));
      const totalPrice1 = (a * (<number>this.stock.retailWholesalePrice / Number(this.stock.wholesaleQuantity)));
      this.totalPrice = totalPrice1 - <number>this.discountControlInput.value;
      return {amount: this.totalPrice, quantity: a};
    } else {
      this.priceUnit = this.stock.retailPrice;
      this.totalPrice = (this.quantityControlInput.value * this.stock.retailPrice) - (<number>this.discountControlInput.value);
      return {amount: this.totalPrice, quantity: this.quantityControlInput.value};
    }
  }

  private updateTotalBill() {
    this.totalBill = 0;
    this.cartDatasourceArray.forEach(value => {
      this.totalBill += value.amount;
    });
  }

  private updateTotalSales() {
    let s = 0;
    this.saleDatasourceArray.forEach(value => {
      s += value.amount;
    });
    this.totalSaleAmount = s;
  }

  refreshProducts() {
    this.refreshProductsProgress = true;
    this._stockApi.getAllStock().then(async stocks => {
      try {
        await this._storage.saveStocks(stocks);
        this.snack.open('Products refreshed', 'Ok', {
          duration: 3000
        });
        this.refreshProductsProgress = false;
      } catch (e) {
        console.log(e);
        this.snack.open('Fails to fetch products from server', 'Ok', {
          duration: 3000
        });
        this.refreshProductsProgress = false;
      }
    }).catch(reason => {
      console.log(reason);
      this.snack.open('Fails to fetch products from server', 'Ok', {
        duration: 3000
      });
      this.refreshProductsProgress = false;
    });
  }
}
