package com.fgtit.fpcore;

import com.fgtit.data.Conversions;

public class FPMatch {

	private static FPMatch mMatch=null;
	
	public static FPMatch getInstance(){
		if(mMatch==null){
			mMatch=new FPMatch();
		}
		return mMatch;
	}

	public native int InitMatch( int inittype, String initcode);
	public native int MatchTemplate( byte[] piFeatureA, byte[] piFeatureB);
	
	public int MatchTemplateFull(byte[] piFeatureA, byte[] piFeatureB,int score){
		int at=Conversions.getInstance().GetDataType(piFeatureA);
		int bt=Conversions.getInstance().GetDataType(piFeatureB);
		if((at==1)&&(bt==1)){
			int sc=MatchTemplate(piFeatureA,piFeatureB);
			if(sc>=score)
				return sc;
			byte tmpFeature[]=new byte[512];
			Conversions.getInstance().StdChangeCoord(piFeatureB, 256, tmpFeature,3);
			return MatchTemplate(piFeatureA,tmpFeature);
		}else{
			byte adat[]=new byte[512];
			byte bdat[]=new byte[512];			
			if(at==1){
				System.arraycopy(piFeatureA, 0, adat, 0, 256);
			}else{
				byte tmp[]=new byte[512];
				Conversions.getInstance().IsoToStd(2,piFeatureA,tmp);
				System.arraycopy(tmp, 0, adat, 0, 256);
			}
			if(bt==1){
				System.arraycopy(piFeatureB, 0, bdat, 0, 256);
			}else{
				byte tmp[]=new byte[512];
				Conversions.getInstance().IsoToStd(2,piFeatureB,tmp);				
				System.arraycopy(tmp, 0, bdat, 0, 256);
			}			
			int sc=MatchTemplate(adat,bdat);
			if(sc>=score)
				return sc;
			byte tmpFeature[]=new byte[512];
			Conversions.getInstance().StdChangeCoord(bdat, 256, tmpFeature,3);
			return MatchTemplate(adat,tmpFeature);
		}
	}
	
	static {
		System.loadLibrary("fgtitalg");
		System.loadLibrary("fpcore");
	}
}
