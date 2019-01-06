import {Injectable, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {NgForage} from 'ngforage';
import {Stock} from '../model/stock';
import {CategoryI} from '../model/CategoryI';
import {SupplierI} from '../model/SupplierI';
import {UnitsI} from '../model/UnitsI';

@Injectable({
  providedIn: 'root'
})
export class UpdateLocalDatabaseService implements OnInit {
  stocks: Stock[];
  categories: CategoryI[];
  suppliers: SupplierI[];
  units: UnitsI[];

  constructor(private firestore: AngularFirestore, private indexDb: NgForage) {
  }

  updateStock() {
    this.firestore.collection<Stock>('stocks').snapshotChanges().subscribe(value => {
      if (value.length > 0) {
        this.stocks = [];
        value.forEach(value1 => {
          this.stocks.push(value1.payload.doc.data());
        });
        console.log('start inserted data to indexdb');
        this.indexDb.setItem('stocks', this.stocks).then(value1 => {
          console.log('Inserted stocks in cache is : ', value1.length);
        }).catch(reason => {
          console.log(reason);
        });
      }
    }, error1 => {
      console.log(error1);
    });
  }

  updateCategories() {
    this.firestore.collection<CategoryI>('categories').snapshotChanges().subscribe(value => {
      if (value.length > 0) {
        this.categories = [];
        value.forEach(value1 => {
          this.categories.push(value1.payload.doc.data());
        });
        this.indexDb.setItem('categories', this.categories).then(value1 => {
          console.log('Inserted categories in cache is : ' + value1.length);
        }).catch(reason => {
          console.log(reason);
        });
      }
    }, error1 => {
      console.log(error1);
    });
  }

  updateSuppliers() {
    this.firestore.collection<SupplierI>('suppliers').snapshotChanges().subscribe(value => {
      if (value.length > 0) {
        this.suppliers = [];
        value.forEach(value1 => {
          this.suppliers.push(value1.payload.doc.data());
        });
        this.indexDb.setItem('suppliers', this.suppliers).then(value1 => {
          console.log('Inserted suppliers in cache is : ' + value1.length);
        }).catch(reason => {
          console.log(reason);
        });
      }
    }, error1 => {
      console.log(error1);
    });
  }

  updateUnits() {
    this.firestore.collection<UnitsI>('units').snapshotChanges().subscribe(value => {
      if (value.length > 0) {
        this.units = [];
        value.forEach(value1 => {
          this.units.push(value1.payload.doc.data());
        });
        this.indexDb.setItem('units', this.units).then(value1 => {
          console.log('Inserted units in cache is : ' + value1.length);
        }).catch(reason => {
          console.log(reason);
        });
      }
    }, error1 => {
      console.log(error1);
    });
  }

  ngOnInit(): void {
  }
}
