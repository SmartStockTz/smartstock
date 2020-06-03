package com.vanstone.trans.struct;

import com.vanstone.base.interfaces.StructInterface;

public class CtrlParam implements StructInterface {
	public CtrlParam(){
		
	}
	public int pinpad_type;			//PINPAD标志, 0-内置, 1-外置
	public int	AKeyIndes;				//主密钥索引 单des（0-99）  3des 102-203
	public int	MainKeyIdx;			//主密钥索引 单des（0-99）  3des 102-203
	public int	PinKeyIndes;			//工作密钥pinkey密钥索引 单des（0-21  150-254）  3des 22-149
	public int	MacKeyIndes;			//工作密钥MacKey密钥索引 单des（0-21  150-254）  3des 22-149
	public int	MagKeyIndes;			//工作密钥MagKey密钥索引 单des（0-21  150-254）  3des 22-149(对磁道进行加密)
	public int	lTraceNo;				//流水号
	public byte[] termSNo=new byte[11];
	public int	beepForInput;			//是否按键时发声 0--缺省，不发声
	public int	oprTimeoutValue;		//超时时限 控制超时时限，就是用户输入的超时
	public int	tradeTimeoutValue;		//交易超时时限，等待中心应答数据的超时时限
	public byte[] termSysAdminPwd=new byte[13];	//管理员密钥 缺省20060101
	public byte[] payOptPwd=new byte[12];			//支付密钥 缺省888888
	public byte[] logonDate=new byte[5];			//签到日期 yyyymmdd bcd
	public byte[] ManagerPwd=new byte[12];			//主管密码
	public byte[] TerminalNo=new byte[9];			//终端号 ans8
	public byte[] MerchantNo=new byte[16];			//商户号 ans12
	public byte[] finance_card=new byte[20];		//结算卡号FINANCE_CARD
	public byte[] MerchantName=new byte[41]; 	 	//商户中文名称 ans40
	public byte[] CurrencyCode=new byte[4];		//货币代码
	public byte[] CDTVer=new byte[18];				//机器版本
	public byte[] Version=new byte[8];				//版本号
	public int PrintErrReport;			//是否打印故障报告单
	public int maskForVoidTransPwd;	//撤销类交易是否输入密码得掩码 PWD_MASK_FOR_SALEVOID, PWD_MASK_FOR_PREAUTHVOID, PWD_MASK_FOR_AUTHDONEVOID, PWD_MASK_FOR_AUTHDONE
	public int maskForTransUseCard;    //交易是否出卡得掩码 CARD_MASK_FOR_SALEVOID, CARD_MASK_FOR_AUTHDONEVOID
	public int DefaultTrade;			//缺省交易
	public int HandInput;				//是否允许手输卡   (用于控制授权类交易)
	public int DesType;				//Des类型 低半字节 1:单DES;0:3DES  高半字节：0-mackey,pinkey, 1--mackey,pinkey,magkey
	public int CompleteMode;			//磁卡交易预授权方式: 0 都支持  1 联机 2 离线
	public int PreDial;				//是否预拨号
	public int PromptICC;				//是否提示ICC卡 0 不提示 1 提示
	public int ShieldPAN;				//是否屏蔽卡号 0 不屏蔽 1 屏蔽
	public int DCC_stage;				//是否是第一次上送主机
	public int preauth_flag;			//预授权标志PREAUTH
	public int icbccard_flag;			//本行卡标志, not used, always open
	public int pboc_flag;				//银联卡标志
	public int nwk_flag;				//内外卡标志NWK: 1-同时受理
	public int offline_flag;			//离线交易标志1-OFFLINE
	public int settle_flag;			//结账POS	  SETT--'1', settle pos open
	public int comm_type;
	public int tickets_num;			//打印页数TICKETS, 1--1张,2--2张
	public int card_table;				// 是否安装卡表 CARDTABLEEXIST--'0',不安装
	public int pos_type;				// POS类型
	public int manual_flag;			//外卡手工输入标志 1-allowed
	public int TerminalType;			//终端类型
	public int iTransNum;				//当前交易总笔数
	public int lNowBatchNum;			//批次号
	public byte[] oper_limit=new byte[13];			//操作员限额OP_JIN
	public byte[] manage_limit=new byte[13];		//管理员限额GL_JIN
	public byte[] SettDate=new byte[5];			//结账时间
	public byte[] CapkVer=new byte[9];				//公钥版本
	public byte[] ParaVer=new byte[13];			//参数版本
	public int AppType;				//EMV新加
	public int ForceOnline;			//EMV新加
	public int Differential;			//级差
	public byte[] LowAmt=new byte[13];				//最低交易金额
	public byte[] MaxAmt=new byte[13];				//最高交易金额
	public byte[] MaxRefundAmt=new byte[6];		//退货最大金额
	public byte[] MaxReimgursedAmt=new byte[6];	//财务报销限额
	public int ParamIsDown;			//参数是否已经下载过
	public int MainKeyDown;			//主密钥是否已经下载
	
	public int SupportICC;				//是否支持IC卡交易 0 不支持  1 支持
	public int SupportDCC;				//支持DCC标志
	public int SupportCNPC;			//支持中油标志
	public int SupportECC;				//电子现金是否允许 终端是否支持电子现子功能  0:不支持  1:支持	
	public int SupportFallBack;		// 是否支持IC卡降级 0: 不支持, 1: 支持
	public byte		IfSupportPICC;			//是否非接卡 
	public byte     IfSaleSupportPICC;		//消费是否支持挥卡
	public byte     SupportPICC;                       // 0不支持 3内置 4外置
	public byte     PICCDelayTime;                    //非接寻卡等待时间
	
	public byte OfflineTranFlag;						//离线上送方式  (0 批结前 1 下笔联机)
	public int ucBatchStatus;			//当前批上送状态：RMBLOG 上送人民币卡 FRNLOG上送外卡 ALLLOG都上送状态  WORK_STATUS非批上送，工作状态
	public int ucClearLog;				//结算后是否未清日志    TURE:未清
	public int ucAutoLogoff;			//是否自动签退 1-是  0- 否
	public int ucLogonFlag;			//POS签到标志
	public int installment_flag;		//分期付款标志
	public int installment_BigAmt;		//分期大额标志
	public byte[] installment_Maxnew=new byte[6];		//分期付款限额
	public byte qpbocChannel;				//非接交易通道0--联机优先 1--脱机优先
	public int paypass;				//快速消费标志
	public int auth_flag;				//反交易是否授权标志AUTHFLAG
	public int tip_flag;				//小费标志FEEFLAG-'1'--closed
	public int tip_rate;				//小费百分比
	public int MaxTradeNum;			//最大交易笔数
	public short MaxSignNum;			//最大签名存储笔数
	public int ReverseTimes;			//冲正次数
	public int OfflineTimes;			//离线上送笔数
	public int IfPrnDetail;			//是否打印明细
	public int IfPrnEnglish;			//签购单是否打印英文
	public byte PrntTicketType;                      //签购单抬头(0 中文 1 银联LOGO 2农信银LOGO)
	public int ticketStype;            //签购单类型：0--旧 1--新
	public int useDefTicketHead;       //是否使用缺省的签购单抬头，1-是，0-否
	public byte[] ticketHead=new byte[32];           //签购单抬头：覆盖默认的抬头,最多支持10个汉字，20个字母
	public byte[] sManageNum=new byte[20];			//管理电话
	public byte	CommSelf;						//mis是否自主通讯
	public byte  IsMis;							//是否是MIS  1是MIS程序 0是传统POS
    //每个交易的使能标识
	public byte[] transflag=new byte[8];			//交易标志位
	public int flagCentreReq;                      //报文头中的中心处理要求
	public int flagReserve;                         //保留
	public byte[] EmvDownFlag=new byte[4];			//EMV参数等下载断点
	public byte[] ReimCompanyCard=new byte[21];	//报销交易注册的公司的卡号
	public int nComBps;				//串口通讯的BPS速率
	//说明0(0x0B开始下载capk; 0x0E下载param)1(当前capk断点)2(当前param断点)
	//tms 参数
	public byte[] TerminalTmsVer=new byte[37];		//当前终端应用的TMS端的版本号 响应为需要下载的版本号。格式为厂商(2)+型号(2)+版本号(32),不足用空格补足
	public int DownFlag;				//下载控制位  00不需要下载 01普通下载 02强制下载
	public byte[] DownTime=new byte[29];			//下载时间
	public byte[] VirtualTermNo=new byte[12];		//虚拟终端号
	public byte[] AppTradeType=new byte[2];		//软件交易类型

	public byte PrnENRecvBankId;						//打印中文收单行             0-否 1-是
	public byte	IsCData;						//MIS传输数据是否加密
	public byte[] BTName = new byte[14];					//蓝牙名称
	public byte[] BTMacAdr = new byte[18];					//蓝牙mac地址
	public byte[]	UUID = new byte[32+1];						//mpos和app绑定的唯一标识
	public byte[]  AppNum = new byte[16+1];					//TMS应用程序版本号
	public byte	MisComPort;						//Miss与收银机串口通信的串口号
	public byte	CommWithCash;					//mis与收银机通讯方式0串口,1蓝牙,2USB
	//pbox扩展应用参数
	public int supportQPbocExType;//b1=1:支持分段扣费，b2=1:支持脱机预授权,
								// b3=1:支持押金抵扣, b4=1:如果卡片不支持特定的扩展应用则继续交易，否则就终止交易
	public int qpbocExSFI; //qpboc扩展应用变长文件的SFI
	public byte[] qpbocExAppId=new byte[2]; //扩展应用ID号
	
	//手写板设置 
	public byte		SupportSignPad;				//是否有手写板设备(0-不支持 1-内置 2-外接)
	public byte		SupportSignPrn;				//主机是否支持电子签名
	public byte		SupPrnMerSign;				//是否支持打印商户联和银行存根
	public byte		SignTimeoutS;				//手写操作超时时间
	public short		SignRecNum;					//当前还有几笔未上送
	public byte		SignMaxNum;					//最多多少条未上送启动上送
	public short	SignBagMaxLen;				//手写包最大多少。如果超过这个值就要分包。
	public byte      SignBagFlag;					//分包传输


	public int SupportPortionPaid; //是否支持部分支付
	public byte[] securityPwd=new byte[6+1];
	public int tradeResendTimes; //交易重复次数
	public byte[] AIDForECCOnly=new byte[16]; //纯电子现金卡的AID
	public int lenOfAIDForECCOnly; //纯电子现金卡的AID的长度
	public int bSupAuthRepresent; //是否支持小额代授权
	public byte[] agenyCode = new byte[13];
	public byte[] customNum = new byte[14];
	public byte[] fuyouWeb = new byte[20];
	public byte PrtStatus;							//打印状态，0-打印完成，1-该打第一联，2……高位是重打印标志
	
	public byte bMKeyNeedConfirm;				//主密钥未更新标志，需要发起 主密钥更新结束 交易
	public byte[]sMasterKey = new byte[20];		//主密钥(带有校验值)	
	public byte commuProtocol;					//通讯协议 0.socket 1.https
	public byte[] hostPath = new byte[128+1];	//主机路径 适用于https
	
	// 闪卡相关设置参数	added by ms 0929
	public int		currFlashTimeout;				//
	public int 		FlashCardTimeout;				//
	public byte bEnableFlushCard;	// 是否支持闪卡 0 不支持  1 支持
	public byte maxNumFashCardRec;	// 可保存的闪卡记录
	// 20160929
	
	public int ifNeedManagerKey;	// 是否需要主管密码(撤销/退货)

	public int getPinpad_type() {
		return pinpad_type;
	}

	public void setPinpad_type(int pinpad_type) {
		this.pinpad_type = pinpad_type;
	}

	public int getAKeyIndes() {
		return AKeyIndes;
	}

	public void setAKeyIndes(int aKeyIndes) {
		AKeyIndes = aKeyIndes;
	}

	public int getMainKeyIdx() {
		return MainKeyIdx;
	}

	public void setMainKeyIdx(int mainKeyIdx) {
		MainKeyIdx = mainKeyIdx;
	}

	public int getPinKeyIndes() {
		return PinKeyIndes;
	}

	public void setPinKeyIndes(int pinKeyIndes) {
		PinKeyIndes = pinKeyIndes;
	}

	public int getMacKeyIndes() {
		return MacKeyIndes;
	}

	public void setMacKeyIndes(int macKeyIndes) {
		MacKeyIndes = macKeyIndes;
	}

	public int getMagKeyIndes() {
		return MagKeyIndes;
	}

	public void setMagKeyIndes(int magKeyIndes) {
		MagKeyIndes = magKeyIndes;
	}

	public int getlTraceNo() {
		return lTraceNo;
	}

	public void setlTraceNo(int lTraceNo) {
		this.lTraceNo = lTraceNo;
	}

	public byte[] getTermSNo() {
		return termSNo;
	}

	public void setTermSNo(byte[] termSNo) {
		this.termSNo = termSNo;
	}

	public int getBeepForInput() {
		return beepForInput;
	}

	public void setBeepForInput(int beepForInput) {
		this.beepForInput = beepForInput;
	}

	public int getOprTimeoutValue() {
		return oprTimeoutValue;
	}

	public void setOprTimeoutValue(int oprTimeoutValue) {
		this.oprTimeoutValue = oprTimeoutValue;
	}

	public int getTradeTimeoutValue() {
		return tradeTimeoutValue;
	}

	public void setTradeTimeoutValue(int tradeTimeoutValue) {
		this.tradeTimeoutValue = tradeTimeoutValue;
	}

	public byte[] getTermSysAdminPwd() {
		return termSysAdminPwd;
	}

	public void setTermSysAdminPwd(byte[] termSysAdminPwd) {
		this.termSysAdminPwd = termSysAdminPwd;
	}

	public byte[] getPayOptPwd() {
		return payOptPwd;
	}

	public void setPayOptPwd(byte[] payOptPwd) {
		this.payOptPwd = payOptPwd;
	}

	public byte[] getLogonDate() {
		return logonDate;
	}

	public void setLogonDate(byte[] logonDate) {
		this.logonDate = logonDate;
	}

	public byte[] getManagerPwd() {
		return ManagerPwd;
	}

	public void setManagerPwd(byte[] managerPwd) {
		ManagerPwd = managerPwd;
	}

	public byte[] getTerminalNo() {
		return TerminalNo;
	}

	public void setTerminalNo(byte[] terminalNo) {
		TerminalNo = terminalNo;
	}

	public byte[] getMerchantNo() {
		return MerchantNo;
	}

	public void setMerchantNo(byte[] merchantNo) {
		MerchantNo = merchantNo;
	}

	public byte[] getFinance_card() {
		return finance_card;
	}

	public void setFinance_card(byte[] finance_card) {
		this.finance_card = finance_card;
	}

	public byte[] getMerchantName() {
		return MerchantName;
	}

	public void setMerchantName(byte[] merchantName) {
		MerchantName = merchantName;
	}

	public byte[] getCurrencyCode() {
		return CurrencyCode;
	}

	public void setCurrencyCode(byte[] currencyCode) {
		CurrencyCode = currencyCode;
	}

	public byte[] getCDTVer() {
		return CDTVer;
	}

	public void setCDTVer(byte[] cDTVer) {
		CDTVer = cDTVer;
	}

	public byte[] getVersion() {
		return Version;
	}

	public void setVersion(byte[] version) {
		Version = version;
	}

	public int getPrintErrReport() {
		return PrintErrReport;
	}

	public void setPrintErrReport(int printErrReport) {
		PrintErrReport = printErrReport;
	}

	public int getMaskForVoidTransPwd() {
		return maskForVoidTransPwd;
	}

	public void setMaskForVoidTransPwd(int maskForVoidTransPwd) {
		this.maskForVoidTransPwd = maskForVoidTransPwd;
	}

	public int getMaskForTransUseCard() {
		return maskForTransUseCard;
	}

	public void setMaskForTransUseCard(int maskForTransUseCard) {
		this.maskForTransUseCard = maskForTransUseCard;
	}

	public int getDefaultTrade() {
		return DefaultTrade;
	}

	public void setDefaultTrade(int defaultTrade) {
		DefaultTrade = defaultTrade;
	}

	public int getHandInput() {
		return HandInput;
	}

	public void setHandInput(int handInput) {
		HandInput = handInput;
	}

	public int getDesType() {
		return DesType;
	}

	public void setDesType(int desType) {
		DesType = desType;
	}

	public int getCompleteMode() {
		return CompleteMode;
	}

	public void setCompleteMode(int completeMode) {
		CompleteMode = completeMode;
	}

	public int getPreDial() {
		return PreDial;
	}

	public void setPreDial(int preDial) {
		PreDial = preDial;
	}

	public int getPromptICC() {
		return PromptICC;
	}

	public void setPromptICC(int promptICC) {
		PromptICC = promptICC;
	}

	public int getShieldPAN() {
		return ShieldPAN;
	}

	public void setShieldPAN(int shieldPAN) {
		ShieldPAN = shieldPAN;
	}

	public int getDCC_stage() {
		return DCC_stage;
	}

	public void setDCC_stage(int dCC_stage) {
		DCC_stage = dCC_stage;
	}

	public int getPreauth_flag() {
		return preauth_flag;
	}

	public void setPreauth_flag(int preauth_flag) {
		this.preauth_flag = preauth_flag;
	}

	public int getIcbccard_flag() {
		return icbccard_flag;
	}

	public void setIcbccard_flag(int icbccard_flag) {
		this.icbccard_flag = icbccard_flag;
	}

	public int getPboc_flag() {
		return pboc_flag;
	}

	public void setPboc_flag(int pboc_flag) {
		this.pboc_flag = pboc_flag;
	}

	public int getNwk_flag() {
		return nwk_flag;
	}

	public void setNwk_flag(int nwk_flag) {
		this.nwk_flag = nwk_flag;
	}

	public int getOffline_flag() {
		return offline_flag;
	}

	public void setOffline_flag(int offline_flag) {
		this.offline_flag = offline_flag;
	}

	public int getSettle_flag() {
		return settle_flag;
	}

	public void setSettle_flag(int settle_flag) {
		this.settle_flag = settle_flag;
	}

	public int getComm_type() {
		return comm_type;
	}

	public void setComm_type(int comm_type) {
		this.comm_type = comm_type;
	}

	public int getTickets_num() {
		return tickets_num;
	}

	public void setTickets_num(int tickets_num) {
		this.tickets_num = tickets_num;
	}

	public int getCard_table() {
		return card_table;
	}

	public void setCard_table(int card_table) {
		this.card_table = card_table;
	}

	public int getPos_type() {
		return pos_type;
	}

	public void setPos_type(int pos_type) {
		this.pos_type = pos_type;
	}

	public int getManual_flag() {
		return manual_flag;
	}

	public void setManual_flag(int manual_flag) {
		this.manual_flag = manual_flag;
	}

	public int getTerminalType() {
		return TerminalType;
	}

	public void setTerminalType(int terminalType) {
		TerminalType = terminalType;
	}

	public int getiTransNum() {
		return iTransNum;
	}

	public void setiTransNum(int iTransNum) {
		this.iTransNum = iTransNum;
	}

	public int getlNowBatchNum() {
		return lNowBatchNum;
	}

	public void setlNowBatchNum(int lNowBatchNum) {
		this.lNowBatchNum = lNowBatchNum;
	}

	public byte[] getOper_limit() {
		return oper_limit;
	}

	public void setOper_limit(byte[] oper_limit) {
		this.oper_limit = oper_limit;
	}

	public byte[] getManage_limit() {
		return manage_limit;
	}

	public void setManage_limit(byte[] manage_limit) {
		this.manage_limit = manage_limit;
	}

	public byte[] getSettDate() {
		return SettDate;
	}

	public void setSettDate(byte[] settDate) {
		SettDate = settDate;
	}

	public byte[] getCapkVer() {
		return CapkVer;
	}

	public void setCapkVer(byte[] capkVer) {
		CapkVer = capkVer;
	}

	public byte[] getParaVer() {
		return ParaVer;
	}

	public void setParaVer(byte[] paraVer) {
		ParaVer = paraVer;
	}

	public int getAppType() {
		return AppType;
	}

	public void setAppType(int appType) {
		AppType = appType;
	}

	public int getForceOnline() {
		return ForceOnline;
	}

	public void setForceOnline(int forceOnline) {
		ForceOnline = forceOnline;
	}

	public int getDifferential() {
		return Differential;
	}

	public void setDifferential(int differential) {
		Differential = differential;
	}

	public byte[] getLowAmt() {
		return LowAmt;
	}

	public void setLowAmt(byte[] lowAmt) {
		LowAmt = lowAmt;
	}

	public byte[] getMaxAmt() {
		return MaxAmt;
	}

	public void setMaxAmt(byte[] maxAmt) {
		MaxAmt = maxAmt;
	}

	public byte[] getMaxRefundAmt() {
		return MaxRefundAmt;
	}

	public void setMaxRefundAmt(byte[] maxRefundAmt) {
		MaxRefundAmt = maxRefundAmt;
	}

	public byte[] getMaxReimgursedAmt() {
		return MaxReimgursedAmt;
	}

	public void setMaxReimgursedAmt(byte[] maxReimgursedAmt) {
		MaxReimgursedAmt = maxReimgursedAmt;
	}

	public int getParamIsDown() {
		return ParamIsDown;
	}

	public void setParamIsDown(int paramIsDown) {
		ParamIsDown = paramIsDown;
	}

	public int getMainKeyDown() {
		return MainKeyDown;
	}

	public void setMainKeyDown(int mainKeyDown) {
		MainKeyDown = mainKeyDown;
	}

	public int getSupportICC() {
		return SupportICC;
	}

	public void setSupportICC(int supportICC) {
		SupportICC = supportICC;
	}

	public int getSupportDCC() {
		return SupportDCC;
	}

	public void setSupportDCC(int supportDCC) {
		SupportDCC = supportDCC;
	}

	public int getSupportCNPC() {
		return SupportCNPC;
	}

	public void setSupportCNPC(int supportCNPC) {
		SupportCNPC = supportCNPC;
	}

	public int getSupportECC() {
		return SupportECC;
	}

	public void setSupportECC(int supportECC) {
		SupportECC = supportECC;
	}

	public int getSupportFallBack() {
		return SupportFallBack;
	}

	public void setSupportFallBack(int supportFallBack) {
		SupportFallBack = supportFallBack;
	}

	public byte getIfSupportPICC() {
		return IfSupportPICC;
	}

	public void setIfSupportPICC(byte ifSupportPICC) {
		IfSupportPICC = ifSupportPICC;
	}

	public byte getIfSaleSupportPICC() {
		return IfSaleSupportPICC;
	}

	public void setIfSaleSupportPICC(byte ifSaleSupportPICC) {
		IfSaleSupportPICC = ifSaleSupportPICC;
	}

	public byte getSupportPICC() {
		return SupportPICC;
	}

	public void setSupportPICC(byte supportPICC) {
		SupportPICC = supportPICC;
	}

	public byte getPICCDelayTime() {
		return PICCDelayTime;
	}

	public void setPICCDelayTime(byte pICCDelayTime) {
		PICCDelayTime = pICCDelayTime;
	}

	public byte getOfflineTranFlag() {
		return OfflineTranFlag;
	}

	public void setOfflineTranFlag(byte offlineTranFlag) {
		OfflineTranFlag = offlineTranFlag;
	}

	public int getUcBatchStatus() {
		return ucBatchStatus;
	}

	public void setUcBatchStatus(int ucBatchStatus) {
		this.ucBatchStatus = ucBatchStatus;
	}

	public int getUcClearLog() {
		return ucClearLog;
	}

	public void setUcClearLog(int ucClearLog) {
		this.ucClearLog = ucClearLog;
	}

	public int getUcAutoLogoff() {
		return ucAutoLogoff;
	}

	public void setUcAutoLogoff(int ucAutoLogoff) {
		this.ucAutoLogoff = ucAutoLogoff;
	}

	public int getUcLogonFlag() {
		return ucLogonFlag;
	}

	public void setUcLogonFlag(int ucLogonFlag) {
		this.ucLogonFlag = ucLogonFlag;
	}

	public int getInstallment_flag() {
		return installment_flag;
	}

	public void setInstallment_flag(int installment_flag) {
		this.installment_flag = installment_flag;
	}

	public int getInstallment_BigAmt() {
		return installment_BigAmt;
	}

	public void setInstallment_BigAmt(int installment_BigAmt) {
		this.installment_BigAmt = installment_BigAmt;
	}

	public byte[] getInstallment_Maxnew() {
		return installment_Maxnew;
	}

	public void setInstallment_Maxnew(byte[] installment_Maxnew) {
		this.installment_Maxnew = installment_Maxnew;
	}

	public byte getQpbocChannel() {
		return qpbocChannel;
	}

	public void setQpbocChannel(byte qpbocChannel) {
		this.qpbocChannel = qpbocChannel;
	}

	public int getPaypass() {
		return paypass;
	}

	public void setPaypass(int paypass) {
		this.paypass = paypass;
	}

	public int getAuth_flag() {
		return auth_flag;
	}

	public void setAuth_flag(int auth_flag) {
		this.auth_flag = auth_flag;
	}

	public int getTip_flag() {
		return tip_flag;
	}

	public void setTip_flag(int tip_flag) {
		this.tip_flag = tip_flag;
	}

	public int getTip_rate() {
		return tip_rate;
	}

	public void setTip_rate(int tip_rate) {
		this.tip_rate = tip_rate;
	}

	public int getMaxTradeNum() {
		return MaxTradeNum;
	}

	public void setMaxTradeNum(int maxTradeNum) {
		MaxTradeNum = maxTradeNum;
	}

	public short getMaxSignNum() {
		return MaxSignNum;
	}

	public void setMaxSignNum(short maxSignNum) {
		MaxSignNum = maxSignNum;
	}

	public int getReverseTimes() {
		return ReverseTimes;
	}

	public void setReverseTimes(int reverseTimes) {
		ReverseTimes = reverseTimes;
	}

	public int getOfflineTimes() {
		return OfflineTimes;
	}

	public void setOfflineTimes(int offlineTimes) {
		OfflineTimes = offlineTimes;
	}

	public int getIfPrnDetail() {
		return IfPrnDetail;
	}

	public void setIfPrnDetail(int ifPrnDetail) {
		IfPrnDetail = ifPrnDetail;
	}

	public int getIfPrnEnglish() {
		return IfPrnEnglish;
	}

	public void setIfPrnEnglish(int ifPrnEnglish) {
		IfPrnEnglish = ifPrnEnglish;
	}

	public byte getPrntTicketType() {
		return PrntTicketType;
	}

	public void setPrntTicketType(byte prntTicketType) {
		PrntTicketType = prntTicketType;
	}

	public int getTicketStype() {
		return ticketStype;
	}

	public void setTicketStype(int ticketStype) {
		this.ticketStype = ticketStype;
	}

	public int getUseDefTicketHead() {
		return useDefTicketHead;
	}

	public void setUseDefTicketHead(int useDefTicketHead) {
		this.useDefTicketHead = useDefTicketHead;
	}

	public byte[] getTicketHead() {
		return ticketHead;
	}

	public void setTicketHead(byte[] ticketHead) {
		this.ticketHead = ticketHead;
	}

	public byte[] getsManageNum() {
		return sManageNum;
	}

	public void setsManageNum(byte[] sManageNum) {
		this.sManageNum = sManageNum;
	}

	public byte getCommSelf() {
		return CommSelf;
	}

	public void setCommSelf(byte commSelf) {
		CommSelf = commSelf;
	}

	public byte getIsMis() {
		return IsMis;
	}

	public void setIsMis(byte isMis) {
		IsMis = isMis;
	}

	public byte[] getTransflag() {
		return transflag;
	}

	public void setTransflag(byte[] transflag) {
		this.transflag = transflag;
	}

	public int getFlagCentreReq() {
		return flagCentreReq;
	}

	public void setFlagCentreReq(int flagCentreReq) {
		this.flagCentreReq = flagCentreReq;
	}

	public int getFlagReserve() {
		return flagReserve;
	}

	public void setFlagReserve(int flagReserve) {
		this.flagReserve = flagReserve;
	}

	public byte[] getEmvDownFlag() {
		return EmvDownFlag;
	}

	public void setEmvDownFlag(byte[] emvDownFlag) {
		EmvDownFlag = emvDownFlag;
	}

	public byte[] getReimCompanyCard() {
		return ReimCompanyCard;
	}

	public void setReimCompanyCard(byte[] reimCompanyCard) {
		ReimCompanyCard = reimCompanyCard;
	}

	public int getnComBps() {
		return nComBps;
	}

	public void setnComBps(int nComBps) {
		this.nComBps = nComBps;
	}

	public byte[] getTerminalTmsVer() {
		return TerminalTmsVer;
	}

	public void setTerminalTmsVer(byte[] terminalTmsVer) {
		TerminalTmsVer = terminalTmsVer;
	}

	public int getDownFlag() {
		return DownFlag;
	}

	public void setDownFlag(int downFlag) {
		DownFlag = downFlag;
	}

	public byte[] getDownTime() {
		return DownTime;
	}

	public void setDownTime(byte[] downTime) {
		DownTime = downTime;
	}

	public byte[] getVirtualTermNo() {
		return VirtualTermNo;
	}

	public void setVirtualTermNo(byte[] virtualTermNo) {
		VirtualTermNo = virtualTermNo;
	}

	public byte[] getAppTradeType() {
		return AppTradeType;
	}

	public void setAppTradeType(byte[] appTradeType) {
		AppTradeType = appTradeType;
	}

	public byte getPrnENRecvBankId() {
		return PrnENRecvBankId;
	}

	public void setPrnENRecvBankId(byte prnENRecvBankId) {
		PrnENRecvBankId = prnENRecvBankId;
	}

	public byte getIsCData() {
		return IsCData;
	}

	public void setIsCData(byte isCData) {
		IsCData = isCData;
	}

	public byte[] getBTName() {
		return BTName;
	}

	public void setBTName(byte[] bTName) {
		BTName = bTName;
	}

	public byte[] getBTMacAdr() {
		return BTMacAdr;
	}

	public void setBTMacAdr(byte[] bTMacAdr) {
		BTMacAdr = bTMacAdr;
	}

	public byte[] getUUID() {
		return UUID;
	}

	public void setUUID(byte[] uUID) {
		UUID = uUID;
	}

	public byte[] getAppNum() {
		return AppNum;
	}

	public void setAppNum(byte[] appNum) {
		AppNum = appNum;
	}

	public byte getMisComPort() {
		return MisComPort;
	}

	public void setMisComPort(byte misComPort) {
		MisComPort = misComPort;
	}

	public byte getCommWithCash() {
		return CommWithCash;
	}

	public void setCommWithCash(byte commWithCash) {
		CommWithCash = commWithCash;
	}

	public int getSupportQPbocExType() {
		return supportQPbocExType;
	}

	public void setSupportQPbocExType(int supportQPbocExType) {
		this.supportQPbocExType = supportQPbocExType;
	}

	public int getQpbocExSFI() {
		return qpbocExSFI;
	}

	public void setQpbocExSFI(int qpbocExSFI) {
		this.qpbocExSFI = qpbocExSFI;
	}

	public byte[] getQpbocExAppId() {
		return qpbocExAppId;
	}

	public void setQpbocExAppId(byte[] qpbocExAppId) {
		this.qpbocExAppId = qpbocExAppId;
	}

	public byte getSupportSignPad() {
		return SupportSignPad;
	}

	public void setSupportSignPad(byte supportSignPad) {
		SupportSignPad = supportSignPad;
	}

	public byte getSupportSignPrn() {
		return SupportSignPrn;
	}

	public void setSupportSignPrn(byte supportSignPrn) {
		SupportSignPrn = supportSignPrn;
	}

	public byte getSupPrnMerSign() {
		return SupPrnMerSign;
	}

	public void setSupPrnMerSign(byte supPrnMerSign) {
		SupPrnMerSign = supPrnMerSign;
	}

	public byte getSignTimeoutS() {
		return SignTimeoutS;
	}

	public void setSignTimeoutS(byte signTimeoutS) {
		SignTimeoutS = signTimeoutS;
	}

	public short getSignRecNum() {
		return SignRecNum;
	}

	public void setSignRecNum(short signRecNum) {
		SignRecNum = signRecNum;
	}

	public byte getSignMaxNum() {
		return SignMaxNum;
	}

	public void setSignMaxNum(byte signMaxNum) {
		SignMaxNum = signMaxNum;
	}

	public short getSignBagMaxLen() {
		return SignBagMaxLen;
	}

	public void setSignBagMaxLen(short signBagMaxLen) {
		SignBagMaxLen = signBagMaxLen;
	}

	public byte getSignBagFlag() {
		return SignBagFlag;
	}

	public void setSignBagFlag(byte signBagFlag) {
		SignBagFlag = signBagFlag;
	}

	public int getSupportPortionPaid() {
		return SupportPortionPaid;
	}

	public void setSupportPortionPaid(int supportPortionPaid) {
		SupportPortionPaid = supportPortionPaid;
	}

	public byte[] getSecurityPwd() {
		return securityPwd;
	}

	public void setSecurityPwd(byte[] securityPwd) {
		this.securityPwd = securityPwd;
	}

	public int getTradeResendTimes() {
		return tradeResendTimes;
	}

	public void setTradeResendTimes(int tradeResendTimes) {
		this.tradeResendTimes = tradeResendTimes;
	}

	public byte[] getAIDForECCOnly() {
		return AIDForECCOnly;
	}

	public void setAIDForECCOnly(byte[] aIDForECCOnly) {
		AIDForECCOnly = aIDForECCOnly;
	}

	public int getLenOfAIDForECCOnly() {
		return lenOfAIDForECCOnly;
	}

	public void setLenOfAIDForECCOnly(int lenOfAIDForECCOnly) {
		this.lenOfAIDForECCOnly = lenOfAIDForECCOnly;
	}

	public int getbSupAuthRepresent() {
		return bSupAuthRepresent;
	}

	public void setbSupAuthRepresent(int bSupAuthRepresent) {
		this.bSupAuthRepresent = bSupAuthRepresent;
	}

	public byte[] getAgenyCode() {
		return agenyCode;
	}

	public void setAgenyCode(byte[] agenyCode) {
		this.agenyCode = agenyCode;
	}

	public byte[] getCustomNum() {
		return customNum;
	}

	public void setCustomNum(byte[] customNum) {
		this.customNum = customNum;
	}

	public byte[] getFuyouWeb() {
		return fuyouWeb;
	}

	public void setFuyouWeb(byte[] fuyouWeb) {
		this.fuyouWeb = fuyouWeb;
	}

	public byte getPrtStatus() {
		return PrtStatus;
	}

	public void setPrtStatus(byte prtStatus) {
		PrtStatus = prtStatus;
	}

	public byte getbMKeyNeedConfirm() {
		return bMKeyNeedConfirm;
	}

	public void setbMKeyNeedConfirm(byte bMKeyNeedConfirm) {
		this.bMKeyNeedConfirm = bMKeyNeedConfirm;
	}

	public byte[] getsMasterKey() {
		return sMasterKey;
	}

	public void setsMasterKey(byte[] sMasterKey) {
		this.sMasterKey = sMasterKey;
	}

	public byte getCommuProtocol() {
		return commuProtocol;
	}

	public void setCommuProtocol(byte commuProtocol) {
		this.commuProtocol = commuProtocol;
	}

	public byte[] getHostPath() {
		return hostPath;
	}

	public void setHostPath(byte[] hostPath) {
		this.hostPath = hostPath;
	}

	public int getCurrFlashTimeout() {
		return currFlashTimeout;
	}

	public void setCurrFlashTimeout(int currFlashTimeout) {
		this.currFlashTimeout = currFlashTimeout;
	}

	public int getFlashCardTimeout() {
		return FlashCardTimeout;
	}

	public void setFlashCardTimeout(int flashCardTimeout) {
		FlashCardTimeout = flashCardTimeout;
	}

	public byte getbEnableFlushCard() {
		return bEnableFlushCard;
	}

	public void setbEnableFlushCard(byte bEnableFlushCard) {
		this.bEnableFlushCard = bEnableFlushCard;
	}

	public byte getMaxNumFashCardRec() {
		return maxNumFashCardRec;
	}

	public void setMaxNumFashCardRec(byte maxNumFashCardRec) {
		this.maxNumFashCardRec = maxNumFashCardRec;
	}

	public int getIfNeedManagerKey() {
		return ifNeedManagerKey;
	}

	public void setIfNeedManagerKey(int ifNeedManagerKey) {
		this.ifNeedManagerKey = ifNeedManagerKey;
	}

	@Override
	public byte[] toBytes() {
		byte[] msgByte=new byte[size()];
		byte[]tmp=null;
		int len=0;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(pinpad_type);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(AKeyIndes);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(MainKeyIdx);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(PinKeyIndes);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(MacKeyIndes);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(MagKeyIndes);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(lTraceNo);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[termSNo.length];
		tmp=termSNo;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(beepForInput);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(oprTimeoutValue);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(tradeTimeoutValue);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[termSysAdminPwd.length];
		tmp=termSysAdminPwd;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[payOptPwd.length];
		tmp=payOptPwd;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[logonDate.length];
		tmp=logonDate;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[ManagerPwd.length];
		tmp=ManagerPwd;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[TerminalNo.length];
		tmp=TerminalNo;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[MerchantNo.length];
		tmp=MerchantNo;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[finance_card.length];
		tmp=finance_card;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[MerchantName.length];
		tmp=MerchantName;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[CurrencyCode.length];
		tmp=CurrencyCode;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[CDTVer.length];
		tmp=CDTVer;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[Version.length];
		tmp=Version;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(PrintErrReport);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(maskForVoidTransPwd);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(maskForTransUseCard);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(DefaultTrade);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(HandInput);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(DesType);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(CompleteMode);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(PreDial);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(PromptICC);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ShieldPAN);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(DCC_stage);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(preauth_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(icbccard_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(pboc_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(nwk_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(offline_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(settle_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(comm_type);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(tickets_num);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(card_table);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(pos_type);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(manual_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(TerminalType);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(iTransNum);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(lNowBatchNum);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[oper_limit.length];
		tmp=oper_limit;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[manage_limit.length];
		tmp=manage_limit;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[SettDate.length];
		tmp=SettDate;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[CapkVer.length];
		tmp=CapkVer;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[ParaVer.length];
		tmp=ParaVer;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(AppType);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ForceOnline);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(Differential);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[LowAmt.length];
		tmp=LowAmt;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[MaxAmt.length];
		tmp=MaxAmt;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[MaxRefundAmt.length];
		tmp=MaxRefundAmt;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[MaxReimgursedAmt.length];
		tmp=MaxReimgursedAmt;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ParamIsDown);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(MainKeyDown);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(SupportICC);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(SupportDCC);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(SupportCNPC);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(SupportECC);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(SupportFallBack);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[1];
		tmp[0]=IfSupportPICC;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=IfSaleSupportPICC;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=SupportPICC;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=PICCDelayTime;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=OfflineTranFlag;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ucBatchStatus);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ucClearLog);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ucAutoLogoff);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ucLogonFlag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(installment_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(installment_BigAmt);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[installment_Maxnew.length];
		tmp=installment_Maxnew;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=qpbocChannel;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(paypass);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(auth_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(tip_flag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(tip_rate);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(MaxTradeNum);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[2];
		tmp=com.vanstone.utils.CommonConvert.shortToBytes(MaxSignNum);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=2;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ReverseTimes);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(OfflineTimes);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(IfPrnDetail);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(IfPrnEnglish);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[1];
		tmp[0]=PrntTicketType;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ticketStype);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(useDefTicketHead);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[ticketHead.length];
		tmp=ticketHead;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[sManageNum.length];
		tmp=sManageNum;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=CommSelf;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=IsMis;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[transflag.length];
		tmp=transflag;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(flagCentreReq);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(flagReserve);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[EmvDownFlag.length];
		tmp=EmvDownFlag;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[ReimCompanyCard.length];
		tmp=ReimCompanyCard;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(nComBps);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[TerminalTmsVer.length];
		tmp=TerminalTmsVer;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(DownFlag);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[DownTime.length];
		tmp=DownTime;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[VirtualTermNo.length];
		tmp=VirtualTermNo;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[AppTradeType.length];
		tmp=AppTradeType;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=PrnENRecvBankId;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=IsCData;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[BTName.length];
		tmp=BTName;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[BTMacAdr.length];
		tmp=BTMacAdr;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[UUID.length];
		tmp=UUID;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[AppNum.length];
		tmp=AppNum;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=MisComPort;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=CommWithCash;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(supportQPbocExType);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(qpbocExSFI);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[qpbocExAppId.length];
		tmp=qpbocExAppId;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=SupportSignPad;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=SupportSignPrn;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=SupPrnMerSign;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=SignTimeoutS;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[2];
		tmp=com.vanstone.utils.CommonConvert.shortToBytes(SignRecNum);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=2;
		tmp=new byte[1];
		tmp[0]=SignMaxNum;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[2];
		tmp=com.vanstone.utils.CommonConvert.shortToBytes(SignBagMaxLen);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=2;
		tmp=new byte[1];
		tmp[0]=SignBagFlag;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(SupportPortionPaid);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[securityPwd.length];
		tmp=securityPwd;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(tradeResendTimes);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[AIDForECCOnly.length];
		tmp=AIDForECCOnly;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(lenOfAIDForECCOnly);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(bSupAuthRepresent);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[agenyCode.length];
		tmp=agenyCode;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[customNum.length];
		tmp=customNum;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[fuyouWeb.length];
		tmp=fuyouWeb;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=PrtStatus;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=bMKeyNeedConfirm;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[sMasterKey.length];
		tmp=sMasterKey;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=commuProtocol;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[hostPath.length];
		tmp=hostPath;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(currFlashTimeout);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(FlashCardTimeout);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		tmp=new byte[1];
		tmp[0]=bEnableFlushCard;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[1];
		tmp[0]=maxNumFashCardRec;
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		tmp=new byte[4];
		tmp=com.vanstone.utils.CommonConvert.intToBytes(ifNeedManagerKey);
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=4;
		if(len%4!=0)
		{
		tmp = new byte[4-len%4];
		System.arraycopy(tmp, 0, msgByte, len, tmp.length);
		len+=tmp.length;
		}
		return msgByte;
	}

	@Override
	public int size() {
		int len=0;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=termSNo.length;
		len+=4;
		len+=4;
		len+=4;
		len+=termSysAdminPwd.length;
		len+=payOptPwd.length;
		len+=logonDate.length;
		len+=ManagerPwd.length;
		len+=TerminalNo.length;
		len+=MerchantNo.length;
		len+=finance_card.length;
		len+=MerchantName.length;
		len+=CurrencyCode.length;
		len+=CDTVer.length;
		len+=Version.length;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=oper_limit.length;
		len+=manage_limit.length;
		len+=SettDate.length;
		len+=CapkVer.length;
		len+=ParaVer.length;
		len+=4;
		len+=4;
		len+=4;
		len+=LowAmt.length;
		len+=MaxAmt.length;
		len+=MaxRefundAmt.length;
		len+=MaxReimgursedAmt.length;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=1;
		len+=1;
		len+=1;
		len+=1;
		len+=1;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=installment_Maxnew.length;
		len+=1;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=2;
		len+=4;
		len+=4;
		len+=4;
		len+=4;
		len+=1;
		len+=4;
		len+=4;
		len+=ticketHead.length;
		len+=sManageNum.length;
		len+=1;
		len+=1;
		len+=transflag.length;
		len+=4;
		len+=4;
		len+=EmvDownFlag.length;
		len+=ReimCompanyCard.length;
		len+=4;
		len+=TerminalTmsVer.length;
		len+=4;
		len+=DownTime.length;
		len+=VirtualTermNo.length;
		len+=AppTradeType.length;
		len+=1;
		len+=1;
		len+=BTName.length;
		len+=BTMacAdr.length;
		len+=UUID.length;
		len+=AppNum.length;
		len+=1;
		len+=1;
		len+=4;
		len+=4;
		len+=qpbocExAppId.length;
		len+=1;
		len+=1;
		len+=1;
		len+=1;
		len+=2;
		len+=1;
		len+=2;
		len+=1;
		len+=4;
		len+=securityPwd.length;
		len+=4;
		len+=AIDForECCOnly.length;
		len+=4;
		len+=4;
		len+=agenyCode.length;
		len+=customNum.length;
		len+=fuyouWeb.length;
		len+=1;
		len+=1;
		len+=sMasterKey.length;
		len+=1;
		len+=hostPath.length;
		len+=4;
		len+=4;
		len+=1;
		len+=1;
		len+=4;
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
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		pinpad_type=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		AKeyIndes=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MainKeyIdx=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		PinKeyIndes=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MacKeyIndes=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MagKeyIndes=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		lTraceNo=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[termSNo.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		termSNo=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		beepForInput=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		oprTimeoutValue=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		tradeTimeoutValue=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[termSysAdminPwd.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		termSysAdminPwd=tmp;
		len+=tmp.length;
		tmp=new byte[payOptPwd.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		payOptPwd=tmp;
		len+=tmp.length;
		tmp=new byte[logonDate.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		logonDate=tmp;
		len+=tmp.length;
		tmp=new byte[ManagerPwd.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ManagerPwd=tmp;
		len+=tmp.length;
		tmp=new byte[TerminalNo.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		TerminalNo=tmp;
		len+=tmp.length;
		tmp=new byte[MerchantNo.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MerchantNo=tmp;
		len+=tmp.length;
		tmp=new byte[finance_card.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		finance_card=tmp;
		len+=tmp.length;
		tmp=new byte[MerchantName.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MerchantName=tmp;
		len+=tmp.length;
		tmp=new byte[CurrencyCode.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		CurrencyCode=tmp;
		len+=tmp.length;
		tmp=new byte[CDTVer.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		CDTVer=tmp;
		len+=tmp.length;
		tmp=new byte[Version.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Version=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		PrintErrReport=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		maskForVoidTransPwd=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		maskForTransUseCard=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		DefaultTrade=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		HandInput=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		DesType=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		CompleteMode=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		PreDial=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		PromptICC=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ShieldPAN=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		DCC_stage=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		preauth_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		icbccard_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		pboc_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		nwk_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		offline_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		settle_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		comm_type=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		tickets_num=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		card_table=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		pos_type=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		manual_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		TerminalType=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		iTransNum=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		lNowBatchNum=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[oper_limit.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		oper_limit=tmp;
		len+=tmp.length;
		tmp=new byte[manage_limit.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		manage_limit=tmp;
		len+=tmp.length;
		tmp=new byte[SettDate.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SettDate=tmp;
		len+=tmp.length;
		tmp=new byte[CapkVer.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		CapkVer=tmp;
		len+=tmp.length;
		tmp=new byte[ParaVer.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ParaVer=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		AppType=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ForceOnline=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		Differential=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[LowAmt.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		LowAmt=tmp;
		len+=tmp.length;
		tmp=new byte[MaxAmt.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MaxAmt=tmp;
		len+=tmp.length;
		tmp=new byte[MaxRefundAmt.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MaxRefundAmt=tmp;
		len+=tmp.length;
		tmp=new byte[MaxReimgursedAmt.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MaxReimgursedAmt=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ParamIsDown=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MainKeyDown=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupportICC=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupportDCC=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupportCNPC=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupportECC=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupportFallBack=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		IfSupportPICC=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		IfSaleSupportPICC=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupportPICC=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		PICCDelayTime=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		OfflineTranFlag=tmp[0];
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucBatchStatus=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucClearLog=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucAutoLogoff=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ucLogonFlag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		installment_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		installment_BigAmt=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[installment_Maxnew.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		installment_Maxnew=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		qpbocChannel=tmp[0];
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		paypass=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		auth_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		tip_flag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		tip_rate=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MaxTradeNum=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[2];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MaxSignNum=com.vanstone.utils.CommonConvert.bytesToShort(tmp);
		len+=2;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ReverseTimes=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		OfflineTimes=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		IfPrnDetail=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		IfPrnEnglish=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		PrntTicketType=tmp[0];
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ticketStype=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		useDefTicketHead=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[ticketHead.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ticketHead=tmp;
		len+=tmp.length;
		tmp=new byte[sManageNum.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sManageNum=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		CommSelf=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		IsMis=tmp[0];
		len+=tmp.length;
		tmp=new byte[transflag.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		transflag=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		flagCentreReq=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		flagReserve=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[EmvDownFlag.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		EmvDownFlag=tmp;
		len+=tmp.length;
		tmp=new byte[ReimCompanyCard.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ReimCompanyCard=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		nComBps=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[TerminalTmsVer.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		TerminalTmsVer=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		DownFlag=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[DownTime.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		DownTime=tmp;
		len+=tmp.length;
		tmp=new byte[VirtualTermNo.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		VirtualTermNo=tmp;
		len+=tmp.length;
		tmp=new byte[AppTradeType.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		AppTradeType=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		PrnENRecvBankId=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		IsCData=tmp[0];
		len+=tmp.length;
		tmp=new byte[BTName.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		BTName=tmp;
		len+=tmp.length;
		tmp=new byte[BTMacAdr.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		BTMacAdr=tmp;
		len+=tmp.length;
		tmp=new byte[UUID.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		UUID=tmp;
		len+=tmp.length;
		tmp=new byte[AppNum.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		AppNum=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		MisComPort=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		CommWithCash=tmp[0];
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		supportQPbocExType=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		qpbocExSFI=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[qpbocExAppId.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		qpbocExAppId=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupportSignPad=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupportSignPrn=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupPrnMerSign=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SignTimeoutS=tmp[0];
		len+=tmp.length;
		tmp=new byte[2];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SignRecNum=com.vanstone.utils.CommonConvert.bytesToShort(tmp);
		len+=2;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SignMaxNum=tmp[0];
		len+=tmp.length;
		tmp=new byte[2];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SignBagMaxLen=com.vanstone.utils.CommonConvert.bytesToShort(tmp);
		len+=2;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SignBagFlag=tmp[0];
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		SupportPortionPaid=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[securityPwd.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		securityPwd=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		tradeResendTimes=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[AIDForECCOnly.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		AIDForECCOnly=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		lenOfAIDForECCOnly=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		bSupAuthRepresent=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[agenyCode.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		agenyCode=tmp;
		len+=tmp.length;
		tmp=new byte[customNum.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		customNum=tmp;
		len+=tmp.length;
		tmp=new byte[fuyouWeb.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		fuyouWeb=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		PrtStatus=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		bMKeyNeedConfirm=tmp[0];
		len+=tmp.length;
		tmp=new byte[sMasterKey.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		sMasterKey=tmp;
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		commuProtocol=tmp[0];
		len+=tmp.length;
		tmp=new byte[hostPath.length];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		hostPath=tmp;
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		currFlashTimeout=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		FlashCardTimeout=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		bEnableFlushCard=tmp[0];
		len+=tmp.length;
		tmp=new byte[1];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		maxNumFashCardRec=tmp[0];
		len+=tmp.length;
		tmp=new byte[4];
		System.arraycopy(buf, len, tmp, 0, tmp.length);
		ifNeedManagerKey=com.vanstone.utils.CommonConvert.bytesToInt(tmp);
		len+=4;
	}
	
	

}
