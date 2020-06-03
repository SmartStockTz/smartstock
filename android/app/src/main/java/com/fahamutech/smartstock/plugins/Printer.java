package com.fahamutech.smartstock.plugins;

import android.content.Context;
import android.util.Log;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.vanstone.trans.api.PrinterApi;

@NativePlugin
public class Printer extends Plugin {

  @PluginMethod
  public void print(PluginCall call) {
    System.out.println("printer start：");
//    int ret = PrinterApi.PrnOpen_Api("", getContext());
//    if (ret == 0) {
      PrinterApi.PrnClrBuff_Api();
      PrinterApi.PrnFontSet_Api(32, 32, 0);
      PrinterApi.PrnSetGray_Api(15);
      PrinterApi.PrnLineSpaceSet_Api((short) 5, 0);
      PrinterApi.PrnStr_Api("     POS Receipt");
      PrinterApi.PrnFontSet_Api(24, 24, 0);
      PrinterApi.PrnStr_Api("       		CARDHOLDER COPY");
      PrinterApi.PrnStr_Api("--------------------------------");
      PrinterApi.PrnStr_Api("MERCHANT NAME:");
      PrinterApi.PrnStr_Api("CARREFOUR");
      PrinterApi.PrnStr_Api("MERCHANT NO.: ");
      PrinterApi.PrnStr_Api("120401124594");
      PrinterApi.PrnStr_Api("TERMINAL NO.: ");
      PrinterApi.PrnStr_Api("TRANS TYPE.: ");
      PrinterApi.PrnFontSet_Api(32, 32, 0);
      PrinterApi.printAddQrCode_Api(1, 100, "https:/smartstock.co.tz");
      PrinterApi.PrnStr_Api("Sale");
      PrinterApi.PrnFontSet_Api(24, 24, 0);
      PrinterApi.PrnStr_Api("PAYMENT TYPE.: ");
      PrinterApi.PrnStr_Api("CARDHOLDER SIGNATURE:\n\n\n\n");
      PrinterApi.PrnStr_Api("--------------------------------");
      PrinterApi.PrnStr_Api("I accept this trade and allow it on my account");
      PrinterApi.PrnStr_Api("----------x------------x-------");
      //PrinterApi.PrnStr_Api("\n\n\n\n\n\n\n\n");
      PrinterApi.PrnStr_Api("                    .");
      PrinterApi.PrnStr_Api("                    .");
      PrintData();
      call.resolve();
//    }else{
//      call.reject("Printer Fails");
//    }
  }

  public static int PrintData() {
    int ret;
    String Buf = null;
    while (true) {
      ret = PrinterApi.PrnStart_Api();
      Log.d("aabb", "PrnStart_Api:" + ret);
      if (ret == 2) {
        Buf = "Return:" + ret + "	paper is not enough";
      } else if (ret == 3) {
        Buf = "Return:" + ret + "	too hot";
      } else if (ret == 4) {
        Buf = "Return:" + ret + "	PLS put it back\nPress any key to reprint";
      } else if (ret == 0) {
        return 0;
      }
      return -1;
    }
  }


  public static String getDeviceModel() {
    return android.os.Build.MODEL;
  }
}
