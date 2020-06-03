package com.utils;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;

/**
 * 功能：编码的转换
 * @author Administrator
 *
 */
public class CodeConversion {

	/**
	 * @函数功能:字节数组转化成连续的二进制字符串
	 * @输入参数:字节数组
	 * @输出结果:二进制字符串
	 */
	public static String BcdToBinStr(byte[] bytes) {
		String sBinString = "";
		String sSingleString = "";
		for (int i = 0; i < bytes.length; i++) {
			sSingleString = Integer.toBinaryString(bytes[i]);
			sSingleString = ("00000000" + sSingleString).substring(
					sSingleString.length(), sSingleString.length() + 8);
			sBinString += sSingleString;

		}
		return sBinString;
	}

	/**
	 * @函数功能: BCD码字节数组转为16进制串字符串
	 * @输入参数: BCD码字节数组
	 * @输出结果: 16进制字符串
	 */
	public static String BcdToHexStr(byte[] bytes) {

		char Stra[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A',
				'B', 'C', 'D', 'E', 'F' };
		StringBuffer temp = new StringBuffer(bytes.length * 2);

		for (int i = 0; i < bytes.length; i++) {
			temp.append(Stra[(bytes[i] & 0xf0) >> 4]);
			temp.append(Stra[bytes[i] & 0x0f]);

		}
		return temp.toString();
	}

	//将byte[]转化为整型
	public static long convert(byte[] bts) {
		long len = 0;
		long base=256;
		for (int i = bts.length - 1,j=0; i >= 0; i--,j++) {
			int temp=((int)bts[i]);
			temp=temp<0?temp+256:temp;
			if (j==0) {
				len += temp;
			} else {
				len+=temp*base;
				base*=256;
			}
		}

//		System.out.println(len);
		return len;
	}


	/**
	 * 将用户输入的实际金额转换成需要的数据格式（12位的数据格式）
	 *
	 * @param money
	 * @return
	 */
	public static String AmountUiToBack(String money) {
		String result = "";
		if (money.indexOf(".") != money.lastIndexOf(".")) {
			result = "";
			return result;
		}
		// 前台传入的数据转换成后台标准金额
		if (money.indexOf(".") == -1) {
			// 用户没有输入小数点
			result = money + "00";
		} else {
			int index = money.indexOf(".") + 1;
			if (money.substring(index).length() < 2) {
				// 用户只输入了一位小数
				result = money.substring(0, index - 1) + money.substring(index)
						+ "0";
			} else if (money.substring(index).length() == 2) {
				// 用户输入了两位或两位以上的小数
				result = money.substring(0, index - 1) + money.substring(index);
			} else {
				result = money.substring(0, index - 1)
						+ money.substring(index, index + 2);
			}
		}
		//经金额补足12位的字符串
		int len = 12-result.length();//
		for(int i=len; i>0; i--){
			result = "0"+result;
		}
		return result;
	}

	/**
	 * 将后台返回的金额12位的转换为带两位小数点的字符串
	 *
	 * @param money
	 * @return
	 */
	public static String AmoutBackToUi(String money) {
		String result = "";
		if("".equals(money)){
			return result;
		}
		//去掉前边的0
		if("000000000000".equals(money)){
			money = "0";
		}else{
			for(int i=0; i<12; i++){
				if('0' != money.charAt(i)){
					money = money.substring(i);
					break;
				}
			}
		}

		if(money.length() <= 1){
			result ="0.0"+ money.substring(0);
		}
		else if (money.length() <= 2) {
			result ="0."+ money.substring(0);
		} else {
			result = money.substring(0, money.length() - 2) + "."
					+ money.substring(money.length() - 2);
		}
		return result;

	}

	/**
	 * 功能：16进制字符串转换为ASCII字符串
	 * @param s
	 * @return 16进制字符串 如：“30314142” 转为“01AB”
	 */

	public static String HexStrToCharStr(String s) {
	   byte[] baKeyword = new byte[s.length() / 2];
	   for (int i = 0; i < baKeyword.length; i++) {
	    try {
	     baKeyword[i] = (byte) (0xff & Integer.parseInt(s.substring(
	       i * 2, i * 2 + 2), 16));
	    } catch (Exception e) {
	     e.printStackTrace();
	    }
	   }
	   try {
	    s = new String(baKeyword, "utf-8");// UTF-16le:Not
	   } catch (Exception e1) {
	    e1.printStackTrace();
	   }
	   return s;
	}

	/**
	 * 功能：字符型字符串转化为16进制字符串
	 * @param s
	 * @return ASCII字符串 如：“01AB” 转为 “30314142”
	 */
	public static String CharStrToHexStr(String s)
	{
		String str="";
		for (int i=0;i<s.length();i++)
		{
		int ch = (int)s.charAt(i);
		String s4 = Integer.toHexString(ch);
		str = str + s4;
		}
		return str;
	}
	/**
	 * 功能：字符串特殊字符过滤方法，去除了包含的小数点以及数据以0开始的情况
	 * @param string
	 * @return
	 */
	public static String filterString(String string) {

		if(null == string || "".equals(string)){
			return string;
		}

		string = string.replace(".", "");
		StringBuffer buffer = new StringBuffer();
		char[] ch = string.toCharArray();
		boolean bo = false;
		for (int i = 0; i < ch.length; i++) {
			if (ch[i] != '0') {
				bo = true;
			}
			if (bo) {
				buffer.append(ch[i]);
			}
		}

		return buffer.toString();
	}

	public static byte[] charToByte(char[] arg, int length)
    {
		byte [] bTmp = new byte[length];
    	for(int i=0;i<length;i++)
    	{
    		bTmp[i] = (byte) arg[i];
    	}
    	return bTmp;
    }

	public static char[] byteToChar(byte[] arg, int length)
    {
    	char [] chTmp = new char[length];
    	for(int i=0;i<length;i++)
    	{
    		chTmp[i] = (char) arg[i];
    	}
    	return chTmp;
    }

	public static char[] byteToChar(byte[] arg)
    {
		int length = arg.length;
    	char [] chTmp = new char[length];
    	for(int i=0;i<length;i++)
    	{
    		chTmp[i] = (char) arg[i];
    	}
    	return chTmp;
    }

	public static String byteToString(byte[] arg, int length)
    {
    	char [] chTmp = new char[length];
    	for(int i=0;i<length;i++)
    	{
    		chTmp[i] = (char) arg[i];
    	}
    	return new String(chTmp);
    }


	 public static String byteToVisibleString(byte[] arg, int length)
	    {
	    	String str="", strTemp="";
	    	int temp;
	    	for(int i=0;i<length;i++)
	    	{
	    		temp = (int)arg[i] & 0xff;
	    		if(temp <= 0xf){
	    			strTemp = "0";
	        		strTemp += Integer.toHexString(arg[i] & 0xff);
	    		}else{
	    			strTemp = Integer.toHexString(arg[i] & 0xff);
	    		}

	    		//str = str+strTemp+" ";
	    		str = str+strTemp;
	    	}
	    	return str;
	    }

	 /**
	     * 将一个字节16进制数拆成2个字节并以ASCII码表示
	     * @param inArray
	     * @param iInArrayLength
	     * @param outArray
	     */
	    public static  void bcdToAsc(byte[] inArray, int iInArrayLength, byte[] outArray) {

			 int j = 0;
			 for(int i = 0; i< iInArrayLength; i++){
				 outArray[j] = hexToAscii((inArray[i] & 0xf0) >>4);
				 j++;
				 outArray[j] = hexToAscii(inArray[i] & 0x0f);
				 j++;

			 }

		 }


	    /**
	     * 将一个字节16进制数拆成2个字节并以ASCII码表示
	     * @param inArray
	     * @param iInArrayLength
	     * @param outArray
	     */
	    public static String bcdToAsc(byte[] inArray, int iInArrayLength) {
	    	byte[] outArray=new byte[iInArrayLength*2];
	    	int j = 0;
			 for(int i = 0; i< iInArrayLength; i++){
				 outArray[j] = hexToAscii((inArray[i] & 0xf0) >>4);
				 j++;
				 outArray[j] = hexToAscii(inArray[i] & 0x0f);
				 j++;

			 }
			return  new String(outArray) ;//outArray.toString();
		 }

	    /**
	     * 将一个字节16进制数拆成2个字节并以ASCII码表示
	     * @param inArray
	     */
	    public static String bcdToAsc(byte[] inArray) {
	    	int iInArrayLength = inArray.length;
	    	byte[] outArray=new byte[iInArrayLength*2];
	    	int j = 0;
			 for(int i = 0; i< iInArrayLength; i++){
				 outArray[j] = hexToAscii((inArray[i] & 0xf0) >>4);
				 j++;
				 outArray[j] = hexToAscii(inArray[i] & 0x0f);
				 j++;
			 }
			return  new String(outArray) ;//outArray.toString();
		 }

	    public static String bcdToAsc(String strBCD, int length) {
			// TODO Auto-generated method stub
			byte [] ArrayBCD = new byte[length];
			for (int i = 0; i < length; i++) {
				ArrayBCD [i] = (byte) (strBCD.charAt(i));
			}
			return bcdToAsc(ArrayBCD,ArrayBCD.length);
		}


	    public static String bcdToAsc(char[] inArray, int length) {
			// TODO Auto-generated method stub
			byte [] ArrayBCD = new byte[length];
			for (int i = 0; i < length; i++) {
				ArrayBCD [i] = (byte) inArray[i];
			}
			return bcdToAsc(ArrayBCD,ArrayBCD.length);
		}

	    /**
	     * BCD码转ASCII码
	     * @param iNum
	     * @return
	     */
	    public static   byte hexToAscii(int iNum){
			if(iNum>=0 && iNum<=9){
				return  (byte)(iNum+0x30);
			} else  {
				return ((byte)(0x40+(byte)(iNum-9)));
			}

		}


	    public static byte[] GetStringBytes(String strData) {
			// TODO Auto-generated method stub
	    	if (strData.isEmpty()) {
	    		return new byte[1];
	    	}
	    	int  length = strData.length();
			byte [] ArrayBCD = new byte[length];
			for (int i = 0; i < length; i++) {
				ArrayBCD [i] = (byte) (strData.charAt(i));
			}
			return ArrayBCD;
		}


	 /**
		 *
		 * @param inArray
		 * @param iInArrayLength
		 * @param outArray
		 */
		public static byte[] AscToBcd(byte[] inArray, int iInArrayLength) {
			int j = 0;
			int nLen = (iInArrayLength +1)/ 2;
			byte[] outArray = new byte[nLen];
			for (int i = 0; i < nLen; i++) {
				outArray[i] = (byte)(AsciiToHex(inArray[j++]) << 4);
				outArray[i] |= (j >= iInArrayLength) ? 0x00 : AsciiToHex(inArray[j++]);
			}
			return outArray;
		}

		public static String AscToBcd(String strAsc, int nStrLen) {
			int j = 0;
			byte[] inArray = strAsc.getBytes();
			int nLen = (nStrLen +1)/ 2;
			byte[] outArray = new byte[nLen];
			for (int i = 0; i < nLen; i++) {
				outArray[i] = (byte)(AsciiToHex(inArray[j++]) << 4);
				outArray[i] |= (j >= nStrLen) ? 0x00 : AsciiToHex(inArray[j++]);
			}
			return byteToString(outArray,nLen);
		}

		public static byte[] AscToBcd(String strAsc) {
			int j = 0;
			int nStrLen = strAsc.length();
			byte[] inArray = strAsc.getBytes();
			int nLen = (nStrLen +1)/ 2;
			byte[] outArray = new byte[nLen];
			for (int i = 0; i < nLen; i++) {
				outArray[i] = (byte)(AsciiToHex(inArray[j++]) << 4);
				outArray[i] |= (j >= nStrLen) ? 0x00 : AsciiToHex(inArray[j++]);
			}
			return outArray;
		}

		public static String subStr(String str, int subSLength) {
			if (str == null)
				return "";
			else {
				int tempSubLength = subSLength;// 截取字节数
				String subStr = str.substring(0,
						str.length() < subSLength ? str.length() : subSLength);// 截取的子串
				int subStrByetsL = 0;
				try {
					subStrByetsL = subStr.getBytes("GBK").length;
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}// 截取子串的字节长度
					// int subStrByetsL = subStr.getBytes().length;//截取子串的字节长度
					// 说明截取的字符串中包含有汉字
				while (subStrByetsL > tempSubLength) {
					int subSLengthTemp = --subSLength;
					subStr = str.substring(0,
							subSLengthTemp > str.length() ? str.length()
									: subSLengthTemp);
					try {
						subStrByetsL = subStr.getBytes("GBK").length;
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					// subStrByetsL = subStr.getBytes().length;
				}
				return subStr;
			}
		}

		/**
		 * ASCII码转BCD码
		 *
		 * @param iNum
		 * @return
		 */
		private static byte AsciiToHex(int iNum) {

		     if((iNum >= '0') && (iNum <= '9'))
			{
				return (byte) (iNum - '0');
			}
			else if((iNum >= 'A') && (iNum <= 'F'))
			{
				return (byte) (iNum - 'A' + 10);
			}
			else if((iNum >= 'a') && (iNum <= 'f'))
			{
				return (byte) (iNum - 'a' + 10);
			}
			else if((iNum >= 0x39) && (iNum <= 0x3f))
			{
				return (byte) (iNum - '0');
			}
			else
				return 0x0f;
		}

		public static String FormatString(String str, int len, boolean bLeftPadding, char paddingChar) {
	        if (str == null) {
	            return null;
	        }
	        if (len <= 0) {
	           // Do something
	        }
	        if (str.length() >= len) {
	            return str.substring(0, len);
	        }

	        char[] cs = new char[len];
	        if(bLeftPadding)
	        {
	        	str.getChars(0, str.length(), cs, len - str.length());
	        	Arrays.fill(cs, 0, len - str.length(), paddingChar);
	        }
	        else {
	            str.getChars(0, str.length(), cs, 0);
	            Arrays.fill(cs, str.length(), len, paddingChar);
			}
	        return new String(cs);
	    }

		public static long BcdToLong(byte []sBcdBuf, int length)
		{
			long lAmount = 0;
			lAmount = Long.valueOf(bcdToAsc(sBcdBuf, length));
			return lAmount ;
		}

		public static long BcdToLong(String strBcdBuf, int length)
		{
			long lAmount = 0;
			lAmount = Long.valueOf(bcdToAsc(strBcdBuf,length));
			return lAmount ;
		}

		public static byte[] IntToBcd(int iSrcValue, int iBcdLen)
		{
			String strAsc = String.format("%0" + iBcdLen*2 + "d",iSrcValue);
			return AscToBcd(strAsc.getBytes(),strAsc.length());
		}
}

