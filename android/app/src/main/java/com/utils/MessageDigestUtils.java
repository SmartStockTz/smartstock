//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.utils;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.DESedeKeySpec;
import javax.crypto.spec.IvParameterSpec;

public final class MessageDigestUtils {
    public static int TDES_ECB = 1;
    public static int TDES_CBC = 2;

    public MessageDigestUtils() {
    }

    public static String encodeMD5(String var0) {
        try {
            return bytesToHexString(MessageDigest.getInstance("MD5").digest(var0.getBytes()));
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static final String encodeDES(String var0, String var1) {
        return bytesToHexString(encodeDES(var0.getBytes(), var1.getBytes()));
    }

    public static byte[] encodeDES(byte[] var0, byte[] var1) {
        SecureRandom var2 = new SecureRandom();
        DESKeySpec var4 = null;
        try {
            var4 = new DESKeySpec(var1);
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        }
        SecretKey var5 = null;
        try {
            var5 = SecretKeyFactory.getInstance("DES").generateSecret(var4);
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        Cipher var3;
        try {
            (var3 = Cipher.getInstance("DES")).init(1, var5, var2);
            return var3.doFinal(var0);
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static final String decodeDES(String var0, String var1) {
        return new String(decodeDES(hexStringToBytes(var0), var1.getBytes()));
    }

    public static byte[] decodeDES(byte[] var0, byte[] var1) {
        SecureRandom var2 = new SecureRandom();
        DESKeySpec var4 = null;
        try {
            var4 = new DESKeySpec(var1);
            SecretKey var5 = SecretKeyFactory.getInstance("DES").generateSecret(var4);
            Cipher var3;
            (var3 = Cipher.getInstance("DES")).init(2, var5, var2);
            return var3.doFinal(var0);
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String encodeTripleDES(String var0, String var1) {
        return encodeTripleDES(TDES_ECB, var0, var1);
    }

    public static byte[] encodeTripleDES(byte[] var0, byte[] var1) {
        return encodeTripleDES(TDES_ECB, var0, var1);
    }

    public static String encodeTripleDES(int var0, String var1, String var2) {
        return bytesToHexString(encodeTripleDES(var0, hexStringToBytes(var1), hexStringToBytes(var2)));
    }

    public static byte[] encodeTripleDES(int var0, byte[] var1, byte[] var2) {
        byte[] var3;
        if(var2.length == 16) {
            var3 = new byte[24];
            System.arraycopy(var2, 0, var3, 0, 16);
            System.arraycopy(var2, 0, var3, 16, 8);
        } else {
            var3 = var2;
        }

        DESedeKeySpec var5 = null;
        try {
            var5 = new DESedeKeySpec(var3);
            SecretKey var6 = SecretKeyFactory.getInstance("DESede").generateSecret(var5);
            Cipher var7 = null;
            if(var0 == TDES_ECB) {
                (var7 = Cipher.getInstance("DESede/ECB/NoPadding")).init(1, var6);
            } else if(var0 == TDES_CBC) {
                var7 = Cipher.getInstance("DESede/CBC/NoPadding");
                IvParameterSpec var4 = new IvParameterSpec(new byte[8]);
                var7.init(1, var6, var4);
            }

            return var7.doFinal(var1);
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidAlgorithmParameterException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String decodeTripleDES(String var0, String var1) {
        return decodeTripleDES(TDES_ECB, var0, var1);
    }

    public static byte[] decodeTripleDES(byte[] var0, byte[] var1) {
        return decodeTripleDES(TDES_ECB, var0, var1);
    }

    public static String decodeTripleDES(int var0, String var1, String var2) {
        return bytesToHexString(decodeTripleDES(var0, hexStringToBytes(var1), hexStringToBytes(var2)));
    }

    public static byte[] decodeTripleDES(int var0, byte[] var1, byte[] var2) {
        byte[] var3;
        if(var2.length == 16) {
            var3 = new byte[24];
            System.arraycopy(var2, 0, var3, 0, 16);
            System.arraycopy(var2, 0, var3, 16, 8);
        } else {
            var3 = var2;
        }

        DESedeKeySpec var5 = null;
        try {
            var5 = new DESedeKeySpec(var3);
            SecretKey var6 = SecretKeyFactory.getInstance("DESede").generateSecret(var5);
            Cipher var7 = null;
            if(var0 == TDES_ECB) {
                (var7 = Cipher.getInstance("DESede/ECB/NoPadding")).init(2, var6);
            } else if(var0 == TDES_CBC) {
                var7 = Cipher.getInstance("DESede/CBC/NoPadding");
                IvParameterSpec var4 = new IvParameterSpec(new byte[8]);
                var7.init(2, var6, var4);
            }

            return var7.doFinal(var1);
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidAlgorithmParameterException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String encodeBDK() {
        StringBuffer var0;
        (var0 = new StringBuffer()).append(RandomUtils.generateString(32, "0123456789ABCDEF"));
        return var0.toString();
    }

    public static String encodeBDK(String var0, String var1, String var2) {
        a(var0, var1, var2);
        StringBuffer var3;
        (var3 = new StringBuffer()).append(RandomUtils.generateString(32, "0123456789ABCDEF"));
        return var3.toString();
    }

    public static String encodeKSN() {
        StringBuffer var0;
        (var0 = new StringBuffer()).append(RandomUtils.generateString(14, "0123456789ABCDEF"));
        var0.append("0");
        var0.append("00000");
        return var0.toString();
    }

    public static String encodeKSN(String var0, String var1, String var2) {
        a(var0, var1, var2);
        StringBuffer var3;
        (var3 = new StringBuffer()).append(RandomUtils.generateString(14 - var2.length(), "0123456789ABCDEF"));
        var3.append(var2);
        var3.append("0");
        var3.append("00000");
        return var3.toString();
    }

    private static void a(String var0, String var1, String var2) {
        if(var0 != null && var0.length() == 4) {
            if(var1 != null && var1.length() == 4) {
                if(var2 == null || var2.length() < 5 || var2.length() > 14) {
                    throw new IllegalArgumentException("The device id lenght must be more than 4 digits and less than or equal to 14 digits");
                }
            } else {
                throw new IllegalArgumentException("The product id lenght must be 4 digits");
            }
        } else {
            throw new IllegalArgumentException("The vendor id lenght must be 4 digits");
        }
    }

    public static String bytesToHexString(byte[] var0) {
        StringBuilder var1 = new StringBuilder("");

        for(int var2 = 0; var2 < var0.length; ++var2) {
            String var3;
            if((var3 = Integer.toHexString(var0[var2] & 255)).length() < 2) {
                var1.append(0);
            }
            var1.append(var3);
        }

        return var1.toString().toLowerCase();
    }

    public static byte[] hexStringToBytes(String var0) {
        int var1 = (var0 = var0.toLowerCase()).length() / 2;
        char[] var5 = var0.toCharArray();
        byte[] var2 = new byte[var1];

        for(int var3 = 0; var3 < var1; ++var3) {
            int var4 = var3 * 2;
            var2[var3] = (byte)(a(var5[var4]) << 4 | a(var5[var4 + 1]));
        }

        return var2;
    }

    private static byte a(char var0) {
        return (byte)"0123456789abcdef".indexOf(var0);
    }

    public static void main(String[] var0) {
        try {
            System.out.println(encodeDES("abcddd", "aaaaaaaabbbbbbbbccccccccdddddddd"));
            System.out.println(decodeDES("86d990c9184772fb", "aaaaaaaabbbbbbbbccccccccdddddddd"));
            System.out.println(encodeTripleDES(TDES_ECB, "f45c3ee2666d50a8", "aaaaaaaabbbbbbbbccccccccdddddddd"));
            System.out.println(decodeTripleDES(TDES_ECB, "e94b4e62ebcc1919", "aaaaaaaabbbbbbbbccccccccdddddddd"));
        } catch (Exception var1) {
            var1.printStackTrace();
        }
    }
}
