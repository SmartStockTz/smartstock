package com.vanstone.trans.struct;


import com.vanstone.trans.api.MathsApi;
import com.vanstone.utils.ByteUtils;
import com.vanstone.utils.CommonConvert;

public class Func {
	
	public static int StringToBcdAmt(byte[]bcdAmt , String samt)
	{
		if(samt.length() <= 0)
			return -1;
		String samts = samt.trim().replace(".", "");
		byte []amt = new byte[12];
		if(samts.length() > 12)
			return 1;
		ByteUtils.memset(amt, 0x30, amt.length);
		ByteUtils.memcpy(amt, 12-samts.length(), CommonConvert.StringToBytes(samts), 0, samts.length());
		MathsApi.AscToBcd_Api(bcdAmt, amt, 12);
		return 0;
	}

}
