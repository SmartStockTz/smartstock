package com.vanstone.demo.constants;

import com.vanstone.l2.COMMON_TERMINAL_PARAM;
import com.vanstone.l2.EMV_TERM_PARAM;
import com.vanstone.trans.struct.CtrlParam;
import com.vanstone.trans.struct.PosCom;


public class GlobalConstants {
	 public static String CurAppDir = "";
	 public static com.vanstone.trans.struct.PosCom PosCom = new PosCom();
	 public static  int g_EmvFullOrSim;
	 public static  int g_SwipedFlag;

	 public static EMV_TERM_PARAM stEmvParam = new EMV_TERM_PARAM();
	 public static COMMON_TERMINAL_PARAM termParam = new COMMON_TERMINAL_PARAM();
	 public static int isPinPad=DefConstants.PIN_PED;

	 public static boolean SelAppFlag = false;
	 public static int SelAppInx = 0xff;

	 public static CtrlParam gCtrlParam=new CtrlParam();

}
