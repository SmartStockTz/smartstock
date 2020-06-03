package com.fgtit.data;

public class wsq {
	private static wsq mCom=null;
	
	public static wsq getInstance(){
		if(mCom==null){
			mCom=new wsq();
		}
		return mCom;
	}
	
	public native int RawToWsq(byte[] inpdata,int inpsize,int width,int height,byte[] outdata,int[] outsize,float bitrate);
	public native int WsqToRaw(byte[] inpdata,int inpsize,byte[] outdata,int[] outsize);
	
	static {
		System.loadLibrary("wsq");
	}
}
