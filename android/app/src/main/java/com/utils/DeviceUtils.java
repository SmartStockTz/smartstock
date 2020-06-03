//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.utils;

import android.content.Context;
import android.media.AudioRecord;
import android.os.Build;
import android.os.Build.VERSION;
import android.telephony.TelephonyManager;

public final class DeviceUtils {
    public DeviceUtils() {
    }

    public static String getManufacturer() {
        return Build.MANUFACTURER;
    }

    public static String getModel() {
        return Build.MODEL;
    }

    public static String getReleaseVersion() {
        return VERSION.RELEASE;
    }

    public static int getSDKVersion() {
        return VERSION.SDK_INT;
    }

    public static String getDeviceId(Context var0) {
        return ((TelephonyManager)var0.getSystemService("phone")).getDeviceId();
    }

    public static String getDeviceSoftwareVersion(Context var0) {
        return ((TelephonyManager)var0.getSystemService("phone")).getDeviceSoftwareVersion();
    }

    public static boolean isMICAvailable() {
        boolean var0 = false;

        try {
            int var3;
            if((var3 = AudioRecord.getMinBufferSize(8000, 16, 2)) <= 0) {
                var3 = 2096;
            }

            AudioRecord var1;
            if((var1 = new AudioRecord(1, 8000, 16, 2, var3)).getState() == 1) {
                var0 = true;
            } else {
                var0 = false;
            }

            var1.release();
        } catch (Exception var2) {
            var0 = false;
        }

        return var0;
    }

    public static boolean isEmulator(Context var0) {
        return "000000000000000".equalsIgnoreCase(getDeviceId(var0));
    }
}
