package com.vanstone.trans.tools;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Util {
    public static void memset(byte[] buf, int value, int size) {
        int i;

        for (i = 0; i < size; i++)
            buf[i] = (byte) value;
    }

    public static String Bcd2Asc(byte[] bcd) {
        int i, len;
        String asc = "";

        len = bcd.length;
        for (i = 0; i < len; i++)
            asc += String.format("%02X", bcd[i]);

        return asc;
    }

    public static byte[] Asc2Bcd(String asc) {
        int i, len;
        byte[] ascBytes;
        byte[] bcd;
        byte ch;

        ascBytes = asc.getBytes();
        len = ascBytes.length / 2;
        bcd = new byte[len];

        for (i = 0; i < len; i++) {
            ch = ascBytes[2 * i];

            if ((ch >= 'a') && (ch <= 'f'))
                bcd[i] = (byte)(ch - 'a' + 10);
            else if ((ch >= 'A') && (ch <= 'F'))
                bcd[i] = (byte)(ch - 'A' + 10);
            else
                bcd[i] = (byte)(ch - '0');

            bcd[i] *= 16;

            ch = ascBytes[2 * i + 1];

            if ((ch >= 'a') && (ch <= 'f'))
                bcd[i] += (byte)(ch - 'a' + 10);
            else if ((ch >= 'A') && (ch <= 'F'))
                bcd[i] += (byte)(ch - 'A' + 10);
            else
                bcd[i] += (byte)(ch - '0');
        }

        return bcd;
    }

    public static byte[] Long2Bcd(int value, int len) {
        byte[] bcd = new byte[len];
        int ch;

        while (len-- > 0) {
            ch = value % 100;
            value /= 100;

            bcd[len] = (byte)(((ch / 10) << 4) | (ch % 10));
        }

        return bcd;
    }

    public static int Bcd2Long(byte[] bcd, int offset, int len) {
        int value, ch;
        int i;

        value = 0;
        for (i = 0; i < len; i++) {
            ch = ((bcd[offset + i] >> 4) & 0x0F) * 10;
            ch += bcd[offset + i] & 0x0F;

            value *= 100;
            value += ch;
        }

        return value;
    }

    public static int memcmp(byte[] src, byte[] dst, int len) {
        int i;

        for (i = 0; i < len; i++) {
            if (src[i] < dst[i])
                return -1;
            else if (src[i] > dst[i])
                return 1;
        }

        return 0;
    }


    public static void Sleep(int ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }


    public static String MyGetDateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHHmmss");
        return sdf.format(new Date());
    }

    public static byte[] subBytes(byte[] src, int begin, int count) {
        byte[] bs = new byte[count];
        System.arraycopy(src, begin, bs, 0, count);
        return bs;
    }
    public static void writeFileDataobject(File file, Object Mobject, boolean mode) {
        ObjectOutputStream out = null;
        try {
            if (mode) {
                FileOutputStream fout = new FileOutputStream(file, true);
                if (file.length() < 1) {
                    out = new ObjectOutputStream(fout);
                } else {
                    out = new MyObjectWrite(fout);
                }
            } else {
                FileOutputStream fout = new FileOutputStream(file);
                out = new ObjectOutputStream(fout);
            }
            out.writeObject(Mobject);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static class MyObjectWrite extends ObjectOutputStream {

        public MyObjectWrite(OutputStream out) throws IOException {
            super(out);
        }

        @Override
        protected void writeStreamHeader() throws IOException {
            super.reset();
        }
    }

}
