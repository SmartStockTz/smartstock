package com.utils;

import android.util.Log;

/**
 * Created by Shunhao Luo on 2016/3/25.
 */
public class L {

    //日志是否可用的控制参数
    private static boolean enableWriteLog = true;

    //日志的Tag
    private static String LOG_TAG;

    private L(){
    }



    /**
     * 设置日志Tag
     * @param LogTag 日志的Tag
     */
    public static void setLogTag(String LogTag){
        LOG_TAG = LogTag;
    }

    /**
     * 设置日志是否可用
     * @param isON 日志是否可用
     */
    public static void setLogEnable(boolean isON){
        enableWriteLog = isON;
    }

    /**
     * 打印信息类型的日志
     * @param log 需要输出的日志
     */
    public static void i(String tag, String log){
        Log(Log.INFO , tag , log);
    }

    /**
     * 打印调试类型的日志
     * @param log 需要打印的日志
     */
    public static void d(String tag, String log){
        Log(Log.DEBUG , tag , log);
    }

    /**
     * 打印警告类型的日志
     * @param log 需要打印的日志
     */
    public static void w(String tag, String log){
        Log(Log.WARN , tag , log);
    }

    /**
     * 打印错误类型的日志
     * @param log 需要打印的日志
     */
    public static void e(String tag, String log){
        Log(Log.ERROR , tag , log);
    }

    /**
     * 打印信息类型的日志
     * @param log 需要输出的日志
     */
    public static void i(String log){
        Log(Log.INFO , LOG_TAG , log);
    }

    /**
     * 打印调试类型的日志
     * @param log 需要打印的日志
     */
    public static void d(String log){
        Log(Log.DEBUG , LOG_TAG , log);
    }

    /**
     * 打印警告类型的日志
     * @param log 需要打印的日志
     */
    public static void w(String log){
        Log(Log.WARN , LOG_TAG , log);
    }

    /**
     * 打印错误类型的日志
     * @param log 需要打印的日志
     */
    public static void e(String log){
        Log(Log.ERROR , LOG_TAG , log);
    }

    private static void Log(int priority , String LOG_TAG , String log){
        if(!enableWriteLog)
            return;
        if(LOG_TAG == null){
            LOG_TAG = "LogTag";
        }
        Log.println(priority , LOG_TAG , log);
    }
}
