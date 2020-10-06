import { Injectable } from '@angular/core';
import { OrderService } from '../services/order.service';
import { BehaviorSubject } from 'rxjs';
import { OrderModel } from '../models/order.model';
import { MessageService } from '../../lib/services/message.service';
import { LogService } from '../../lib/services/log.service';

@Injectable({
  providedIn: 'any'
})
export class OrderState {

  orders: BehaviorSubject<OrderModel[]> = new BehaviorSubject<OrderModel[]>([]);
  orderFilterKeyword: BehaviorSubject<string> = new BehaviorSubject<string>('');
  getOrderFlag: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  markAsCompleteFlag: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly orderService: OrderService,
    private readonly logger: LogService,
    private readonly messageService: MessageService) {
  }

  getOrder(size = 20, skip = 0) {
    this.getOrderFlag.next(true);
    this.orderService.getOrders(size, skip).then(value => {
      this.orders.value.push(...value);
      this.orders.next(this.orders.value);
    }).catch(_ => {
      this.logger.i(_);
      this.messageService.showMobileInfoMessage('Fails to fetch orders', 2000, 'bottom');
    }).finally(() => {
      this.getOrderFlag.next(false);
    });
  }

  markAsComplete(order: OrderModel): void {
    this.markAsCompleteFlag.next(true);
    this.orderService.markAsCompleted(order).then(_ => {
      this.orders.value.map(x=>{
        if(x.id === order.id){
          x.status = "COMPLETED";
          x.paid = true;
        }
        return x;
      })
      this.messageService.showMobileInfoMessage('Order updated', 2000, 'bottom');
    }).catch(reason=>{
      this.logger.i(reason);
      this.messageService.showMobileInfoMessage(reason&&reason.message?reason.message: reason, 2000,'bottom')
    }).finally(() => {
      this.markAsCompleteFlag.next(false);
    });
  }
}
