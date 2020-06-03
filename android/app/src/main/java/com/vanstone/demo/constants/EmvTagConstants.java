package com.vanstone.demo.constants;

public class EmvTagConstants {
	///下面添加一些TAG的定义
	public static final int TLV_TAG_IIN = 0x43;   			//行业识别码(IIN)
	public static final int TLV_TAG_AID = 0x4F;				//应用标识符(AID)
	public static final int TLV_TAG_ALABEL = 0x50;			//应用标签
	public static final int TLV_TAG_TRACK2EQ = 0x57;		//二磁道等效数据
	public static final int TLV_TAG_PAN = 0x5A;				//应用主帐号(PAN)
	public static final int TLV_TAG_DDFNAME = 0x5D; 		//目录定义文件(DDF)名称
	public static final int TLV_TAG_CVNAME = 0x5F20; 		//持卡人姓名
	public static final int TLV_TAG_INVALID_DATE = 0x5F24; 	//应用失效日期
	public static final int TLV_TAG_VALID_DATE = 0x5F25;	//应用生效日期
	public static final int TLV_TAG_ISCODE = 0x5F28;		//发卡行国家代码
	public static final int TLV_TAG_TCCODE = 0x5F2A;		//交易货币代码
	public static final int TLV_TAG_FSELLAG = 0x5F2D;		//首选语言
	public static final int TLV_TAG_SVRCODE = 0x5F30;		//服务码
	public static final int TLV_TAG_PANSEQ = 0x5F34; 		//应用主帐号序列号
	public static final int TLV_TAG_IURL = 0x5F50; 			//发卡行URL
	public static final int TLV_TAG_IBAN = 0x5F53; 			//国际银行账户
	public static final int TLV_TAG_BIC = 0x5F54; 			//银行标识符代码(BIC)
	public static final int TLV_TAG_ISCODE_ALPH2 = 0x5F55; 	//发卡行国家代码(alpha2格式)
	public static final int TLV_TAG_ISCODE_ALPH3 = 0x5F56; 	//发卡行国家代码(alpha3格式)
	public static final int TLV_TAG_APPTEMP = 0x61;			//应用模板
	public static final int TLV_TAG_FCITEMP = 0x6F;			//文件控制信息(FCI)模板
	public static final int TLV_TAG_RPD = 0x70;				//响应报文数据
	public static final int TLV_TAG_RPTFMT2 = 0x77;			//响应报文模板格式2
	public static final int TLV_TAG_ISCRIPTFMT2 = 0x72;		//发卡行脚本模板2
	public static final int TLV_TAG_DDT = 0x73;				//目录自定义模板
	public static final int TLV_TAG_RPTFMT  = 0x80;			//响应报文模板格式1: IC卡命令响应信息，包括数据对象（不包括标签和长度）
	public static final int TLV_TAG_AMT_B = 0x81;			//授权金额（二进制, 不包括调整）
	public static final int TLV_TAG_AIP = 0x82;				//应用交行特征(AIP)
	public static final int TLV_TAG_DFN = 0x84;				//专用文件(DF)名称
	public static final int TLV_TAG_ISC = 0x86;				//发卡行脚本命令
	public static final int TLV_TAG_ALP = 0x87;				//应用优先级指示符
	public static final int TLV_TAG_SFI = 0x88;				//短文件标识符
	public static final int TLV_TAG_ARC = 0x8A;				//授权响应码
	public static final int TLV_TAG_CDOL1 = 0x8C;			//卡片风险管理数据对象列表1
	public static final int TLV_TAG_CDOL2 = 0x8D;			//卡片风险管理数据对象列表2
	public static final int TLV_TAG_CVML = 0x8E;			//持卡人验证方法(CVM)列表
	public static final int TLV_TAG_CAPKI = 0x8F;			//CA公钥索引(PKI)
	public static final int TLV_TAG_IPKC = 0x90;			//发卡行公钥证书
	public static final int TLV_TAG_IAD = 0x91;				//发卡行认证数据
	public static final int TLV_TAG_ICPR = 0x92;			//发卡行公钥余数
	public static final int TLV_TAG_SSAD = 0x93;			//签名的静态应用数据
	public static final int TLV_TAG_AFL = 0x94;				//应用文件定位器(AFL)
	public static final int TLV_TAG_TVR = 0x95;
	public static final int TLV_TAG_TDOL = 0x97;			//交易证书数据对象列表(TDOL)
	public static final int TLV_TAG_TDATE = 0x9A;			//交易日期
	public static final int TLV_TAG_TSI = 0x9B;				//交易状态信息
	public static final int TLV_TAG_TTYPE = 0x9C;			//交易类型
	public static final int TLV_TAG_DDATAFNAME = 0x9D;		//目录数据文件(DDF)名称
	public static final int TLV_TAG_ACCOUNT_TYPE = 0x5F57;
	public static final int TLV_TAG_AMT = 0x9F02;			//授权金额
	public static final int TLV_TAG_OMT = 0x9F03;			//其他金额(n12)
	public static final int TLV_TAG_OMT_B = 0x9F04;		 	//其他金额(二进制b4, 表示返现金额)
	public static final int TLV_TAG_ADD = 0x9F05;			//应用自定义数据
	public static final int TLV_TAG_AIDONT = 0x9F06;		//应用标识符(AID)-终端
	public static final int TLV_TAG_AUC = 0x9F07;			//应用用途控制(AUC)
	public static final int TLV_TAG_CAV = 0x9F08;			//卡片应用版本号
	public static final int TLV_TAG_TAV = 0x9F09;			//终端应用版本号
	public static final int TLV_TAG_CHNEX = 0x9F0B;			//持卡人姓名扩展
	public static final int TLV_TAG_IAC_DEF = 0x9F0D;		//发卡行行为代码(IAC)-缺省
	public static final int TLV_TAG_IAC_REFUSE = 0x9F0E;	//发卡行行为代码(IAC)-拒绝
	public static final int TLV_TAG_IAC_ONLINE = 0x9F0F;	//发卡行行为代码(IAC)-联机
	public static final int TLV_TAG_IAPPD = 0x9F10;			//发卡行应用数据
	public static final int TLV_TAG_ICI = 0x9F11;			//发卡行代码表索引
	public static final int TLV_TAG_AFN = 0x9F12; 			//应用首选名称
	public static final int TLV_TAG_LOATCREG = 0x9F13; 		//上次联机应用交易计算器(ATC)寄存器
	public static final int TLV_TAG_SOTFLOOR = 0x9F14;		//连续脱机交易下限
	public static final int TLV_TAG_COTPIN = 0x9F17;		//PIN尝试计数器
	public static final int TLV_TAG_TSC = 0x9F1A;		 	//终端国家代码
	public static final int TLV_TAG_TFLOOR = 0x9F1B; 		//终端最低限额
	public static final int TLV_TAG_TRACK1 = 0x9F1F; 		//磁条1自定义数据
	public static final int TLV_TAG_TRDTIME = 0x9F21; 		//交易时间
	public static final int TLV_TAG_SOFFTTOP = 0x9F23;		//连续脱机交易上限-次数(终端)
	public static final int TLV_TAG_AC = 0x9F26;			//应用密文
	public static final int TLV_TAG_CID = 0x9F27;			//密文信息数据
	public static final int TLV_TAG_IPKEXP = 0x9F32; 		//发卡行公钥指数
	public static final int TLV_TAG_ATC = 0x9F36; 			//应用交易计数器
	public static final int TLV_TAG_UNPRENUM = 0x9f37;  	//不可预知数
	public static final int TLV_TAG_PDOL = 0x9F38; 			//处理选项数据对象列表(PDOL)
	public static final int TLV_TAG_ACC_CVM = 0x9F42; 		//应用货币代码--执行CVM中的额度检测
	public static final int TLV_TAG_ACEXP = 0x9F44; 		//应用货币指数
	public static final int TLV_TAG_DAC = 0x9F45; 			//数据认证码
	public static final int TLV_TAG_ICPKC = 0x9F46; 		//IC卡公钥证书
	public static final int TLV_TAG_ICPKEXP = 0x9F47;		//IC卡公钥指数
	public static final int TLV_TAG_ICPKR = 0x9F48; 		//IC卡公钥余数
	public static final int TLV_TAG_DDOL = 0x9F49;			//动态数据认证数据对象列表(DDOL)
	public static final int TLV_TAG_SDOL = 0x9F4A; 			//静态数据认证标签列表
	public static final int TLV_TAG_SDAD = 0x9F4B; 			//签名的动态应用数据
	public static final int TLV_TAG_IDD = 0x9F4C; 			//IC卡动态数据
	public static final int TLV_TAG_EOL = 0x9F4D; 			//日志入口
	public static final int TLV_TAG_MERNAME = 0x9F4E; 		//商户名称
	public static final int TLV_TAG_LOFFMT = 0x9F4F; 		//日志格式
	public static final int TLV_TAG_ACC_MCHECK = 0x9F51; 	//应用货币代码--执行额度检测
	public static final int TLV_TAG_ADA = 0x9F52;			//应用缺省行为(ADA) len=2
	public static final int TLV_TAG_SOFFTTOP_INT = 0x9F53; 	//连续脱机交易限制数(国际-货币),次数

	public static final int TLV_TAG_AOS_AMT = 0x9F5D;		//可用脱机消费金额
	public static final int TLV_TAG_CARD_ARD = 0x9F69;		//Card Authentication Related Data 卡片认证相关数据 变长 8--16字节,pboc3.0定义为8字节

	public static final int TLV_TAG_IDDFCI = 0xBF0C;		//发卡行自定义数据FCI
	public static final int TLV_TAG_FCISTEMP = 0xA5;		//文件控制信息(FCI)专有模板
	public static final int TLV_TAG_ECTTL = 0x9F7B;			//电子现金终端交易限额(EC Terminal Transaction Limit) len=6
	public static final int TLV_TAG_ECTSI = 0x9F7A;			//电子现金终端支持指示器(EC Terminal Support Indicator) len=1
	public static final int TLV_TAG_ECB = 0x9F79;			//电子现金余额(EC Balance)
	public static final int TLV_TAG_ECSTL = 0x9F78;			//电子现金单笔交易限额(EC Single Transaction Limit)
	public static final int TLV_TAG_ECBL = 0x9F77;			//电子现金余额上限(EC Balance Limit)
	public static final int TLV_TAG_SECCC = 0x9F76;			//第2应用货币代码
	public static final int TLV_TAG_ACCOFFTAL_DC = 0x9F75;	//累计脱机交易金额限制数(双货币)
	public static final int TLV_TAG_ECIAC = 0x9F74;			//电子现金发卡行授权码(EC Issuer Authorization Code) len = 6 内容为ECCxxx--xxx为是发卡行定义的编号
	public static final int TLV_TAG_ECRT  = 0x9F6D;			//电子现金重置阈值（EC Reset Threshold）len = 6

	public static final int TLV_TAG_TTQ = 0x9F66;			//终端交易属性
	public static final int TLV_TAG_CAPP_TI = 0xDF60;		//分段扣费指示器
	public static final int TLV_TAG_QPBOCEX_CSIGN = 0xDF61;	//卡片支持扩展qpboc标志  FCI中返回;//1len,b1=1支持分段扣费，b2=1支持分段扣费和脱机预授权，b8=1支持扩展应用的R-MAC保护 
	public static final int TLV_TAG_CAPP_DMT_LMT = 0xDF62;	//分段扣费抵扣限额      n12,6Len, =  Get Data获取
	public static final int TLV_TAG_CAPP_DMT = 0xDF63;		//分段扣费已抵扣额      n12 6Len, Get Data获取

	public static final int TLV_TAG_SM_SIGN = 0xDF69;		//sm算法指示器
}
