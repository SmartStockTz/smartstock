import {Injectable} from '@angular/core';
import {EventApiAdapter} from '../adapter/EventApiAdapter';

@Injectable({
  providedIn: 'root'
})
export class EventApiService implements EventApiAdapter {

  constructor() {
  }

  broadcast(eventName: string, data?: any): void {
    const cE = new CustomEvent(eventName, {
      detail: data
    });
    window.dispatchEvent(cE);
  }

  listen(eventName: string, handler: (data: any) => void): void {
    window.addEventListener(eventName, handler);
  }
}
