//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.utils;

public final class StringUtils {
    public StringUtils() {
    }

    public static String convertHexToBinary(String var0) {
        String var1 = Long.toBinaryString(Long.parseLong(var0, 16));
        int var4 = var0.length() * 4;
        StringBuffer var2 = new StringBuffer();
        var4 -= var1.length();

        for(int var3 = 1; var3 <= var4; ++var3) {
            var2.append("0");
        }

        return var2.toString() + var1;
    }

    public static byte[] convertHexToBytes(String var0) {
        int var1 = (var0 = var0.toUpperCase()).length() / 2;
        char[] var5 = var0.toCharArray();
        byte[] var2 = new byte[var1];

        for(int var3 = 0; var3 < var1; ++var3) {
            char var4 = var5[var3 * 2];
            int var10002 = (byte)"0123456789ABCDEF".indexOf(var4) << 4;
            var4 = var5[var3 * 2 + 1];
            var2[var3] = (byte)(var10002 | (byte)"0123456789ABCDEF".indexOf(var4));
        }

        return var2;
    }

    public static String convertBytesToHex(byte[] var0) {
        StringBuilder var1 = new StringBuilder("");

        for(int var2 = 0; var2 < var0.length; ++var2) {
            String var3;
            if((var3 = Integer.toHexString(var0[var2] & 255)).length() < 2) {
                var1.append(0);
            }

            var1.append(var3);
        }

        return var1.toString().toUpperCase();
    }
}
