import {Component, OnInit} from '@angular/core';
import {UpdateLocalDatabaseService} from './services/update-local-database.service';
import {UserDatabaseService} from './services/user-database.service';
import {NgForage} from 'ngforage';
import {Router} from '@angular/router';
import {SalesProxyService} from './services/sales-proxy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private router: Router,
              private salesProxy: SalesProxyService,
              private updateLocal: UpdateLocalDatabaseService) {

  }

  ngOnInit(): void {
    // this.updateLocal.updateCategories();
    // this.updateLocal.updateSuppliers();
    // this.updateLocal.updateUnits();
    // this.updateLocal.updateReceipts();
    // this.updateLocal.updateStock();
    this.salesProxy.saleProxy();
  }
}
