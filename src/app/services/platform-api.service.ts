import {Injectable} from '@angular/core';
import {PlatformApiAdapter} from '../adapter/PlatformApiAdapter';
import {Capacitor} from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformApiService implements PlatformApiAdapter {

  constructor() {
  }

  async isDesktop(): Promise<boolean> {
    try {
      const info = await Capacitor.Plugins.Device.getInfo();
      return info.platform === 'electron';
    } catch (e) {
      throw e;
    }
  }

  async isMobile(): Promise<boolean> {
    try {
      const info = await Capacitor.Plugins.Device.getInfo();
      return info.platform === ('ios' || 'android');
    } catch (e) {
      throw e;
    }
  }

  async isWeb(): Promise<boolean> {
    try {
      const info = await Capacitor.Plugins.Device.getInfo();
      return info.platform === 'web';
    } catch (e) {
      throw e;
    }
  }
}
