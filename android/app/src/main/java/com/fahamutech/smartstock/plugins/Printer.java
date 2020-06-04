package com.fahamutech.smartstock.plugins;

import android.os.Build;
import android.util.Log;

import com.fahamutech.posprinter.JZV3Printer;
import com.fahamutech.posprinter.JZV3PrinterCallback;
import com.fahamutech.posprinter.PrinterError;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.vanstone.trans.api.PrinterApi;

import java.util.UUID;

@NativePlugin
public class Printer extends Plugin {

  @PluginMethod
  public void print(PluginCall call) {

//    Log.e("Device+++Model", Build.MODEL);
    if (Build.MODEL.trim().equals("JZV3")) {
      String data = call.getString("data", "");
      String id = call.getString("id", UUID.randomUUID().toString());
      String qr = call.getString("qr", null);

      JZV3Printer.getInstance().print(getContext(), new JZV3PrinterCallback() {
        @Override
        public void onReadToPrint() {
          PrinterApi.PrnClrBuff_Api();
          if (qr != null) {
            PrinterApi.printAddQrCode_Api(1, 150, qr);
          }
          PrinterApi.printFeedLine_Api(10);
          PrinterApi.PrnFontSet_Api(24, 24, 0);
          // PrinterApi.PrnSetGray_Api(30);
          PrinterApi.PrnLineSpaceSet_Api((short) 5, 0);
          PrinterApi.PrnStr_Api(data);
        }

        @Override
        public void onError(PrinterError printerError) {
          call.reject(printerError.toString());
        }

        @Override
        public void onSuccess() {
          call.resolve();
        }
      });
    } else {
      call.resolve();
    }
  }

//  private void printCartInfo() {
//    PrinterApi.PrnClrBuff_Api();
//    PrinterApi.printAddQrCode_Api(1, 200, "https:/smartstock.co.tz");
//    PrinterApi.printFeedLine_Api(5);
//    PrinterApi.PrnFontSet_Api(32, 32, 0);
//    PrinterApi.PrnSetGray_Api(15);
//    PrinterApi.PrnLineSpaceSet_Api((short) 5, 0);
//    PrinterApi.PrnStr_Api("     POS Receipt");
//    PrinterApi.PrnFontSet_Api(24, 24, 0);
//    PrinterApi.PrnStr_Api("       		CARDHOLDER COPY");
//    PrinterApi.PrnStr_Api("--------------------------------");
//    PrinterApi.PrnStr_Api("MERCHANT NAME:");
//    PrinterApi.PrnStr_Api("CARREFOUR");
//    PrinterApi.PrnStr_Api("MERCHANT NO.: ");
//    PrinterApi.PrnStr_Api("120401124594");
//    PrinterApi.PrnStr_Api("TERMINAL NO.: ");
//    PrinterApi.PrnStr_Api("TRANS TYPE.: ");
//    PrinterApi.PrnFontSet_Api(32, 32, 0);
//    PrinterApi.PrnStr_Api("Sale");
//    PrinterApi.PrnFontSet_Api(24, 24, 0);
//    PrinterApi.PrnStr_Api("PAYMENT TYPE.: ");
//    PrinterApi.PrnStr_Api("CARDHOLDER SIGNATURE:\n\n\n\n");
//    PrinterApi.PrnStr_Api("--------------------------------");
//    PrinterApi.PrnStr_Api("I accept this trade and allow it on my account");
//    PrinterApi.PrnStr_Api("----------x------------x-------");
//    //PrinterApi.PrnStr_Api("\n\n\n\n\n\n\n\n");
//    PrinterApi.PrnStr_Api("                    .");
//    PrinterApi.PrnStr_Api("                    .");
//  }

}
