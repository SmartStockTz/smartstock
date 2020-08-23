import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

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

  unListen(eventName: string, handler?: (data: any) => void): void {
    window.removeEventListener(eventName, handler);
  }
}
