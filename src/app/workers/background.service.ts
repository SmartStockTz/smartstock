import {Injectable, OnInit} from '@angular/core';
import {EventService} from '@smartstocktz/core-libs';
import {BillingService} from '@smartstocktz/accounts';
import {Router} from '@angular/router';
import {cache} from 'bfast';
import {MatDialog} from '@angular/material/dialog';
import {PaymentDialogComponent} from '../components/payment-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService implements OnInit {

  constructor(private readonly eventApi: EventService,
              private readonly billing: BillingService,
              private readonly dialog: MatDialog,
              private readonly router: Router) {
  }

  private paymentDialogOpen = false;

  ngOnInit(): void {
  }

  async start() {
    try {
      this._startPaymentWatch();
      return 'Done start proxy';
    } catch (e) {
      console.warn(e);
    }
  }

  async stop() {
    this._stopWorkers();
  }

  private _stopWorkers() {
  }

  private _startPaymentWatch() {
    setInterval(() => {
      this.billing.subscription().then(value => {
        return cache({database: 'payment', collection: 'subscription'}).set('status', value, {secure: true});
      }).then(value => {
        if (value && value.subscription === false) {
          this.router.navigateByUrl('/account/bill').catch(_ => {
            // console.log(reason);
          });
          if (this.paymentDialogOpen === false) {
            this.paymentDialogOpen = true;
            this.dialog.open(PaymentDialogComponent).afterClosed().subscribe(_1 => {
              this.paymentDialogOpen = false;
              this.router.navigateByUrl('/account/bill').catch(_2 => {
              });
            });
          }
        }
      }).catch(_ => {
        // console.log(reason, 'payment');
      });
    }, 1000 * 60 * 60);
  }
}
