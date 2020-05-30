import {Injectable} from '@angular/core';
import {CustomersApiAdapter} from '../adapter/CustomersApiAdapter';
import {CustomerModel} from '../model/CustomerModel';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService implements CustomersApiAdapter {

  constructor(private readonly storage: StorageService) {
  }

  getCustomers(): Promise<CustomerModel[]> {
    return this.storage.getCustomers();
  }

  saveCustomer(customer: CustomerModel): Promise<CustomerModel> {
    return this.storage.saveCustomer(customer);
  }
}
