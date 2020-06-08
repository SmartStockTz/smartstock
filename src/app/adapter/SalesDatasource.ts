import {SalesModel} from '../model/CashSale';
import {OrderModel} from '../model/OderI';

export interface SalesDatasource {
  saveSales(sale: SalesModel[], cartId: string): Promise<any>;

  getSalesByUser(userId: string, channel?: string): Promise<SalesModel[]>;

  getOrder(orderId: string): Promise<OrderModel>;

  getOrders(pagination?: {size: number, limit: number}): Promise<OrderModel[]>;

  deleteOrder(orderId: string): Promise<any>;

  updateOrder(orderId: string, order: OrderModel): Promise<OrderModel>;

  saveOrder(order: OrderModel): Promise<OrderModel>;

  saveOrders(orders: OrderModel[]): Promise<any>;
}
