import {Component} from '@angular/core';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';
import {OrderState} from '../states/order.state';

@Component({
  selector: 'smartstock-order-page',
  template: `
    <mat-sidenav-container>
      <mat-sidenav class="match-parent-side" #sidenav [mode]="enoughWidth()?'side': 'over'" [opened]="enoughWidth()">
        <smartstock-admin-drawer></smartstock-admin-drawer>
      </mat-sidenav>
      <mat-sidenav-content style="min-height: 100vh">
        <smartstock-toolbar searchPlaceholder="Filter orders" [showSearch]="true"
                            (searchCallback)="onSearch($event)" [heading]="'Orders'"
                            [sidenav]="sidenav"></smartstock-toolbar>
        <div class="container col-xl-9 col-lg-9 col-sm-10 col-md-10 col-10" style="padding: 16px 0">
          <div style="height: 24px"></div>
          <smartstock-orders-table></smartstock-orders-table>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class OrderPage extends DeviceInfoUtil {
  constructor(private readonly orderState: OrderState) {
    super();
  }

  onSearch($event: string) {
    this.orderState.orderFilterKeyword.next($event);
  }
}
