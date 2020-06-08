import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from './settings.service';
import {environment} from '../../environments/environment';
import {PrinterModel} from '../model/printer';
import {Capacitor} from '@capacitor/core';

const {Printer} = Capacitor.Plugins;

@Injectable({
  providedIn: 'root',
})
export class PrintServiceService {
  url: string;

  constructor(private readonly settings: SettingsService,
              private readonly httpClient: HttpClient) {
  }

  private async printInMobile(printerModel: PrinterModel) {
    return Printer.print(printerModel);
  }

  private async printInDesktop(printModel: PrinterModel) {
    this.url = `${environment.printerUrl}/print`;
    return this.httpClient.post(this.url, {
      data: printModel.data,
      id: printModel.id
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      responseType: 'text'
    }).toPromise();
  }

  async print(printModel: PrinterModel): Promise<any> {
    const cSettings = await this.settings.getSettings();
    let data = '';
    data = data.concat(cSettings.printerHeader + '\n');
    data = data.concat(printModel.data);
    data = data.concat(cSettings.printerFooter);

    printModel.data = data;

    // console.log(cSettings.saleWithoutPrinter);
    if (environment.android && Capacitor.isNative && !cSettings.saleWithoutPrinter) {
      return await this.printInMobile(printModel);
    }

    if (environment.electron && !cSettings.saleWithoutPrinter) {
      return await this.printInDesktop(printModel);
    }

    if (environment.browser && !cSettings.saleWithoutPrinter) {
      return await this.printInDesktop(printModel);
    }

    return;
  }

}
