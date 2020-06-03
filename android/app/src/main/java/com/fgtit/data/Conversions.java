package com.fgtit.data;

import android.util.Base64;

public class Conversions {

	private static Conversions mCom=null;

	public static Conversions getInstance(){
		if(mCom==null){
			mCom=new Conversions();
		}
		return mCom;
	}

	public native int StdToIso(int itype,byte[] input,byte[] output);
	public native int IsoToStd(int itype,byte[] input,byte[] output);
	public native int GetDataType(byte[] input);
	public native int StdChangeCoord(byte[] input,int size,byte[] output,int dk);

	public byte[] ToIsoBytes(byte[] input, int dk){
		switch(GetDataType(input)){
			case 1:{
				byte mTmpData[]=new byte[512];
				byte mIsoData[]=new byte[512];
				StdChangeCoord(input, 256, mTmpData, dk);
				StdToIso(2,mTmpData,mIsoData);
				return mIsoData;
			}
			case 2:{
				byte mTmpData1[]=new byte[512];
				byte mTmpData2[]=new byte[512];
				byte mIsoData[]=new byte[512];
				IsoToStd(1,input,mTmpData1);
				StdChangeCoord(mTmpData1, 256, mTmpData2, dk);
				StdToIso(2,mTmpData2,mIsoData);
				return mIsoData;
			}
			case 3:
				return IsoChangeOrientationBytes(input,dk);
		}
		return null;
	}

	private byte[] IsoChangeOrientationBytes(byte[] input, int dk){
		int dt=GetDataType(input);
		if(dt==3){
			byte output[] =new byte[512];
			byte stddat[]=new byte[512];
			byte crddat[]=new byte[512];
			IsoToStd(2,input,stddat);
			StdChangeCoord(stddat,256,crddat,dk);
			StdToIso(2,crddat,output);
			return Base64.encode(output,0,378, Base64.DEFAULT);
		}
		return null;
	}

	public byte[] ToIsoBytes(byte[] input){
		if(GetDataType(input) == 1){
			byte[] mTmpData = new byte[256];
			byte[] mIsoData = new byte[512];
			StdChangeCoord(input, 256, mTmpData, 3);
			StdToIso(2, mTmpData, mIsoData);
			return mIsoData;
		}else{
			return input;
		}
	}
	static {
		System.loadLibrary("conversions");
	}
}
