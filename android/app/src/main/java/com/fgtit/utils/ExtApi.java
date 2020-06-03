package com.fgtit.utils;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.drawable.BitmapDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.nfc.NfcAdapter;
import android.os.Environment;
import android.telephony.TelephonyManager;
import android.text.format.Time;
import android.util.Base64;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ExtApi {

	public static String getStringDate() {
		Date currentTime = new Date(System.currentTimeMillis());
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateString = formatter.format(currentTime);
		return dateString;
	}

	public static String getDataTimeForID(){
		//Date dt = new Date(System.currentTimeMillis());
		//String id = String.format("%d%02d%02d%02d%02d",dt.getYear(),dt.getMonth(),dt.getDay(),dt.getHours(),dt.getMinutes());
		//return id;
		Time t=new Time(); // or Time t=new Time("GMT+8");
		t.setToNow();
		int year = t.year;
		int month = t.month+1;
		int date = t.monthDay;
		int hour = t.hour; // 0-23
		int minute = t.minute;
		//int second = t.second;
		return String.format("%d%02d%02d%02d%02d",year,month,date,hour,minute);
	}
	/*
	public static String getDataForID(){
		Time t=new Time(); // or Time t=new Time("GMT+8");
		t.setToNow();
		int year = t.year;
		int month = t.month+1;
		int date = t.monthDay;
		return String.format("%d%02d%02d",year,month,date);
	}
	*/
	public static String getDataForID(){
		Time t=new Time(); // or Time t=new Time("GMT+8");
		t.setToNow(); //
		int year = t.year;
		int month = t.month+1;
		int date = t.monthDay;
		int hour = t.hour; // 0-23
		int minute = t.minute;
		return String.format("%02d%02d%02d%02d%02d",year-2000,month,date,hour,minute);
	}

	public static String getDateTimeStr(){
		Time t=new Time(); // or Time t=new Time("GMT+8");
		t.setToNow();
		int year = t.year;
		int month = t.month+1;
		int date = t.monthDay;
		int hour = t.hour; // 0-23
		int minute = t.minute;
		int second = t.second;
		return String.format("%d-%02d-%02d %02d:%02d:%02d",year,month,date,hour,minute,second);
	}

	public static boolean IsFileExists(String filename){
		File f=new File(filename);
		if(f.exists()){
			return true;
		}
		return false;
	}

	public static void DeleteFile(String filename){
		File f=new File(filename);
		if(f.exists()){
			f.delete();
		}
	}

	public static Bitmap LoadBitmap(Resources res, int id){
		//Resources res = getResources();
		return BitmapFactory.decodeResource(res, id);
	}

	public static Bitmap Bytes2Bimap(byte[] b){
        if(b.length!=0){
            return BitmapFactory.decodeByteArray(b, 0, b.length);
        }
        else {
            return null;
        }
	}

	public static BitmapDrawable getImageDrawable(String path){
		File file = new File(path);
		if(!file.exists()){
			return null;
		}
		ByteArrayOutputStream outStream = new ByteArrayOutputStream();
		byte[] bt = new byte[1024];
		InputStream in;
		try {
			in = new FileInputStream(file);
			int readLength = in.read(bt);
			while (readLength != -1) {
				outStream.write(bt, 0, readLength);
				readLength = in.read(bt);
			}
			byte[] data = outStream.toByteArray();
			Bitmap bitmap = BitmapFactory.decodeByteArray(data, 0, data.length);// ����λͼ
			BitmapDrawable bd = new BitmapDrawable(bitmap);
			return bd;

		} catch (Exception e) {
		}
		return null;
	}

	public static byte[] Base64ToBytes(String txt){
		return android.util.Base64.decode(txt, Base64.DEFAULT);
	}

	public static String BytesToBase64(byte[] ba, int size){
		return android.util.Base64.encodeToString(ba, Base64.DEFAULT);
	}

    public static File SaveBytesToFile(byte[] b, String outputFile) {
        BufferedOutputStream stream = null;
        File file = null;
        try {
            file = new File(outputFile);
            FileOutputStream fstream = new FileOutputStream(file);
            stream = new BufferedOutputStream(fstream);
            stream.write(b);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (stream != null) {
                try {
                    stream.close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
        }
        return file;
    }

    public static byte[] intToByte(int number) {
        byte[] abyte = new byte[4];
        abyte[0] = (byte) (0xff & number);
        abyte[1] = (byte) ((0xff00 & number) >> 8);
        abyte[2] = (byte) ((0xff0000 & number) >> 16);
        abyte[3] = (byte) ((0xff000000 & number) >> 24);
        return abyte;
    }

    public static int bytesToInt(byte[] bytes) {
        int number = bytes[0] & 0xFF;
        number |= ((bytes[1] << 8) & 0xFF00);
        number |= ((bytes[2] << 16) & 0xFF0000);
        number |= ((bytes[3] << 24) & 0xFF000000);
        return number;
    }

    public static String uft8toGbk(String t){
    	String utf8="";
		try {
			utf8 = new String(t.getBytes( "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

    	String unicode="";
		try {
			unicode = new String(utf8.getBytes(),"UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

    	String gbk="";
		try {
			gbk = new String(unicode.getBytes("GBK"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return gbk;
    }

    public static String DateToStr(Date date) {

       SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
       String str = format.format(date);
       return str;
    }

    static final char TABLE1021[] = { /* CRC1021��ʽ�� */
		 0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108,
		   0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231,
		   0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339,
		   0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462,
		   0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a,
		   0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d, 0x3653,
		   0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b,
		   0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4,
		   0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823, 0xc9cc,
		   0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5,
		   0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd,
		   0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6,
		   0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae,
		   0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97,
		   0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70, 0xff9f,
		   0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188,
		   0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080,
		   0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83b9,
		   0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1,
		   0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea,
		   0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2,
		   0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db,
		   0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3,
		   0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634, 0xd94c,
		   0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844,
		   0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d,
		   0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a, 0x4a75,
		   0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e,
		   0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26,
		   0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f,
		   0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17,
		   0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0 };

   public static char getCRC1021(byte b[], int len) {
	  char crc = 0;
	  byte hb = 0;
	  int j = 0;
	  int index;
	  while (len-- != 0) {
		  hb = (byte) (crc / 256);
	  	index = ((hb ^ b[j]) & 0xff);
	  	crc <<= 8;
	  	crc ^= (TABLE1021[index]);
	  	j++;
	  }
	  return (crc);
   }

   public static int CRC_XModem(byte[] bytes){
       int crc = 0x00;          // initial value
       int polynomial = 0x1021;
       for (int index = 0 ; index< bytes.length; index++) {
           byte b = bytes[index];
           for (int i = 0; i < 8; i++) {
               boolean bit = ((b   >> (7-i) & 1) == 1);
               boolean c15 = ((crc >> 15    & 1) == 1);
               crc <<= 1;
               if (c15 ^ bit) crc ^= polynomial;
            }
       }
       crc &= 0xffff;
       return crc;
   }

    public static Date StrToDate(String str) {

       SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
       Date date = null;
        try {
			date = format.parse(str);
		} catch (java.text.ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
       return date;
    }

  	private final static float[] BUTTON_PRESSED = new float[] {
  	         1.1f, 0, 0, 0, -50,
  	         0, 1.1f, 0, 0, -50,
  	         0, 0, 1.1f, 0, -50,
  	         0, 0, 0, 1.5f, 0 };

  	private final static float[] BUTTON_RELEASED = new float[] {
  	          1, 0, 0, 0, 0,
  	          0, 1, 0, 0, 0,
  	          0, 0, 1, 0, 0,
  	         0, 0, 0, 1, 0 };

  	private static final OnTouchListener touchListener = new OnTouchListener(){
        @SuppressWarnings("deprecation")
		public boolean onTouch(View v, MotionEvent event){
            if(event.getAction() == MotionEvent.ACTION_DOWN) {
                v.getBackground().setColorFilter(new ColorMatrixColorFilter(BUTTON_PRESSED));
                v.setBackgroundDrawable(v.getBackground());
            }else if(event.getAction() == MotionEvent.ACTION_UP) {
                v.getBackground().setColorFilter(new ColorMatrixColorFilter(BUTTON_RELEASED));
                v.setBackgroundDrawable(v.getBackground());
            }
            return false;
        }
    };

    public static void setButtonStateChangeListener(View v) {
        v.setOnTouchListener(touchListener);
    }

    public static boolean IsHaveSdCard(){
    	String status = Environment.getExternalStorageState();
    	if (status.equals(Environment.MEDIA_MOUNTED)) 	{
    	   return true;
    	}else{
    	   return false;
    	}
    }

    public static boolean CreateDir(String dirpath){
    	if(IsHaveSdCard()){
    		File destDir = new File(dirpath);
    		if (!destDir.exists()) {
    			destDir.mkdirs();
    		}
    		return true;
    	}else{
    		return false;
    	}
    }

    public static String getFileName(String apath){
    	/*
        int start=apath.lastIndexOf("/");
        int end=apath.lastIndexOf(".");
        if(start!=-1 && end!=-1){
            return apath.substring(start+1,end);
        }else{
            return null;
        }
        */
    	int start=apath.lastIndexOf("/");
        if(start!=-1){
            return apath.substring(start+1);
        }else{
            return null;
        }
    }

    /**
	 * make true current connect service is wifi
	 * @param mContext
	 * @return
	 */
    public static boolean IsWifi(Context mContext) {
		ConnectivityManager connectivityManager = (ConnectivityManager) mContext.getSystemService(Context.CONNECTIVITY_SERVICE);
		NetworkInfo activeNetInfo = connectivityManager.getActiveNetworkInfo();
		if (activeNetInfo != null
				&& activeNetInfo.getType() == ConnectivityManager.TYPE_WIFI) {
			return true;
		}
		return false;
	}

    public static boolean isNetworkConnected(Context context) {
		if (context != null) {
			ConnectivityManager mConnectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo mNetworkInfo = mConnectivityManager.getActiveNetworkInfo();
			if (mNetworkInfo != null) {
				return mNetworkInfo.isAvailable();
				}
		}
		return false;
	}

	public static void setWifi(Context context, boolean isEnable) {
		WifiManager mWm = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
		if(isEnable){
			if(!mWm.isWifiEnabled()){
				mWm.setWifiEnabled(true);
			}
		}else{
			if(mWm.isWifiEnabled()){
				mWm.setWifiEnabled(false);
			}
		}
	}

	public static boolean getWifi(Context context) {
		WifiManager mWm = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
		return mWm.isWifiEnabled();
	}

	public static void setMobileData(Context context, boolean enabled){
		ConnectivityManager conMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        Class<?> conMgrClass = null;
        Field iConMgrField = null;
        Object iConMgr = null;
        Class<?> iConMgrClass = null;
        Method setMobileDataEnabledMethod = null;

        try
        {
            conMgrClass = Class.forName(conMgr.getClass().getName());
            iConMgrField = conMgrClass.getDeclaredField("mService");
            iConMgrField.setAccessible(true);
            iConMgr = iConMgrField.get(conMgr);
            iConMgrClass = Class.forName(iConMgr.getClass().getName());
            int count = 0;
            Method[] methods = iConMgrClass.getMethods();
            for (Method m : methods){
                if (m.getName().contains("setMobileDataEnabled")){
                    Class<?>[] parameters = m.getParameterTypes();
                    count = parameters.length;
                    break;
                }
            }
            if (count < 2){
                setMobileDataEnabledMethod = iConMgrClass.getDeclaredMethod("setMobileDataEnabled", boolean.class);
            }else{
                Class[] cArg = new Class[2];
                cArg[0] = String.class;
                cArg[1] = Boolean.TYPE;
                setMobileDataEnabledMethod = iConMgrClass.getDeclaredMethod("setMobileDataEnabled", cArg);
            }
            setMobileDataEnabledMethod.setAccessible(true);
            if (count < 2){
                setMobileDataEnabledMethod.invoke(iConMgr, enabled);
            }else{
                Object[] pArg = new Object[2];
                pArg[0] = context.getPackageName();
                pArg[1] = enabled;
                setMobileDataEnabledMethod.invoke(iConMgr, pArg);
            }
       }catch (Exception e)
       {
           e.printStackTrace();
       }
    }

	public static  boolean getMobileDataStatus(Context context){
        ConnectivityManager conMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        Class<?> conMgrClass = null;
        Field iConMgrField = null;
        Object iConMgr = null;
        Class<?> iConMgrClass = null;
        Method getMobileDataEnabledMethod = null;

        try{
            conMgrClass = Class.forName(conMgr.getClass().getName());
            iConMgrField = conMgrClass.getDeclaredField("mService");
            iConMgrField.setAccessible(true);
            iConMgr = iConMgrField.get(conMgr);
            iConMgrClass = Class.forName(iConMgr.getClass().getName());
            getMobileDataEnabledMethod = iConMgrClass.getDeclaredMethod("getMobileDataEnabled");
            getMobileDataEnabledMethod.setAccessible(true);
            return (Boolean) getMobileDataEnabledMethod.invoke(iConMgr);
        }catch (Exception e){
            e.printStackTrace();
        }

        return false;
    }

	public static String getDeviceID(Context context){
		String imei =((TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE)).getDeviceId();
		//String IMEI =android.os.SystemProperties.get(android.telephony.TelephonyProperties.PROPERTY_IMEI)
		return imei;
	}

	public static boolean IsSupportNFC(Context context){
		if (NfcAdapter.getDefaultAdapter(context) == null) {
			return false;
		}
		return true;
	}

	public static void SaveDataToFile(String filename, byte[] data){
    	File f=new File(filename);
		if(f.exists()){
			f.delete();
		}
		new File(filename);
    	try {
			RandomAccessFile randomFile = new RandomAccessFile(filename, "rw");
			long fileLength = randomFile.length();
			randomFile.seek(fileLength);
			randomFile.write(data);
			randomFile.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
    }

    public static byte[] LoadDataFromFile(String filename){
    	File f=new File(filename);
		if(!f.exists()){
			return null;
		}
    	try {
			RandomAccessFile randomFile = new RandomAccessFile(filename, "rw");
			int fileLength = (int) randomFile.length();
			byte[] content=new byte[fileLength];
			randomFile.read(content);
			randomFile.close();
			return content;
		} catch (IOException e) {
			e.printStackTrace();
		}
    	return null;
    }
}
