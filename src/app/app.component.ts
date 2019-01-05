import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {UpdateLocalDatabaseService} from './services/update-local-database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private firestore: AngularFirestore,
              private updateLocal: UpdateLocalDatabaseService,
              private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    this.updateLocal.updateStock();
    // this.httpClient.get<{
    //   id: any,
    //   product: string;
    //   unit: string;
    //   category: string;
    //   shelf: string;
    //   quantity: number;
    //   wholesaleQuantity: number;
    //   q_status: string;
    //   reorder: string;
    //   purchase: number;
    //   retailPrice: number;
    //   wholesalePrice: number;
    //   profit: number;
    //   times: number;
    //   expire: string;
    //   nhifPrice: number;
    //   retailWholesalePrice: number;
    //   retail_stockcol: string;
    // }[]>('/assets/datadumps/retail_stock.json').subscribe(value => {
    //   value.forEach(value1 => {
    //     const documentReference = this.firestore.collection('stocks').ref.doc();
    //     value1.id = documentReference.id;
    //     documentReference.set(value1).catch(reason => console.log(reason))
    //       .then(value2 => {
    //         console.log(value2);
    //       });
    //   });
    //   console.log('done');
    // }, error1 => {
    //   console.log(error1);
    // });
    // // const parse = JSON.parse(JSON.stringify());
    // // parse.forEach(value => {
    // //   value.id = documentReference.id;
    // //   console.log(value);
    // // });
  }


}
