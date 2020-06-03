package com.vanstone.trans.tools;

import android.content.Context;
import android.widget.Toast;

import com.vanstone.utils.CommonConvert;

import java.io.File;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.io.StringWriter;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.Locale;

/**
 *@preserve all
 */
public class MyLog{

	public static boolean logFlag = true;
	public static final String LOG_PATH = "/mnt/sdcard";
	public static final String LOG_FILE_TITLE = "Debug";
	public static boolean isLogFlag() {
		return logFlag;
	}
	public static void setLogFlag(boolean flag) {
		logFlag = flag;
	}
	public static void ByteLog(String path, Throwable e, String error_desc, int arg1, int agr2)
	{


	}
	public static void writeLog(byte[]logBuf)
	{
		 writeLog(CommonConvert.BytesToString(logBuf));
	}
	public static void writeLog(Throwable e)
	{
		StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        writeLog(sw.toString());
	}
	public static void writeLog(String data)
	{
		if(logFlag)
		{
			String fileName = LOG_FILE_TITLE+new SimpleDateFormat("yyyyMMdd", Locale.CHINESE).
					format(new Date(System.currentTimeMillis()));
			data = "["+new SimpleDateFormat("yyyy-MM-dd HH:mm:ss SSS", Locale.CHINESE).
					format(new Date(System.currentTimeMillis()))+"]" + data +"\r\n";
			//android.util.Log.i("INFO", data);
			try
			{
				File file = new File(LOG_PATH+"/"+fileName);
				if(!file.exists())
				{
					file.createNewFile();
				}
				RandomAccessFile raf = new RandomAccessFile(file, "rw");
				raf.seek(file.length());
				raf.write(CommonConvert.StringToBytes(data));
				raf.close();
			}catch(Exception e)
			{
				e.printStackTrace();
			}
		}
	}

    public static void showToast(Context context, String log){
    	if (logFlag) {
			Toast.makeText(context, log, Toast.LENGTH_LONG).show();
		}
    }

    public static void showLog(String log){
    	if (logFlag) {
			android.util.Log.e("vantonelog", log);
		}
    }

}
