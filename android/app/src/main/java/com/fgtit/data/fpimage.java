package com.fgtit.data;

public class fpimage {
	private static fpimage mfpi=null;
	
	public static fpimage getInstance(){
		if(mfpi==null){
			mfpi=new fpimage();
		}
		return mfpi;
	}

	public native void Contrast(byte[] ipImage,int wImageSize,int Amount);
	public native void Lightness(byte[] ipImage,int wImageSize,int Amount);
	public native void Gamma(byte[] ipImage,int wImageSize,float Amount);
	public native void ImageProcess(byte[] ipImage,int width,int height);
	
	
	static {
		System.loadLibrary("fpmerge");
	}
}
