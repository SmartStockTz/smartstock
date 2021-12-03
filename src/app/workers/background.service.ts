import {Injectable} from '@angular/core';
import {BillingService} from '@smartstocktz/accounts';
import {Router} from '@angular/router';
import {cache} from 'bfast';
import {MatDialog} from '@angular/material/dialog';
import {PaymentDialogComponent} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  constructor(private readonly billing: BillingService,
              private readonly dialog: MatDialog,
              private readonly router: Router) {
  }

  private paymentDialogOpen = false;

  async start() {
    try {
      this._startPaymentWatch();
      return 'Done start payment watch';
    } catch (e) {
      console.warn(e);
    }
  }

  async stop() {
  }

  private _startPaymentWatch() {
    setInterval(() => {
      this.billing.subscription().then(value => {
        return cache({database: 'payment', collection: 'subscription'}).set('status', value);
      }).then(value => {
        if (value && value.subscription === false) {
          this.router.navigateByUrl('/account/bill').catch(console.log);
          if (this.paymentDialogOpen === false) {
            this.paymentDialogOpen = true;
            this.dialog.open(PaymentDialogComponent).afterClosed().subscribe(_1 => {
              this.paymentDialogOpen = false;
              this.router.navigateByUrl('/account/bill').catch(console.log);
            });
          }
        }
      }).catch(_ => {
        // console.log(reason, 'payment');
      });
    }, 1000 * 60 * 60);
  }
}
