import {CustomerModel} from '../modules/sales/models/customer.model';

export interface CustomersApiAdapter {
  saveCustomer(customer: CustomerModel): Promise<CustomerModel>;

  getCustomers(): Promise<CustomerModel[]>;
}
