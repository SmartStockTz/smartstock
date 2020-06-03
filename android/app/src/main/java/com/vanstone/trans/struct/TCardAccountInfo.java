package com.vanstone.trans.struct;

import com.vanstone.base.interfaces.StructInterface;

public class TCardAccountInfo implements StructInterface {
	public byte cardMode;
	public byte[] MainAcc = new byte[22];
	public byte[] ExpDate = new byte[4];
	public byte[] HoldCardName = new byte[46];
	public byte	bPanSeqNoOk;				// ADVT case 43 [3/31/2006 Tommy]
	public byte	ucPanSeqNo;					// App. PAN sequence number
	public byte Track1Len;
	public byte[] Track1 = new byte[88];
	public byte Track2Len;
	public byte[] Track2 = new byte[4+37];
	public byte Track3Len;
	public byte[] Track3 = new byte[2+107];


	public byte getCardMode() {
		return cardMode;
	}

	public void setCardMode(byte cardMode) {
		this.cardMode = cardMode;
	}

	public byte[] getMainAcc() {
		return MainAcc;
	}

	public void setMainAcc(byte[] mainAcc) {
		MainAcc = mainAcc;
	}

	public byte[] getExpDate() {
		return ExpDate;
	}

	public void setExpDate(byte[] expDate) {
		ExpDate = expDate;
	}

	public byte[] getHoldCardName() {
		return HoldCardName;
	}

	public void setHoldCardName(byte[] holdCardName) {
		HoldCardName = holdCardName;
	}

	public byte getbPanSeqNoOk() {
		return bPanSeqNoOk;
	}

	public void setbPanSeqNoOk(byte bPanSeqNoOk) {
		this.bPanSeqNoOk = bPanSeqNoOk;
	}

	public byte getUcPanSeqNo() {
		return ucPanSeqNo;
	}

	public void setUcPanSeqNo(byte ucPanSeqNo) {
		this.ucPanSeqNo = ucPanSeqNo;
	}

	public byte getTrack1Len() {
		return Track1Len;
	}

	public void setTrack1Len(byte track1Len) {
		Track1Len = track1Len;
	}

	public byte[] getTrack1() {
		return Track1;
	}

	public void setTrack1(byte[] track1) {
		Track1 = track1;
	}

	public byte getTrack2Len() {
		return Track2Len;
	}

	public void setTrack2Len(byte track2Len) {
		Track2Len = track2Len;
	}

	public byte[] getTrack2() {
		return Track2;
	}

	public void setTrack2(byte[] track2) {
		Track2 = track2;
	}

	public byte getTrack3Len() {
		return Track3Len;
	}

	public void setTrack3Len(byte track3Len) {
		Track3Len = track3Len;
	}

	public byte[] getTrack3() {
		return Track3;
	}

	public void setTrack3(byte[] track3) {
		Track3 = track3;
	}

	@Override
	public int size() {
		int len=0;
		len+=1;
		len+=MainAcc.length;
		len+=ExpDate.length;
		len+=HoldCardName.length;
		len+=1;
		len+=1;
		len+=1;
		len+=Track1.length;
		len+=1;
		len+=Track2.length;
		len+=1;
		len+=Track3.length;
		if(len%4!=0)
		{
		len+=4-len%4;
		}
		return len;
	}

	@Override
	public void toBean(byte[] buf) {
		byte[]tmp=null;
		int len=0;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		cardMode=tmp[0];
		len+=tmp.length;
		tmp=new byte[MainAcc.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MainAcc=tmp;
		len+=tmp.length;
		tmp=new byte[ExpDate.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ExpDate=tmp;
		len+=tmp.length;
		tmp=new byte[HoldCardName.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		HoldCardName=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		bPanSeqNoOk=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucPanSeqNo=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track1Len=tmp[0];
		len+=tmp.length;
		tmp=new byte[Track1.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track1=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track2Len=tmp[0];
		len+=tmp.length;
		tmp=new byte[Track2.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track2=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track3Len=tmp[0];
		len+=tmp.length;
		tmp=new byte[Track3.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track3=tmp;
		len+=tmp.length;
	}

	@Override
	public byte[] toBytes() {
		byte[] msgByte=new byte[size()];
		byte[]tmp=null;
		int len=0;
		tmp=new byte[1];
		tmp[0]=cardMode;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[MainAcc.length];
		tmp=MainAcc;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[ExpDate.length];
		tmp=ExpDate;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[HoldCardName.length];
		tmp=HoldCardName;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=bPanSeqNoOk;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=ucPanSeqNo;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=Track1Len;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[Track1.length];
		tmp=Track1;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=Track2Len;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[Track2.length];
		tmp=Track2;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=Track3Len;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[Track3.length];
		tmp=Track3;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		if(len%4!=0)
		{
		tmp = new byte[4-len%4];
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		}
		return msgByte;
	}

}
