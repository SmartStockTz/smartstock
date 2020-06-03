
package com.vanstone.paywave;

import android.content.Context;
import android.util.Log;

import com.vanstone.demo.constants.GlobalConstants;
import com.vanstone.trans.EmvCommon;
import com.vanstone.trans.api.MathsApi;
import com.vanstone.trans.api.PrinterApi;
import com.vanstone.utils.ByteUtils;
import com.vanstone.utils.CommonConvert;

public class Print {
	public static void PrtCardInfo(Context context, int i){
	    //byte[] PrnBuf =new byte[128];
//	    PrinterApi.PrnOpen_Api("", context);
	    PrinterApi.PrnClrBuff_Api();
	    PrinterApi.PrnFontSet_Api(32, 32, 0);
	    PrinterApi.PrnSetGray_Api(15);
	    PrinterApi.PrnLineSpaceSet_Api((short) 5,0);
	    PrinterApi.PrnStr_Api("     POS Receipt");
		PrinterApi.PrnFontSet_Api(24, 24, 0);
		PrinterApi.PrnStr_Api("       		CARDHOLDER COPY");
		PrinterApi.PrnStr_Api("------------------------------------------------");
		PrinterApi.PrnStr_Api("MERCHANT NAME:");
		PrinterApi.PrnStr_Api("CARREFOUR");
		PrinterApi.PrnStr_Api("MERCHANT NO.: ");
		PrinterApi.PrnStr_Api("120401124594");
		PrinterApi.PrnStr_Api("TERMINAL NO.: ");
		PrinterApi.PrnStr_Api("TRANS TYPE.: ");
		PrinterApi.PrnFontSet_Api(32, 32, 0);
		PrinterApi.PrnStr_Api("Sale");
//		PrinterApi.PrnStr_Api("ISSUER: ");
		PrinterApi.PrnFontSet_Api(24, 24, 0);
		PrinterApi.PrnStr_Api("PAYMENT TYPE.: ");
//		String cardno = new String(GlobalConstants.PosCom.stTrans.MainAcc);
//		if(cardno.length() != 0){
//			PrinterApi.PrnStr_Api("BAND CARD PAYMENT");
//			PrinterApi.PrnStr_Api("CARD NUMBER ");
//			Log.d("aabb", "CardNO."+cardno.trim());
//			prnShieldPanCardNum(6, PrnBuf , GlobalConstants.PosCom.stTrans.MainAcc);
//			PrinterApi.PrnStr_Api(new String(PrnBuf).trim());
//		}else{
//			PrinterApi.PrnStr_Api("SCANING CODE PAYMENT");
//		}
//
//
//		PrinterApi.PrnStr_Api("DATE/TIME:");
//		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm ");
//		PrinterApi.PrnStr_Api(dateFormat.format(System.currentTimeMillis()));
//		PrinterApi.PrnStr_Api("AMOUNT:" );
//		PrinterApi.PrnFontSet_Api(32, 32, 0);
//		PrinterApi.PrnHTSet_Api(1);
//		byte amt[] = new byte[32];
//		byte samt[]= new byte[32];
//		MathsApi.BcdToAsc_Api(amt, GlobalConstants.PosCom.stTrans.TradeAmount, 12);
//		EmvCommon.FormatAmt_Str(samt, amt);
//		PrinterApi.PrnStr_Api("RMB:"+CommonConvert.BytesToString(samt).trim());
//		PrinterApi.PrnFontSet_Api(24, 24, 0);
//		PrinterApi.PrnHTSet_Api(0);
		PrinterApi.PrnStr_Api("CARDHOLDER SIGNATURE:\n\n\n\n" );
		PrinterApi.PrnStr_Api("------------------------------------------------");
		PrinterApi.PrnStr_Api("I accept this trade and allow it on my account");
		PrinterApi.PrnStr_Api("--------------x--------------------x-----------");
		PrinterApi.PrnStr_Api("\n");

	 	PrintData();
//	 	PrinterApi.PrnClose_Api();
	}
	public static int PrtTicket(int i)
	{
		System.out.println("Print start");
		PrinterApi.PrnClrBuff_Api();
		PrinterApi.PrnFontSet_Api(32, 32, 0);
		PrinterApi.PrnSetGray_Api(15);
	    PrinterApi.PrnLineSpaceSet_Api((short) 5,0);
	    PrinterApi.PrnStr_Api("  Cashier Counter");
		PrinterApi.PrnFontSet_Api(24, 24, 0);
		PrinterApi.PrnStr_Api("------------------------------------------------");
		PrinterApi.PrnStr_Api("STORE NUMBER:");
		PrinterApi.PrnStr_Api("12345678");
	    //PrinterApi.PrnStr_Api("RECEIPT NUMBER:");
	    //PrinterApi.PrnStr_Api(GlobalConstants.receipts.get(i).getNumber());
	    PrinterApi.PrnStr_Api("CASHER:");
		PrinterApi.PrnStr_Api("002");
	    PrinterApi.PrnStr_Api("POS NUMBER:");
		PrinterApi.PrnStr_Api("00021009871");
	    //PrinterApi.PrnStr_Api("DATE TIME:");
	    //PrinterApi.PrnStr_Api(GlobalConstants.receipts.get(i).getDate());
	    PrinterApi.PrnStr_Api("AMOUNT:");
	    byte amt[] = new byte[32];
		byte samt[]= new byte[32];
		MathsApi.BcdToAsc_Api(amt, GlobalConstants.PosCom.stTrans.TradeAmount, 12);
		EmvCommon.FormatAmt_Str(samt, amt);
		PrinterApi.PrnStr_Api("RMB:"+ CommonConvert.BytesToString(samt).trim());
		PrinterApi.PrnStr_Api("\n");
	 	PrintData();
		return 0;
	}

	public static int PrintData()
	{
		int ret;
		String Buf = null;

		while(true)
		{
			ret = PrinterApi.PrnStart_Api();
			Log.d("aabb", "PrnStart_Api:"+ret);
			if(ret == 2)
			{
				Buf = "Return:" + ret + "	paper is not enough";
			}
			else if(ret  == 3)
			{
				Buf = "Return:" + ret + "	too hot";
			}
			else if(ret == 4 )
			{
				Buf = "Return:" + ret + "	PLS put it back\nPress any key to reprint";
			}
			else if(ret == 0 )
			{
				return 0;
			}
			return -1;

		}
	}

	public static void PrnDefaultFont()
	{
		PrinterApi.PrnFontSet_Api(16, 24, 0);
	}

	public static void prnShieldPanCardNum(int flag, byte[] prtCard, byte[] cardNum)
	{
		if( (flag != 0) && (cardNum.length >= 9) )
		{
			int starNum  = cardNum.length - flag - 4;
			ByteUtils.memcpy(prtCard, cardNum, flag);

			byte[] tmp = new byte[starNum];
			ByteUtils.memset(tmp, '*', starNum);
			ByteUtils.memcpy(prtCard, flag, tmp, 0, starNum);

			ByteUtils.memcpy(prtCard, flag + starNum, cardNum, flag + starNum, 4);
			prtCard[cardNum.length] = 0;
		}
		else
		{
			ByteUtils.strcpy(prtCard, cardNum);
		}
	}
}
