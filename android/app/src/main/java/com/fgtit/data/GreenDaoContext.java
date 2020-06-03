package com.fgtit.data;

import android.content.Context;
import android.content.ContextWrapper;
import android.database.DatabaseErrorHandler;
import android.database.sqlite.SQLiteDatabase;
import android.os.Environment;

import com.utils.L;

import java.io.File;
import java.io.IOException;

/**
 * Created by Doraemon
 * Date: 16/5/12
 * Time: 09:22
 * Summary:该类主要用于基于GreenDao框架自定义数据库路径
 */
public class GreenDaoContext extends ContextWrapper {

    private String currentUserId = "GreenDaoContext";

    public GreenDaoContext(Context base) {
        super(base);
    }

    /**
     * 获得数据库路径，如果不存在，则创建对象
     *
     * @param dbName
     */
    @Override
    public File getDatabasePath(String dbName) {
        File sdDir = null;
        boolean isFileCreateSuccess = false;
        boolean sdCardExist = Environment.getExternalStorageState()
                .equals(android.os.Environment.MEDIA_MOUNTED); //判断sd卡是否存在
        if (sdCardExist)
        {
            sdDir = Environment.getExternalStorageDirectory();//获取跟目录
            StringBuffer buffer = new StringBuffer();
            buffer.append(sdDir.getPath());
            buffer.append(File.separator);
            buffer.append("Android");
            buffer.append(File.separator);
//            buffer.append("test");
            buffer.append(this.getPackageName());
            buffer.append(File.separator);
            File dirFile = new File(buffer.toString());
            if (!dirFile.exists()){
                dirFile.mkdirs();
            }
            buffer.append(File.separator);
            buffer.append(dbName);

            // 判断文件是否存在，不存在则创建该文件
            File dbFile = new File(buffer.toString());
            L.i("dbFile:" + dbFile.toString());
            if (!dbFile.exists()) {
                L.i("!dbFile.exists()");
                try {
                    isFileCreateSuccess = dbFile.createNewFile();// 创建文件
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                L.i("dbFile.exists()");
                isFileCreateSuccess = true;
            }
            // 返回数据库文件对象
            if (isFileCreateSuccess){
                return dbFile;
            } else {
                return super.getDatabasePath(dbName);
            }
        }else{
            return super.getDatabasePath(dbName);
        }
    }

    /**
     * 重载这个方法，是用来打开SD卡上的数据库的，android 2.3及以下会调用这个方法。
     *
     * @param name
     * @param mode
     * @param factory
     */
    @Override
    public SQLiteDatabase openOrCreateDatabase(String name, int mode,
                                               SQLiteDatabase.CursorFactory factory) {
        SQLiteDatabase result = SQLiteDatabase.openOrCreateDatabase(getDatabasePath(name), factory);
        return result;
    }

    /**
     * Android 4.0会调用此方法获取数据库。
     *
     * @param name
     * @param mode
     * @param factory
     * @param errorHandler
     * @see android.content.ContextWrapper#openOrCreateDatabase(java.lang.String, int,
     * android.database.sqlite.SQLiteDatabase.CursorFactory,
     * android.database.DatabaseErrorHandler)
     */
    @Override
    public SQLiteDatabase openOrCreateDatabase(String name, int mode, SQLiteDatabase.CursorFactory factory,
                                               DatabaseErrorHandler errorHandler) {
        SQLiteDatabase result = SQLiteDatabase.openOrCreateDatabase(getDatabasePath(name), factory);

        return result;
    }

}
