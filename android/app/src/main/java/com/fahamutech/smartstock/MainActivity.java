package com.fahamutech.smartstock;

import android.os.Bundle;

import com.fahamutech.posprinter.JZV3Printer;
import com.fahamutech.smartstock.plugins.Printer;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  public static int pflag = 0;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // initialize printer
    JZV3Printer.getInstance().init(this);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(Printer.class);
    }});
  }

}
