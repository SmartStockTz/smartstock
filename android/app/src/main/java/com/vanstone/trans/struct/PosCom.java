package com.vanstone.trans.struct;

import com.vanstone.base.interfaces.StructInterface;

public class PosCom implements StructInterface {
	public  byte[] sPIN = new byte[9]; 					// 个人密码
	public  byte[] sField40_oldTerNum = new byte[4]; 	// 原交易终端号后3位
	public  int iField48Len;
	public  byte[] sField48 = new byte[512]; 			// 48域存放结算数据
	public  byte[] sField54 = new byte[64];
	public  int iField58Len;
	public  byte[] sField58 = new byte[512];
	public  byte[] sField61 = new byte[64];
	public  byte[] sField62 = new byte[512];
	public  int ucPrtflag; 								// 交易结束后是否打印凭条
	public  int ucWriteLog; 							// 交易结束后是否记日志
	public  int ucPointType; 							// 积分类型 '0'联名/'1'特定
	public  int ucRmbSettRsp; 							// 人民币卡结算结果
	public  int ucFrnSettRsp; 							// 外币卡结算结果
	public  byte ucAmtSign; 							// 金额的正负号 '+' '-'
	public  byte[] sOrignTransInfo = new byte[31]; 		// 原交易信息，撤销、冲正交易用到
	public  byte[] BalanceAmount = new byte[41]; 		// #48帐户余额 an...020
	public  byte[] Track1 = new byte[88]; 				// #35 1磁道数据 Z..37 u8 Track1[2+37];
	public  byte[] Track2 = new byte[39]; 				// #35 2磁道数据 Z..37
	public  byte[] Track3 = new byte[109]; 				// #36 3磁道数据 Z..104
	public  int Track1Len; 								// 磁道1长度
	public  int Track2Len; 								// 磁道2长度
	public  int Track3Len; 								// 磁道3长度
	public  int IsSaveLogAndRev; 						// 是否需要冲正或者保存日志
	//public  Pos8583PacketStrc stTrnTbl=new Pos8583PacketStrc(); 	// 交易打包，是否打印等的信息
	public  LogStrc stTrans=new LogStrc();			 	// 交易要素信息，需要记录到日志中的数据
	public  long HaveInputAmt; 							// 本笔交易已经输入了金额了
	public  int nRespIccLen; 							// 返回的IC卡验证数据
	public  byte[] RespIccData = new byte[512];
	// EMV
	public  byte[] szCertData = new byte[23]; 			// type(2)ID no(20)
	public  int iReversalDE55Len;
	public  byte[] sReversalDE55 = new byte[128]; 		// 冲正和脚本通知的BIT 55数据 //11/06/15
	public  int iScriptDE55Len;
	public  byte[] sScriptDE55 = new byte[128];

	public  byte HaveInputPin ;
	//新增
		public int bEmvFullOrSim;


		public byte[] tc = new byte[8];  					//联机交易最后的tc



	public byte[] getsPIN() {
		return sPIN;
	}

	public void setsPIN(byte[] sPIN) {
		this.sPIN = sPIN;
	}

	public byte[] getsField40_oldTerNum() {
		return sField40_oldTerNum;
	}

	public void setsField40_oldTerNum(byte[] sField40_oldTerNum) {
		this.sField40_oldTerNum = sField40_oldTerNum;
	}

	public int getiField48Len() {
		return iField48Len;
	}

	public void setiField48Len(int iField48Len) {
		this.iField48Len = iField48Len;
	}

	public byte[] getsField48() {
		return sField48;
	}

	public void setsField48(byte[] sField48) {
		this.sField48 = sField48;
	}

	public byte[] getsField54() {
		return sField54;
	}

	public void setsField54(byte[] sField54) {
		this.sField54 = sField54;
	}

	public int getiField58Len() {
		return iField58Len;
	}

	public void setiField58Len(int iField58Len) {
		this.iField58Len = iField58Len;
	}

	public byte[] getsField58() {
		return sField58;
	}

	public void setsField58(byte[] sField58) {
		this.sField58 = sField58;
	}

	public byte[] getsField61() {
		return sField61;
	}

	public void setsField61(byte[] sField61) {
		this.sField61 = sField61;
	}

	public byte[] getsField62() {
		return sField62;
	}

	public void setsField62(byte[] sField62) {
		this.sField62 = sField62;
	}

	public int getUcPrtflag() {
		return ucPrtflag;
	}

	public void setUcPrtflag(int ucPrtflag) {
		this.ucPrtflag = ucPrtflag;
	}

	public int getUcWriteLog() {
		return ucWriteLog;
	}

	public void setUcWriteLog(int ucWriteLog) {
		this.ucWriteLog = ucWriteLog;
	}

	public int getUcPointType() {
		return ucPointType;
	}

	public void setUcPointType(int ucPointType) {
		this.ucPointType = ucPointType;
	}

	public int getUcRmbSettRsp() {
		return ucRmbSettRsp;
	}

	public void setUcRmbSettRsp(int ucRmbSettRsp) {
		this.ucRmbSettRsp = ucRmbSettRsp;
	}

	public int getUcFrnSettRsp() {
		return ucFrnSettRsp;
	}

	public void setUcFrnSettRsp(int ucFrnSettRsp) {
		this.ucFrnSettRsp = ucFrnSettRsp;
	}

	public byte getUcAmtSign() {
		return ucAmtSign;
	}

	public void setUcAmtSign(byte ucAmtSign) {
		this.ucAmtSign = ucAmtSign;
	}

	public byte[] getsOrignTransInfo() {
		return sOrignTransInfo;
	}

	public void setsOrignTransInfo(byte[] sOrignTransInfo) {
		this.sOrignTransInfo = sOrignTransInfo;
	}

	public byte[] getBalanceAmount() {
		return BalanceAmount;
	}

	public void setBalanceAmount(byte[] balanceAmount) {
		BalanceAmount = balanceAmount;
	}

	public byte[] getTrack1() {
		return Track1;
	}

	public void setTrack1(byte[] track1) {
		Track1 = track1;
	}

	public byte[] getTrack2() {
		return Track2;
	}

	public void setTrack2(byte[] track2) {
		Track2 = track2;
	}

	public byte[] getTrack3() {
		return Track3;
	}

	public void setTrack3(byte[] track3) {
		Track3 = track3;
	}

	public int getTrack1Len() {
		return Track1Len;
	}

	public void setTrack1Len(int track1Len) {
		Track1Len = track1Len;
	}

	public int getTrack2Len() {
		return Track2Len;
	}

	public void setTrack2Len(int track2Len) {
		Track2Len = track2Len;
	}

	public int getTrack3Len() {
		return Track3Len;
	}

	public void setTrack3Len(int track3Len) {
		Track3Len = track3Len;
	}

	public int getIsSaveLogAndRev() {
		return IsSaveLogAndRev;
	}

	public void setIsSaveLogAndRev(int isSaveLogAndRev) {
		IsSaveLogAndRev = isSaveLogAndRev;
	}

	/*public Pos8583PacketStrc getStTrnTbl() {
		return stTrnTbl;
	}

	public void setStTrnTbl(Pos8583PacketStrc stTrnTbl) {
		this.stTrnTbl = stTrnTbl;
	}*/

	public LogStrc getStTrans() {
		return stTrans;
	}

	public void setStTrans(LogStrc stTrans) {
		this.stTrans = stTrans;
	}

	public long getHaveInputAmt() {
		return HaveInputAmt;
	}

	public void setHaveInputAmt(long haveInputAmt) {
		HaveInputAmt = haveInputAmt;
	}

	public int getnRespIccLen() {
		return nRespIccLen;
	}

	public void setnRespIccLen(int nRespIccLen) {
		this.nRespIccLen = nRespIccLen;
	}

	public byte[] getRespIccData() {
		return RespIccData;
	}

	public void setRespIccData(byte[] respIccData) {
		RespIccData = respIccData;
	}

	public byte[] getSzCertData() {
		return szCertData;
	}

	public void setSzCertData(byte[] szCertData) {
		this.szCertData = szCertData;
	}

	public int getiReversalDE55Len() {
		return iReversalDE55Len;
	}

	public void setiReversalDE55Len(int iReversalDE55Len) {
		this.iReversalDE55Len = iReversalDE55Len;
	}

	public byte[] getsReversalDE55() {
		return sReversalDE55;
	}

	public void setsReversalDE55(byte[] sReversalDE55) {
		this.sReversalDE55 = sReversalDE55;
	}

	public int getiScriptDE55Len() {
		return iScriptDE55Len;
	}

	public void setiScriptDE55Len(int iScriptDE55Len) {
		this.iScriptDE55Len = iScriptDE55Len;
	}

	public byte[] getsScriptDE55() {
		return sScriptDE55;
	}

	public void setsScriptDE55(byte[] sScriptDE55) {
		this.sScriptDE55 = sScriptDE55;
	}

	public byte[] toBytes() {
		byte[] msgByte=new byte[size()];
		byte[]tmp=null;
		int len=0;
		tmp=new byte[sPIN.length];
		tmp=sPIN;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[sField40_oldTerNum.length];
		tmp=sField40_oldTerNum;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(iField48Len);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[sField48.length];
		tmp=sField48;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[sField54.length];
		tmp=sField54;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(iField58Len);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[sField58.length];
		tmp=sField58;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[sField61.length];
		tmp=sField61;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[sField62.length];
		tmp=sField62;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ucPrtflag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ucWriteLog);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ucPointType);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ucRmbSettRsp);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ucFrnSettRsp);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[1];
		tmp[0]=ucAmtSign;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[sOrignTransInfo.length];
		tmp=sOrignTransInfo;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[BalanceAmount.length];
		tmp=BalanceAmount;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[Track1.length];
		tmp=Track1;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[Track2.length];
		tmp=Track2;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[Track3.length];
		tmp=Track3;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(Track1Len);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(Track2Len);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(Track3Len);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(IsSaveLogAndRev);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		/*tmp=new byte[stTrnTbl.size()];
		tmp=stTrnTbl.toBytes();
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;*/
		tmp=new byte[stTrans.size()];
		tmp=stTrans.toBytes();
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.longToBytes(HaveInputAmt);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(nRespIccLen);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[RespIccData.length];
		tmp=RespIccData;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[szCertData.length];
		tmp=szCertData;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(iReversalDE55Len);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[sReversalDE55.length];
		tmp=sReversalDE55;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(iScriptDE55Len);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[sScriptDE55.length];
		tmp=sScriptDE55;
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

	public int size() {
		int len=0;
		len+=sPIN.length;
		len+=sField40_oldTerNum.length;
		len+=4;
		len+=sField48.length;
		len+=sField54.length;
		len+=4;
		len+=sField58.length;
		len+=sField61.length;
		len+=sField62.length;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=1;
		len+=sOrignTransInfo.length;
		len+=BalanceAmount.length;
		len+=Track1.length;
		len+=Track2.length;
		len+=Track3.length;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		//len+=stTrnTbl.size();
		len+=stTrans.size();
		len+=4;
		len+=4;
		len+=RespIccData.length;
		len+=szCertData.length;
		len+=4;
		len+=sReversalDE55.length;
		len+=4;
		len+=sScriptDE55.length;
		if(len%4!=0)
		{
		len+=4-len%4;
		}
		return len;
	}

	public void toBean(byte[] buf) {
		byte[]tmp=null;
		int len=0;
		tmp=new byte[sPIN.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sPIN=tmp;
		len+=tmp.length;
		tmp=new byte[sField40_oldTerNum.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sField40_oldTerNum=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		iField48Len=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[sField48.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sField48=tmp;
		len+=tmp.length;
		tmp=new byte[sField54.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sField54=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		iField58Len=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[sField58.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sField58=tmp;
		len+=tmp.length;
		tmp=new byte[sField61.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sField61=tmp;
		len+=tmp.length;
		tmp=new byte[sField62.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sField62=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucPrtflag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucWriteLog=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucPointType=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucRmbSettRsp=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucFrnSettRsp=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucAmtSign=tmp[0];
		len+=tmp.length;
		tmp=new byte[sOrignTransInfo.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sOrignTransInfo=tmp;
		len+=tmp.length;
		tmp=new byte[BalanceAmount.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		BalanceAmount=tmp;
		len+=tmp.length;
		tmp=new byte[Track1.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track1=tmp;
		len+=tmp.length;
		tmp=new byte[Track2.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track2=tmp;
		len+=tmp.length;
		tmp=new byte[Track3.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track3=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track1Len=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track2Len=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Track3Len=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		IsSaveLogAndRev=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		/*tmp=new byte[stTrnTbl.size()];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		stTrnTbl.toBean(tmp);
		len+=tmp.length;*/
		tmp=new byte[stTrans.size()];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		stTrans.toBean(tmp);
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		HaveInputAmt=com.vanstone.utils.CommonConvert.bytesToLong(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		nRespIccLen=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[RespIccData.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		RespIccData=tmp;
		len+=tmp.length;
		tmp=new byte[szCertData.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		szCertData=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		iReversalDE55Len=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[sReversalDE55.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sReversalDE55=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		iScriptDE55Len=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[sScriptDE55.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sScriptDE55=tmp;
		len+=tmp.length;
	}
}
