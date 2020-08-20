import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/***** move to common ********/
import {SettingsService} from '../../../services/settings.service';
/***** move to common ********/
import {environment} from '../../../../environments/environment';
import {PrinterModel} from '../models/printer.model';
import {Capacitor} from '@capacitor/core';

const {Printer} = Capacitor.Plugins;

@Injectable({
  providedIn: 'root',
})
export class PrintService {
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

    if (!environment.production) {
      console.warn('print services disabled in dev mode');
      return;
    }

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
