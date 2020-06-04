package com.fahamutech.smartstock;

import android.os.Bundle;

import com.fahamutech.posprinter.JZV3Printer;
import com.fahamutech.smartstock.plugins.Printer;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(Printer.class);
    }});
    JZV3Printer.getInstance().init(this);
  }

}
