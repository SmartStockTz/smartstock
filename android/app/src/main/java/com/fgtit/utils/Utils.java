package com.fgtit.utils;



import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.os.Environment;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;


/**
 * Created by lenovo on 2016/4/7.
 */
public class Utils {

    private static final String LOG_TAG = Utils.class.getSimpleName();

    private static final int BUFFER_LEN = 1024;

    private Utils(){
    }
    /**
     * Convert byte array to hex string
     * @param bytes
     * @return
     */
    public static String bytesToHex(byte[] bytes) {
        StringBuilder sbuf = new StringBuilder();
        for(int idx=0; idx < bytes.length; idx++) {
            int intVal = bytes[idx] & 0xff;
            if (intVal < 0x10) sbuf.append("0");
            sbuf.append(Integer.toHexString(intVal).toUpperCase());
        }
        return sbuf.toString();
    }

    /**
     * Get utf8 byte array.
     * @param str
     * @return  array of NULL if error was found
     */
    public static byte[] getUTF8Bytes(String str) {
        try { return str.getBytes("UTF-8"); } catch (Exception ex) { return null; }
    }

    /**
     * Load UTF8withBOM or any ansi text file.
     * @param filename
     * @return
     * @throws IOException
     */
    public static String loadFileAsString(String filename) throws IOException {
        final int BUFLEN=1024;
        BufferedInputStream is = new BufferedInputStream(new FileInputStream(filename), BUFLEN);
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream(BUFLEN);
            byte[] bytes = new byte[BUFLEN];
            boolean isUTF8=false;
            int read,count=0;
            while((read=is.read(bytes)) != -1) {
                if (count==0 && bytes[0]==(byte)0xEF && bytes[1]==(byte)0xBB && bytes[2]==(byte)0xBF ) {
                    isUTF8=true;
                    baos.write(bytes, 3, read-3); // drop UTF8 bom marker
                } else {
                    baos.write(bytes, 0, read);
                }
                count+=read;
            }
            return isUTF8 ? new String(baos.toByteArray(), "UTF-8") : new String(baos.toByteArray());
        } finally {
            try{ is.close(); } catch(Exception ex){}
        }
    }


    /**
     * Get IP address from first non-localhost interface
     * @param useIPv4  true=return ipv4, false=return ipv6
     * @return  address or empty string
     */
    public static String getIPAddress(boolean useIPv4) {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface intf : interfaces) {
                List<InetAddress> addrs = Collections.list(intf.getInetAddresses());
                for (InetAddress addr : addrs) {
                    if (!addr.isLoopbackAddress()) {
                        String sAddr = addr.getHostAddress();
                        //boolean isIPv4 = InetAddressUtils.isIPv4Address(sAddr);
                        boolean isIPv4 = sAddr.indexOf(':')<0;
                        if (useIPv4) {
                            if (isIPv4)
                                return sAddr;
                        } else {
                            if (!isIPv4) {
                                int delim = sAddr.indexOf('%'); // drop ip6 zone suffix
                                return delim<0 ? sAddr.toUpperCase() : sAddr.substring(0, delim).toUpperCase();
                            }
                        }
                    }
                }
            }
        } catch (Exception ex) { } // for now eat exceptions
        return "";
    }

    private final static char[] HEX = { '0', '1', '2', '3', '4', '5', '6', '7',
            '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };

    public static String toHexString(byte... d) {
        return (d == null || d.length == 0) ? "" : toHexString(d, 0, d.length);
    }

    public static String toHexString(byte[] d, int s, int n) {
        final char[] ret = new char[n * 2];
        final int e = s + n;

        int x = 0;
        for (int i = s; i < e; ++i) {
            final byte v = d[i];
            ret[x++] = HEX[0x0F & (v >> 4)];
            ret[x++] = HEX[0x0F & v];
        }
        return new String(ret);
    }

    /**
     * 字符串BCD压缩(输出字节数组) "123456" ->{0x12 , 0x34 , 0x56}
     * @param s
     * @return
     */
    public static byte[] str2cbcd(String s) {
        if (s.length() % 2 != 0) {
            s = "0" + s;
        }
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        char[] cs = s.toCharArray();
        for (int i = 0; i < cs.length; i += 2) {
            int high = cs[i] - 48;
            int low = cs[i + 1] - 48;
            baos.write(high << 4 | low);
        }
        return baos.toByteArray();
    }

    /**
     * 字符串BCD压缩(输出字符串) "123456" -> " 4V"
     * @param in
     * @return
     */
    public static String hex2bcd(String in){
        int i ;
        byte[] hex = in.getBytes();
        int blen = in.length()/2;
        byte[] bcd = new byte[blen];
        i = 0;
        while ( i < blen )
        {
            bcd[i] = (byte) ((0x0F & Obtainc( hex[2*i] ) ) << 4);
            bcd[i] |= Obtainc( hex[2*i+1] ) & 0x0f ;
            i++;
        }
        return new String(bcd);
//        return bytesToHex(bcd);
    }
    public static byte Obtainc(byte s){
        return (byte)(s >= 'A' && s <='F' ? s-'A'+10 :(s >= 'a' && s <='f' ? s-'a'+10 : s-'0' ) );
    }


    /**
     * 将字符串转换为字节数组 "123456" -> {0x12 , 0x34 , 0x56}
     * @param hex
     * @return
     */
    public static byte[] hexStringToByte(String hex) {
        if (hex == null){
            return null;
        }
        hex = hex.toUpperCase();
        if(hex.length()%2 != 0){
            return new byte[0];
        }
        int len = (hex.length() / 2);
        byte[] result = new byte[len];
        char[] achar = hex.toCharArray();
        for (int i = 0; i < len; i++) {
            int pos = i * 2;
            result[i] = (byte) (toByte(achar[pos]) << 4 | toByte(achar[pos + 1]));
        }
        return result;
    }
    private static byte toByte(char c) {
        byte b = (byte) "0123456789ABCDEF".indexOf(c);
        return b;
    }

    /**
     * MD5 参数为字符串
     * @param s
     * @return
     */
    public final static String MD5(String s) {
        char hexDigits[]="0123456789ABCDEF".toCharArray();
        try {
            byte[] btInput = s.getBytes();
            // 获得MD5摘要算法的 MessageDigest 对象
            MessageDigest mdInst = MessageDigest.getInstance("MD5");
            // 使用指定的字节更新摘要
            mdInst.update(btInput);
            // 获得密文
            byte[] md = mdInst.digest();
            // 把密文转换成十六进制的字符串形式
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * MD5 参数为字节数组
     * @param btInput
     * @return
     */
    public final static byte[] MD5(byte[] btInput) {
        char hexDigits[]="0123456789ABCDEF".toCharArray();
        try {
            // 获得MD5摘要算法的 MessageDigest 对象
            MessageDigest mdInst = MessageDigest.getInstance("MD5");
            // 使用指定的字节更新摘要
            mdInst.update(btInput);
            // 获得密文
            byte[] md = mdInst.digest();
            // 把密文转换成十六进制的字符串形式
            int j = md.length;
            byte str[] = new byte[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                str[k++] = (byte)hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = (byte)hexDigits[byte0 & 0xf];
            }
            return str;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 解密PIN第一步 bcd压缩57域数据 ，并做md5运算，取中间16字节返回
     * @param field57 57域数据（不包括长度字段）
     * @return
     */
    public static byte[] decryptPINstep1(String field57){
        //经过bcd压缩的57域数据
        String field57Compress = hex2bcd(field57);
        //MD5运算后数据
        String field57MD5 = MD5(field57Compress).substring(8, 24);

        return hexStringToByte(field57MD5);


    }

    /**
     * 解密PIN第二步 对MAC运算后的数据的前三个字节与后台返回的pin数据的前三字节和固定的三个字节做异或运算，将得到的三个字节转换成十进制返回
     * @param MAC psam卡做MAC运算后的数据
     * @param pin 后台返回的pin加密数据
     * @return
     */
    public static String decryptPINstep2(String MAC , String pin){
        byte[] MACByteArr = hexStringToByte(MAC.substring(0, 6));
        byte[] pinByteArr = hexStringToByte(pin.substring(0 , 6));
        byte[] fixedByteArr = {0x37 , (byte)0xA4 , (byte)0xFB};
        byte[] resultByteArr = XOR(fixedByteArr, XOR(MACByteArr, pinByteArr));
        String result = change(resultByteArr);
        return result;
    }

    /**
     * 两个数组异或运算，两个数组必须一样长
     * @param a
     * @param b
     * @return
     */
    public static byte[] XOR(byte[] a , byte[] b){
        if(a.length != b.length){
            return null;
        }
        byte[] result = new byte[a.length];

        for(int i = 0 ; i <a.length ; i++){
            result[i] = (byte)(a[i]^b[i]);
        }
        return result;
    }


    public static String change(byte[] data){
        StringBuffer sb = new StringBuffer();
        for(int i = 0 ; i < data.length ; i++){
            if(data[i] < 10)
                sb.append("0" + data[i]);
            else
                sb.append(data[i]);
        }
        return sb.toString();
    }

    /**
     * 连接两个字节数组，返回连接后的数组
     * @param a
     * @param b
     * @return
     */
    public static byte[] concatByteArray(byte[] a , byte[] b){
        int length = a.length + b.length;
        byte[] result = new byte[length];
        int i ;
        for( i = 0 ; i < a.length ; i++){
            result[i] = a[i];
        }
        for(int j = 0 ; j < b.length ; j++ , i++){
            result[i] = b[j];
        }
        return result;
    }

    /**
     * 复制assets文件夹下文件到SD卡
     * @param context
     * @param fileName
     */
    public static void copyFileFromAssets2SDCard(Context context , String fileName){
        AssetManager assetManager = context.getAssets();
        try {
            InputStream is = assetManager.open(fileName);
            File out = new File(Environment.getExternalStorageDirectory(), fileName);
            byte[] buffer = new byte[BUFFER_LEN];
            FileOutputStream fos = new FileOutputStream(out);
            int read = 0;
            while ((read = is.read(buffer, 0, BUFFER_LEN)) >= 0) {
                fos.write(buffer, 0, read);
            }
            fos.flush();
            fos.close();
            is.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取字符串的长度,以字符串的形式返回,第二个参数表示返回的字符串的长度,
     * 例如 getStringLength("adsgd" , 8) ->  "00000005"
     * @param str
     * @param resultLength
     * @return
     */
    public static String getStringLength(String str , int resultLength){
        int len  = str.length();
        String sjiachun = "1E"+ (resultLength);
        BigDecimal db = new BigDecimal(sjiachun);
        if(db == null){
            return null;
        }
        BigDecimal temp = db.add(new BigDecimal(len));
        String result = temp.toPlainString();
        if(result != null){
            return result.substring(1 , resultLength+1);
        }
        return null;
    }


    /**
     * 将String转换成InputStream
     * @param in
     * @return
     * @throws Exception
     */
    public static InputStream StringTOInputStream(String in) throws Exception {
        ByteArrayInputStream is = new ByteArrayInputStream(in.getBytes("GBK"));
        return is;
    }

    /**
     * 获取时间，如果isCentury为true返回格式为CCYYMMDDHHMMSS CC表示世纪
     *          如果isCentury为false返回格式为YYYYMMDDHHMMSS
     * @param isCentury
     * @return
     */
    public static String getDateAndTime(boolean isCentury){
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat dateformat1=new SimpleDateFormat("yyyyMMddHHmmss");
        String date = dateformat1.format(cal.getTime());
        if(isCentury)
            return date.replaceFirst("0", "1");
        else
            return date;
    }

    /**
     * 获取日期
     * @return
     */
    public static String getDate(){
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat dateformat1=new SimpleDateFormat("yyyyMMdd");
        String date = dateformat1.format(cal.getTime());
        return date;
    }

    /**
     * 获取时间
     * @return
     */
    public static String getTime(){
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat dateformat1=new SimpleDateFormat("HHmmss");
        String time = dateformat1.format(cal.getTime());
        return time;
    }

    public static String packageData(String data){
        String headStr = "\u00018030\u0001";
        String endStr = "\u0001";
        String result = headStr + data.substring(0 , 4) + "|" + data + endStr;
        return result;
    }

    public static String addZeroLeft(int length , String content){
        StringBuffer sb = new StringBuffer();
        for(int i = 0 ; i < (length-content.length()) ; i++){
            sb.append('0');
        }
        sb.append(content);
        return sb.toString();
    }

    public static String addZeroRight(int length , String content){
        StringBuffer sb = new StringBuffer();
        sb.append(content);
        for(int i = 0 ; i < (length-content.length()) ; i++){
            sb.append('0');
        }
        return sb.toString();
    }

    public static int stringMultiply(String in , int times){
        if(in.contains(".")){
            float inFloat = Float.parseFloat(in);
            return (int) (inFloat*times);
        }
        int inInt = Integer.parseInt(in);
        return inInt*times;
    }

    public static String intToHex(int in){
        return Integer.toHexString(in);
    }

    public static String unpackage(String data){
        return data.substring(11 , data.length()-1);
    }

    //在长度为单数的字符串前面补0,使其长度成为双数
    public static String getDoubleString(String data){
        int len = data.length();
        if (len%2 == 0){
            return data;
        }else{
            return "0" + data;
        }
    }

    //
    public static Bitmap adjustPhotoRotation(Bitmap bm, final int orientationDegree){
        Matrix m = new Matrix();
        m.setRotate(orientationDegree, (float) bm.getWidth() / 2, (float) bm.getHeight() / 2);
        m.postScale(2f,2f); //长和宽放大缩小的比例
        try {
            Bitmap bm1 = Bitmap.createBitmap(bm, 0, 0, bm.getWidth(), bm.getHeight(), m, true);
            return bm1;
        } catch (OutOfMemoryError ex) {
            ex.printStackTrace();
        }
        return null;
    }

    private static byte[] changeByte(int data) {
        byte b4 = (byte) ((data) >> 24);
        byte b3 = (byte) (((data) << 8) >> 24);
        byte b2 = (byte) (((data) << 16) >> 24);
        byte b1 = (byte) (((data) << 24) >> 24);
        byte[] bytes = { b1, b2, b3, b4 };
        return bytes;
    }

    public static byte[] toBmpByte(int width, int height, byte[] data) {
        byte[] buffer = null;
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            DataOutputStream dos = new DataOutputStream(baos);

            int bfType = 0x424d;
            int bfSize = 54 + 1024 + width * height;
            int bfReserved1 = 0;
            int bfReserved2 = 0;
            int bfOffBits = 54 + 1024;

            dos.writeShort(bfType);
            dos.write(changeByte(bfSize), 0, 4);
            dos.write(changeByte(bfReserved1), 0, 2);
            dos.write(changeByte(bfReserved2), 0, 2);
            dos.write(changeByte(bfOffBits), 0, 4);

            int biSize = 40;
            int biWidth = width;
            int biHeight = height;
            int biPlanes = 1;
            int biBitcount = 8;
            int biCompression = 0;
            int biSizeImage = width * height;
            int biXPelsPerMeter = 0;
            int biYPelsPerMeter = 0;
            int biClrUsed = 256;
            int biClrImportant = 0;

            dos.write(changeByte(biSize), 0, 4);
            dos.write(changeByte(biWidth), 0, 4);
            dos.write(changeByte(biHeight), 0, 4);
            dos.write(changeByte(biPlanes), 0, 2);
            dos.write(changeByte(biBitcount), 0, 2);
            dos.write(changeByte(biCompression), 0, 4);
            dos.write(changeByte(biSizeImage), 0, 4);
            dos.write(changeByte(biXPelsPerMeter), 0, 4);
            dos.write(changeByte(biYPelsPerMeter), 0, 4);
            dos.write(changeByte(biClrUsed), 0, 4);
            dos.write(changeByte(biClrImportant), 0, 4);

            byte[] palatte = new byte[1024];
            for (int i = 0; i < 256; i++) {
                palatte[i * 4] = (byte) i;
                palatte[i * 4 + 1] = (byte) i;
                palatte[i * 4 + 2] = (byte) i;
                palatte[i * 4 + 3] = 0;
            }
            dos.write(palatte);

            dos.write(data);
            dos.flush();
            buffer = baos.toByteArray();
            dos.close();
            baos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return buffer;
    }

}
