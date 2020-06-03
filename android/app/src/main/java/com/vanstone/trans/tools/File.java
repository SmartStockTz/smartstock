package com.vanstone.trans.tools;

import com.vanstone.demo.constants.DefConstants;
import com.vanstone.demo.constants.GlobalConstants;
import com.vanstone.trans.api.CommApi;
import com.vanstone.trans.api.FileApi;
import com.vanstone.trans.api.constants.CoreDefConstants;
import com.vanstone.trans.api.constants.StructConstants;
import com.vanstone.trans.api.struct.CommParaStruc;
import com.vanstone.trans.struct.CtrlParam;
import com.vanstone.trans.struct.LogStrc;
import com.vanstone.utils.ByteUtils;
import com.vanstone.utils.CommonConvert;

public class File {

	public static void InitCommParam()
	{
		StructConstants.G_CommPara=new CommParaStruc();
		//通讯模式
		StructConstants.G_CommPara.setCurCommMode(CommApi.GPRS);
	   	StructConstants.G_CommPara.netCdmaGprsSet.setCommAuto((byte)0);
	   	StructConstants.G_CommPara.hdlcSet.setLinkType((byte)0);													//同步,如果是TMS下载用异步
		StructConstants.G_CommPara.dialSet.setReDialTimes((byte)3);													//重拨次数3次
		// 默认使用长连接(短连接的话每次通讯都会关闭连接, 影响效率)
		StructConstants.G_CommPara.netCdmaGprsSet.setConnectMode((byte) 0);

		StructConstants.G_CommPara.hdlcSet.setIfCheckPhone((byte)1);												//是否要并机检测(Hex默认检测)
	   	StructConstants.G_CommPara.hdlcSet.setIfCheckDialTone((byte)1);												//是否检测拨号音(Hex默认检测)
	   	StructConstants.G_CommPara.hdlcSet.setCheckToneTime((byte)0x50);											//拨号音检测时间(Bcd,默认500ms)
	   	StructConstants.G_CommPara.hdlcSet.setDelayBeforeDial((byte)1);												//不检测拨号音拨号前延时(Hex默认1*1S)
	   	StructConstants.G_CommPara.hdlcSet.setDtmfOnTime((byte)120);												//DTMFOn时间(Hex默认50*1ms)
	   	StructConstants.G_CommPara.hdlcSet.setDtmfOffTime((byte)120);
	   	StructConstants.G_CommPara.hdlcSet.setWaveLostTime((byte)30);												//载波丢失检测时间(Hex默认10s)
	   	StructConstants.G_CommPara.hdlcSet.setSendLevel((byte)10);
	   	StructConstants.G_CommPara.gprsSet.setGprsNeedUser((byte) 1);	// GPRS是否需要用户名(默认需要)

	   	//发送电平(Hex默认0000)
	    ByteUtils.memset(StructConstants.G_CommPara.dialSet.getPredialNum(),0, StructConstants.G_CommPara.dialSet.getPredialNum().length);		//预拨外线号码
		ByteUtils.memset(StructConstants.G_CommPara.dialSet.getInputCenterNum(),0,20);										//中心号码接入号码
	   // ByteUtils.memcpy(StructConstants.G_CommPara.dialSet.getTpdu(),"\x60\x00\x06\x00\x00",5);						//中心TPDU
//		ByteUtils.memcpyHex(StructConstants.G_CommPara.dialSet.getTpdu(),                                                //中心TPDU
//					"/x60/x00/x06/x00/x00", "/x", "", 5);  // 智能POS对应参数 --- 2
		ByteUtils.memcpyHex(StructConstants.G_CommPara.dialSet.getTpdu(),                                                //中心TPDU
					"/x60/x00/x04/x00/x02", "/x", "", 5);  // 多媒体卡 --- 1
		ByteUtils.strcpy(StructConstants.G_CommPara.dialSet.getInputCenterNum(),"83012240");			//02083012240
		ByteUtils.strcpy(StructConstants.G_CommPara.dialSet.getInputCenterNum1(),"83012240");
		ByteUtils.strcpy(StructConstants.G_CommPara.dialSet.getInputCenterNum2(),"83012240");
		StructConstants.G_CommPara.dialSet.predialNum[0] = 0;

		// 智能POS对应参数 --- 2
//		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsApn1(), "SJZHBNXS.WXPOS.HEAPN");
//		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsIp1(), "10.0.45.10");
//		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsPort1(), "7879");
//		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsApn2(), "SJZHBNXS.WXPOS.HEAPN");
//		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsIp2(), "10.0.45.10");
//		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsPort2(), "7879");
//		ByteUtils.strcat(StructConstants.G_CommPara.gprsSet.getGprsUser1(), "dmtpos@dmtpos.com");
//		ByteUtils.strcat(StructConstants.G_CommPara.gprsSet.getGprsUserPwd1(),"dmtpos");

		// 多媒体卡 --- 1
		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsApn1(), "SJZNXS.WXPOS.HEAPN");
		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsIp1(), "10.3.20.254");
		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsPort1(), "5000");
		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsApn2(), "SJZNXS.WXPOS.HEAPN");
		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsIp2(), "10.3.20.254");
		ByteUtils.strcpy(StructConstants.G_CommPara.gprsSet.getGprsPort2(), "5000");
		ByteUtils.strcat(StructConstants.G_CommPara.gprsSet.getGprsUser1(), "wxpos@nxwxpos.com");
		ByteUtils.strcat(StructConstants.G_CommPara.gprsSet.getGprsUserPwd1(),"wxpos");

//		ByteUtils.memcpy(StructConstants.G_CommPara.netSet.NetServerIp,"192.168.43.193");
//		ByteUtils.memcpy(StructConstants.G_CommPara.netSet.NetServerPort,"8000");
		ByteUtils.memcpy(StructConstants.G_CommPara.netSet.NetServerIp,"10.5.1.16");
		ByteUtils.memcpy(StructConstants.G_CommPara.netSet.NetServerPort,"18903");
		ByteUtils.memcpy(StructConstants.G_CommPara.netSet.NetServer2Ip,"116.239.4.194");
		ByteUtils.memcpy(StructConstants.G_CommPara.netSet.NetServer2Port,"8500");
	}

	public static void SaveTermParam()
	{
		int result=0;

		do
		{
		    result = FileApi.WriteFile_Api(DefConstants.TERMPARAMFILE, StructConstants.G_CommPara.toBytes(), 0, StructConstants.G_CommPara.size());
		}while(result != 0);
	}

	public static void ReadTermParam()
	{
	    int ReadLen=0;

	    ReadLen = StructConstants.G_CommPara.size();
	    StructConstants.G_CommPara=new CommParaStruc();
        byte [] temp=new byte[ReadLen];
	    if(FileApi.ReadFile_Api(DefConstants.TERMPARAMFILE, temp, 0, CommonConvert.intToBytes(ReadLen))== 0){
	    	StructConstants.G_CommPara.toBean(temp);
	    	return;
	    }
	    InitCommParam();						//初始化系统参数
	    SaveTermParam();						//保存系统参数
	}


	public static void IsDelfile(byte[] FileName )
	{
		byte[] DisBuf=new byte[100];

		ByteUtils.memset(DisBuf, 0, DisBuf.length);

		//sprintf(DisBuf, "是否要删除%s文件", FileName);
		ByteUtils.memcpy(DisBuf, CommonConvert.StringToBytes("是否要删除"+ CommonConvert.BytesToString(FileName)+"文件"));
		//if(PublicSource.ZeroOneSelect(CommonConvert.BytesToString(DisBuf), "", "否", "是", 0, 30) == CoreDefConstants.DIGITAL1)
			//FileApi.DelFile_Api(CommonConvert.BytesToString(FileName));
	}

	public static void SaveCtrlParam()
	{
		int result=0;

		do
		{
			byte[] temp=GlobalConstants.gCtrlParam.toBytes();
			result = FileApi.WriteFile_Api(DefConstants.CtrlPARAMFILE,temp, 0, temp.length);
			//result = FileApi.WriteFile_Api(FileConstants.CtrlPARAMFILE,GlobalConstants.gCtrlParam.toBytes(), 0, GlobalConstants.gCtrlParam.size());
		}while(result != 0);
	}

	public static void ReadCtrlParam()
	{
		int ret=0;
	   	int ReadLen = GlobalConstants.gCtrlParam.size();
	   	byte[] ReadLenAddr= CommonConvert.intToBytes(ReadLen);
	   	byte []temp=new byte[ReadLen];
		ret = FileApi.ReadFile_Api(DefConstants.CtrlPARAMFILE, temp, 0, ReadLenAddr);
		ReadLen= CommonConvert.bytesToInt(ReadLenAddr);
		if( (ret == 0)&&(ReadLen == GlobalConstants.gCtrlParam.size())){
			GlobalConstants.gCtrlParam.toBean(temp);
			return;
		}
		//SystemApi.Beep_Api(DefConstants.BEEPERROR);
	    InitCtrlParam();											//初始化系统参数
	    SaveCtrlParam();											// 保存系统参数
	}

	public static void InitCtrlParam()
	{
		GlobalConstants.gCtrlParam=new CtrlParam();
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getCDTVer(),"Vanstone_Phone_V30");		//机器型号
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getCapkVer(),"00000001");				//公钥版本
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getParaVer(),"010101000000");			//参数版本
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.Version,"0001001");		    	//版本号
		GlobalConstants.gCtrlParam.setSupportCNPC(CoreDefConstants.FALSE);								//默认不支持中油
		GlobalConstants.gCtrlParam.setSupportDCC(CoreDefConstants.FALSE); 							//默认不支持DCC
		GlobalConstants.gCtrlParam.setDCC_stage(CoreDefConstants.FALSE); 							//默认是第一次上送主机
		GlobalConstants.gCtrlParam.setSettle_flag(0);									//默认为非结帐POS
		GlobalConstants.gCtrlParam.setAuth_flag(0);									//默认反交易不授权
		GlobalConstants.gCtrlParam.setDefaultTrade(1);								//待机界面插卡、刷卡默认为消费
		GlobalConstants.gCtrlParam.setlTraceNo(1);									//流水号
		GlobalConstants.gCtrlParam.setlNowBatchNum(1);									//批次号
		GlobalConstants.gCtrlParam.setDifferential(50);								//默认级差为50
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getLowAmt(), "10000" );					    //默认最低交易金额为100元
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getMerchantName(), "银行测试7");
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getMerchantNo(), "941160147848170");
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getTerminalNo(), "47840098");


		GlobalConstants.gCtrlParam.setBeepForInput(0);
		GlobalConstants.gCtrlParam.setOprTimeoutValue(60);
		GlobalConstants.gCtrlParam.setTradeTimeoutValue(60);
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getTermSysAdminPwd(), "20060101");
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getPayOptPwd(), "888888");
		GlobalConstants.gCtrlParam.setTickets_num(2);
		GlobalConstants.gCtrlParam.setShieldPAN(1);
		GlobalConstants.gCtrlParam.OfflineTranFlag = 1;
		GlobalConstants.gCtrlParam.OfflineTimes = 3;
		GlobalConstants.gCtrlParam.setUcAutoLogoff(1);	// 结算是否默认签退,默认支持
		GlobalConstants.gCtrlParam.setIfNeedManagerKey(1);	// 是否输入主管密码(撤销/退货类交易)
		GlobalConstants.gCtrlParam.setSupportFallBack(0);		// 是否支持IC卡降级 默认不支持
		GlobalConstants.gCtrlParam.setHandInput(1);

		GlobalConstants.gCtrlParam.pinpad_type = DefConstants.PIN_PED;
		GlobalConstants.gCtrlParam.AKeyIndes = 0; // 默认AKEY索引
		GlobalConstants.gCtrlParam.MainKeyIdx = 1;// 默认主密钥索引(1-50)														// //lfb test
		GlobalConstants.gCtrlParam.MacKeyIndes = 0;// 默认Mackey密钥索引(1-22)
		GlobalConstants.gCtrlParam.PinKeyIndes = 1;// 默认Pinkey密钥索引(1-22)
		GlobalConstants.gCtrlParam.MagKeyIndes = 2;// 默认Magkey密钥索引								//默认为内置密码键盘
		GlobalConstants.gCtrlParam.setMaxTradeNum(500);						//默认500笔存储
		GlobalConstants.gCtrlParam.setMaxSignNum((byte)100);                        //默认100笔
		GlobalConstants.gCtrlParam.setReverseTimes(3);						//默认冲正次数3

		GlobalConstants.gCtrlParam.setSupportICC(1);							//默认是支持IC卡的
		GlobalConstants.gCtrlParam.setSupportECC(1);							//默认支持电子现金
		GlobalConstants.gCtrlParam.setSupportPICC((byte)1);							//默认支持PICC卡片
		GlobalConstants.gCtrlParam.PICCDelayTime = 15;                                       //默认15s
		ByteUtils.memset(GlobalConstants.gCtrlParam.transflag, 0xff, GlobalConstants.gCtrlParam.transflag.length);
		//测试添加
		//gCtrlParam.EmvCapkOK = 1;							//直接下参数文件进去
		//gCtrlParam.EmvParamOK = 1;						//直接下参数文件进去
//		GlobalConstants.gCtrlParam.flagCentreReq |= FuncConstants.MASK_CR_DOWN_MAGPARAM;	//河北农信没有这支交易
//		GlobalConstants.gCtrlParam.flagCentreReq |= FuncConstants.MASK_CR_DOWNBLACKLIST;		//河北农信没有这支交易
//		GlobalConstants.gCtrlParam.flagCentreReq |= FuncConstants.MASK_CR_UPDATEMASTERKEY;	//河北农信没有这支交易

		GlobalConstants.gCtrlParam.MainKeyDown = 0;
		GlobalConstants.gCtrlParam.PrntTicketType = 2;
		GlobalConstants.gCtrlParam.IfPrnDetail = 1;
		GlobalConstants.gCtrlParam.setIfPrnEnglish(1);
		GlobalConstants.gCtrlParam.setPreauth_flag(1);						//打开预授权
		GlobalConstants.gCtrlParam.setUcClearLog(CoreDefConstants.TRUE);
		GlobalConstants.gCtrlParam.setMaskForTransUseCard(3);
		GlobalConstants.gCtrlParam.setMaskForVoidTransPwd(15);
		//ByteUtils.memcpy(gCtrlParam.MaxRefundAmt, "\x00\x00\x01\x00\x00\x00", 6);
		ByteUtils.memcpyHex(GlobalConstants.gCtrlParam.getMaxRefundAmt(),                                                //中心TPDU
				"/x00/x00/x01/x00/x00/x00", "/x", "", 6);
		ByteUtils.memset(GlobalConstants.gCtrlParam.getEmvDownFlag(), 0, GlobalConstants.gCtrlParam.getEmvDownFlag().length);
		//emv数据下载断点，0(0无1capk2param)，1(capk point),2(param point);

		GlobalConstants.gCtrlParam.setTerminalType(1);					//pos类型为消费POS
		if(GlobalConstants.gCtrlParam.IsMis == 0)
			GlobalConstants.gCtrlParam.CommSelf = 1;
		else
			GlobalConstants.gCtrlParam.CommSelf = 0;

		//手写板设置
		GlobalConstants.gCtrlParam.SupportSignPad = 1;	//是否有手写板(0-不支持 1-内置 2-外接)
		GlobalConstants.gCtrlParam.SupportSignPrn = 1;	//主机支持电子签名
		GlobalConstants.gCtrlParam.SignTimeoutS = (byte)120;	//手写操作超时时间
		GlobalConstants.gCtrlParam.SignMaxNum = 100;	//最多多少条未上送启动上送
		GlobalConstants.gCtrlParam.SignBagMaxLen = 900;	//手写包最大多少.如果超过这个值就要分包。
		GlobalConstants.gCtrlParam.SignTimeoutS = (byte)120;	//手写操作超时时间
		GlobalConstants.gCtrlParam.IsCData = 1;
		GlobalConstants.gCtrlParam.PrnENRecvBankId = 0;
		GlobalConstants.gCtrlParam.setnComBps(9600);	//调试的串口速率

		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getSecurityPwd(), "666666");
		GlobalConstants.gCtrlParam.setSupportPortionPaid(1);
		GlobalConstants.gCtrlParam.setUseDefTicketHead(1);

		GlobalConstants.gCtrlParam.pinpad_type = DefConstants.PIN_PED;
		GlobalConstants.gCtrlParam.AKeyIndes = 	0; //默认AKEY索引
		GlobalConstants.gCtrlParam.MainKeyIdx =0;//默认主密钥索引(1-50) //lfb test
		GlobalConstants.gCtrlParam.MacKeyIndes = 1;//默认Mackey密钥索引(1-22)
		GlobalConstants.gCtrlParam.PinKeyIndes = 0;//默认Pinkey密钥索引(1-22)
		GlobalConstants.gCtrlParam.MagKeyIndes = 2;//默认Magkey密钥索引

		GlobalConstants.gCtrlParam.commuProtocol = 0;	//默认是socket
		ByteUtils.strcpy(GlobalConstants.gCtrlParam.getHostPath(), "https://36.110.44.29:443/S/appServer/api/pospb.r");

		GlobalConstants.gCtrlParam.bEnableFlushCard = 1;
		GlobalConstants.gCtrlParam.currFlashTimeout = 10;  //10 s
		GlobalConstants.gCtrlParam.FlashCardTimeout = 60; // 60 s
		GlobalConstants.gCtrlParam.maxNumFashCardRec = 3;

		GlobalConstants.gCtrlParam.SupportPICC = DefConstants.PEDPICCCARD;
	}

	public static int ReadLog(LogStrc pLog, int logNo )
	{
		int off=0, Len=0;

		if (GlobalConstants.gCtrlParam.getiTransNum() == 0)							//没有日志
			return 1;

		if( logNo == DefConstants.LAST_REC_LOG )
			off = (GlobalConstants.gCtrlParam.getiTransNum() - 1) * DefConstants.LOG_SIZE;
		else
			off = logNo * DefConstants.LOG_SIZE;

		Len = DefConstants.LOG_SIZE;
		byte[] temp = new byte[Len];
		byte[] LenAddr= CommonConvert.intToBytes(Len);
		if( FileApi.ReadFile_Api(DefConstants.RECORDLOG, temp, off, LenAddr) == CoreDefConstants.SOK)
		{
			pLog.toBean(temp);
			Len= CommonConvert.bytesToInt(LenAddr);
			if(Len == DefConstants.LOG_SIZE)
				return 0;
		}else
		{
			return DefConstants.E_MEM_ERR;
		}

		return 0;
	}

	public static void DelLog(int bClearTraceNo)
	{
		FileApi.DelFile_Api(DefConstants.RECORDLOG);
		GlobalConstants.gCtrlParam.setiTransNum(0);

		//GlobalConstants.gtLimitTotal.setnEmvOfflineCount(0);
		//FileApi.WriteFile_Api(EmvCommonConstants.FILE_TOTAL_LMT, GlobalConstants.gtLimitTotal.toBytes(), 0, GlobalConstants.gtLimitTotal.size());

		if(bClearTraceNo!=0)
		{
			GlobalConstants.gCtrlParam.setlTraceNo(1);
		}
		SaveCtrlParam();
	}

	public static int SaveLogFile()
	{
		//int ret=0;
		LogStrc stLog=new LogStrc();
		byte[] temp = new byte[stLog.size()];
		ByteUtils.memcpy(temp, GlobalConstants.PosCom.stTrans.toBytes(), stLog.size());
		stLog.toBean(temp);
		if(FileApi.WriteFile_Api(DefConstants.RECORDLOG, stLog.toBytes(), GlobalConstants.gCtrlParam.getiTransNum()*DefConstants.LOG_SIZE, DefConstants.LOG_SIZE) != 0 )
		{
			return (DefConstants.E_MEM_ERR);
		}

		GlobalConstants.gCtrlParam.iTransNum++;								//交易笔数加1
		SaveCtrlParam();

		/*
		//当日撤销
		if( (stLog.getTrans_id() == PosMacroConstants.POS_SALE_VOID))
		{
			//ret = UpdateLogFile();
			if(ret != 0)									//不提示
				Itwell.ErrorPrompt("更新日志失败", 3);
		}*/

		return(0);
	}


//	public static int UpdateLogFile()
//	{
//		int i=0;
//		LogStrc Log=new LogStrc();
//
//		for(i = 0; i < GlobalConstants.gCtrlParam.getiTransNum(); i++)
//		{
//			if(ReadLog(Log, i) == 0)
//			{
//				if(Log.getlTraceNo() == GlobalConstants.PosCom.stTrans.getOldTraceNo())			//找到了被撤销的交易了
//				{
//					Log.setState(DefConstants.TSTATE_VOID);
//					if( FileApi.WriteFile_Api(DefConstants.RECORDLOG,Log.toBytes(), i*Log.size(), DefConstants.LOG_SIZE) != 0)
//						return PosMacroConstants.E_MEM_ERR;
//					else
//						return 0;
//				}
//			}
//		}
//		return 1;
//	}


	public static final int MAXBACKNUM = 20;

	public static int ReadReversalData()
	{
		int RLen=0;

		RLen = FileApi.GetFileSize_Api(DefConstants.DUPFILE);
		byte[] temp = GlobalConstants.PosCom.toBytes();
		byte[] LenBuff = CommonConvert.intToBytes(RLen);
		FileApi.ReadFile_Api(DefConstants.DUPFILE, temp, 0, LenBuff);
		GlobalConstants.PosCom.toBean(temp);
		RLen = CommonConvert.bytesToInt(LenBuff);
		return 0;

	}

	public static int SaveReversalData(byte[] pReson)
	{
		byte[] stemp=new byte[4];
		FileApi.DelFile_Api(DefConstants.DUPFILE);
		ByteUtils.memcpy(stemp, GlobalConstants.PosCom.stTrans.getSzRespCode(), 2);	//保存原始数据
		ByteUtils.strcpy(GlobalConstants.PosCom.stTrans.getSzRespCode(), pReson);
		//if(WriteFile_Api(DUPFILE, (u8*)&PosCom, 0, sizeof(PosCom)) != 0x00 )
		if(FileApi.WriteFile_Api(DefConstants.DUPFILE, GlobalConstants.PosCom.toBytes(), 0, GlobalConstants.PosCom.size()) != 0x00 )
			return -1;
		ByteUtils.memcpy(GlobalConstants.PosCom.stTrans.getSzRespCode(), stemp, 2);
		return 0;
	}

	public static int DelReversalData()
	{
		if(FileApi.DelFile_Api(DefConstants.DUPFILE) == CoreDefConstants.SOK)
		{
			return 0;
		}
		else
		{
			return (DefConstants.E_MEM_ERR);
		}
	}

	public static int ChgRecordFlag(int nRecNO, int ucFlag)
	{
		int nSeat=0, nLen=0;
		LogStrc tLog=new LogStrc();

		nSeat = nRecNO*DefConstants.LOG_SIZE;
		nLen = 16;
		byte[] nLenAddr= CommonConvert.intToBytes(nLen);
		if(FileApi.ReadFile_Api(DefConstants.RECORDLOG, tLog.toBytes(), nSeat, nLenAddr) != CoreDefConstants.SOK)
			return DefConstants.E_MEM_ERR;
		nLen= CommonConvert.bytesToInt(nLenAddr);
		tLog.ucRecFalg |= ucFlag;
		nLen = 16;
		if(FileApi.WriteFile_Api(DefConstants.RECORDLOG, tLog.toBytes(), nSeat, nLen) != CoreDefConstants.SOK)
			return DefConstants.E_MEM_ERR;

		return 0;
	}

	public static int ModifyLog(int recNo, LogStrc pLog)
	{
		if(FileApi.WriteFile_Api(DefConstants.RECORDLOG, pLog.toBytes(), recNo * pLog.size(), DefConstants.LOG_SIZE) != CoreDefConstants.SOK)
			return DefConstants.E_FILE_WRITE;

		return 0;
	}

}
