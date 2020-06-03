//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.utils;

import java.util.Random;

public final class RandomUtils {
    public static final String CHAR_ALL = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public static final String CHAR_LETTER = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public static final String CHAR_NUMBER = "0123456789";
    public static final String CHAR_HEX = "0123456789ABCDEF";

    public RandomUtils() {
    }

    public static String generateString(int var0, String var1) {
        StringBuffer var2 = new StringBuffer();
        Random var3 = new Random();
        int var4 = var1.length();

        for(int var5 = 0; var5 < var0; ++var5) {
            var2.append(var1.charAt(var3.nextInt(var4)));
        }

        return var2.toString();
    }

    public static String generateHexString(int var0) {
        StringBuffer var1 = new StringBuffer();
        Random var2 = new Random();
        byte var3 = 16;

        for(int var4 = 0; var4 < var0; ++var4) {
            var1.append("0123456789ABCDEF".charAt(var2.nextInt(var3)));
        }

        return var1.toString();
    }
}
