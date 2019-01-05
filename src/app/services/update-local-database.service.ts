import {Injectable, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {NgForage} from 'ngforage';
import {Stock} from '../model/stock';

@Injectable({
  providedIn: 'root'
})
export class UpdateLocalDatabaseService implements OnInit {
  stocks: Stock[];

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

  // updateStock() {
  //   console.log('start inserted data to indexdb');
  //   this.firestore.collection<Stock>('stocks').get().subscribe(value => {
  //     if (value.size > 0) {
  //       this.stocks = [];
  //       value.forEach(value1 => {
  //         this.stocks.push({
  //           id: value1.id,
  //           retail_stockcol: value1.get('retail_stockcol'),
  //           expire: value1.get('expire'),
  //           times: value1.get('expire'),
  //           q_status: value1.get('q_status'),
  //           wholesaleQuantity: value1.get('wholesaleQuantity'),
  //           wholesalePrice: value1.get('wholesalePrice'),
  //           unit: value1.get('unit'),
  //           supplier: value1.get('supplier'),
  //           shelf: value1.get('shelf'),
  //           retailWholesalePrice: value1.get('retailWholesalePrice'),
  //           retailPrice: value1.get('retailPrice'),
  //           reorder: value1.get('reorder'),
  //           quantity: value1.get('quantity'),
  //           purchase: value1.get('purchase'),
  //           profit: value1.get('profit'),
  //           product: value1.get('profit'),
  //           nhifPrice: value1.get('nhifPrice'),
  //           category: value1.get('category')
  //         });
  //       });
  //       this.indexDb.setItem('stocks', this.stocks).then(value1 => {
  //         console.log('Inserted stocks in cache is : ', value1.length);
  //       }).catch(reason => {
  //         console.log(reason);
  //       });
  //     }
  //   }, error1 => {
  //     console.log(error1);
  //   });
  // }

  ngOnInit(): void {
  }
}
