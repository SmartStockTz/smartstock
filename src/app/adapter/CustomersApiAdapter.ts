import {CustomerModel} from '../model/CustomerModel';

export interface CustomersApiAdapter {
  saveCustomer(customer: CustomerModel): Promise<CustomerModel>;

  getCustomers(): Promise<CustomerModel[]>;
}
