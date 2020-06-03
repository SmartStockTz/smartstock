/**
 * 
 */
package com.vanstone.demo.constants;

import com.vanstone.trans.struct.LogStrc;

public final class DefConstants {
	public static final int MAX_APPNAME_LEN = 33; 				// AppName的最大长度
	public static final int ICC_EMV = 0; 						// emv卡座
	
	public final static int MAX_APP_NUM = 32;				//应用列表最多可存储的应用数
	public final static int MAX_CAPK_NUM = 64;				//认证公钥表最多可存储的公钥数
	public final static int MAX_CAPKREVOKE_NUM = 96;		//认证公钥撤回列表的最大个数32*3

	public final static int PART_MATCH = 0x00;				//ASI(部分匹配)
	public final static int FULL_MATCH = 0x01;				//ASI(完全匹配)

	public final static int EMV_GET_POSENTRYMODE = 0; 
	public final static int EMV_GET_BATCHCAPTUREINFO = 1; 
	public final static int EMV_GET_ADVICESUPPORTINFO = 2; 
	
	
	public final static int PIN_PED = 0x00; 				// 内置
	public final static int PIN_PP = 0x01; 					// 外置
	public final static int TIMEOUT = -2; 					// 超时
	
	public final static int MCARDNO_MAX_LEN = 19; 			// 卡号的最大长度
	public final static int LAST_REC_LOG = 0xffffffff;
	
	public final static String RECORDLOG =  "record"; 		// 日志文件
	public final static String DUPFILE =  "dup_file"; 		// 冲正文件

	public static int LOG_SIZE = new LogStrc().size();	
	
	public static int TYPE_KER_ERR		=	0;
	public static int TYPE_KER_EMV		=	1;
	public static int TYPE_KER_PBOC		=	2;
	public static int TYPE_KER_PAYWAVE	=	3;
	public static int TYPE_KER_QPBOC	=		4;
	public static int TYPE_KER_AMEX		=	5;
	public static int TYPE_KER_DPAS		=	6;
	public static int TYPE_KER_PAYPASS	=	7;
	public static int TYPE_KER_JSPEEDY	=	8;	
	
	//TState
	public static final int TSTATE_NORMAL = 0; 					//正常完成的                                     
	public static final int TSTATE_ONLINE_FAIL= 1; 				//联机失败,不会出现在日志中                  
	public static final int TSTATE_CANCEL =2; 					// 用户取消，不会出现在日志中                    
	public static final int TSTATE_VOID  = 3;					//被撤销                                          
	public static final int TSTATE_ADJUST = 4; 					//被调整(但是不是被覆盖了)                       
	public static final int TSTATE_ARPC_ERR = 5; 				//emv外部认证时arpc错                          
	public static final int TSTATE_OFFLINE_DENIAL=6; 			//脱机拒绝(emv)                            
	public static final int TSTATE_ONLINE_DENIAL=7; 			//联机拒绝,脱机也拒绝，也不会出现在日志中   
	public static final int TSTATE_ONLINE_FAIL_OFFAPPROVE = 8;  //联机失败，脱机接受           
	public static final int TSTATE_ADJUST_REPLACE = 9; 			//原交易被调整和覆盖了    
	
	public static final int PEDICCARD = 0x01;			//0x01:内置IC卡           
	public static final int EXICCARD = 0x02;			//外置IC卡                
	public static final int PEDPICCCARD = 0x03;			//内置PICC              
	public static final int EXPICCCARD = 0x04;			//外置PICC              
	public static final int SMARTEXPICCRD=0x05;			//智能PICC    
	
	
	public static final String TERMPARAMFILE = "TermParamFile";				//参数信息
	public static final String CtrlPARAMFILE = "CtrlParamFile";				//控制参数信息			
	
	public final static int MASK_INCARDNO_HANDIN = 0x01;	//手输卡号
	public final static int MASK_INCARDNO_MAGCARD =	0x02;
	public final static int MASK_INCARDNO_ICC = 0x04;
	public final static int MASK_INCARDNO_PICC = 0x08;		//检测非接卡
	
	public final static int CARD_EMVFULL = 0x01;	//插卡的时候就走完整流程
	public final static int CARD_EMVSIMPLE = 0x02;	//插卡的时候就走简易流程				
	
	public final static int LED_BLUE =	0X01;//led蓝灯
	public final static int LED_YELLOW =	0X02;//led黄灯
	public final static int LED_GREEN =	0X04;//led绿灯
	public final static int LED_RED	=	0X08;//led红灯
	public final static int LED_ALL	=	0X0F;//四个灯
	
	
	public static final int RemoveCard = -1001;
    public static final int Approved = -1002;
    public static final int OnlineProc = -1003;
    public static final int ComFail = -1004;
    public static final int UseOtherIntrf = -1005;
    public static final int WaveCardAgain = -1006;
    public static final int ProcessingMsg = -1007;
    public static final int InputPsdMsgErr = -1008;
    public static final int ContactDetected = -1009;
    public static final int MultiCard = -1010;
    public static final int PICCOpenErr = -1011;
    public static final int MsgUseICC = -1012;
    public static final int MsgUseMag = -1013;
    public static final int GetTrackError = -1014;
    public static final int MagDetected = -1015;
    public static final int MsgPICCStart = -1016;
    public static final int MsgMsdNoSupport = -1017;
    public static final int InputOnlinePin = -1018;
    public static final int PICCTimeOut = -1019;

    public static final int MSG_USER_CANCEL = 8;
    public static final int MSG_TIMEOUT = 9;
    public static final int MSG_CARD_DATA_ERROR = 10;
    public static final int MSG_NOT_ACCEPTED = 11;
    public static final int MSG_DECLINED = 12;
    public static final int MSG_ICC_ERROR = 13;
    public static final int MSG_ERROR_RESPONSE = 14;
    public static final int MSG_FILE_ERROR = 15;
    public static final int MSG_PIN_BLOCKED = 16;
    public static final int MSG_UNKNOWN_ERROR = 17;
    public static final int MSG_TERMINATED = 18;
    public static final int MSG_REMOVE_CARD = 19;
    public static final int MSG_SELECT_AGAIN = 20;
    public static final int MSG_SELECT_APP = 21;
    public static final int MSG_ENTER_AMOUNT = 22;
    public static final int MSG_ENTER_CASHBACK = 23;
    public static final int MSG_ENTER_PIN_ONLINE = 24;
    public static final int MSG_ENTER_PIN = 25;
    public static final int MSG_ENTER_PIN_AGAIN = 26;
    public static final int MSG_LAST_CHANCE = 27;
    public static final int MSG_VERIFY_ID = 28;
    public static final int MSG_MATCH = 29;
    public static final int MSG_NO_MATCH = 30;
    public static final int MSG_SHENFENZHENG = 31;
    public static final int MSG_JUNGUANZHENG = 32;
    public static final int MSG_HUZHAO = 33;
    public static final int MSG_RUJINGZHENG = 34;
    public static final int MSG_LINSHISHENFENZHENG = 35;
    public static final int MSG_QITAZHENGJIAN = 36;
    public static final int MSG_CALL_YOUR_BANK = 37;
    public static final int MSG_APPROVE = 38;
    public static final int MSG_DECLINE = 39;
    public static final int MSG_PAN = 40;
    public static final int MSG_OPEN_SERIAL_ERROR = 41;
    public static final int MSG_CHECKSUM_ERROR = 42;
    public static final int MSG_USE_MAG = 43;
    public static final int MSG_MAG_ERROR = 44;
    public static final int MSG_RETRY = 45;
    public static final int MSG_IC_CARD = 46;
    public static final int MSG_USE_CHIP = 47;
    public static final int MSG_ONLINE_FAILED = 48;
    public static final int MSG_REFERRAL = 49;
    
    
    
    /*****************返回的错误信息定义****************************/
	public static final int  E_TRANS_FAIL		= 2;		//交易失败     
	public static final int  E_NO_TRANS			= 3;		//无交易
	public static final int  E_MAKE_PACKET		= 4;		//打包错   
	public static final int  E_ERR_CONNECT		= 5;		//联接失败
	public static final int  E_SEND_PACKET		= 6;		//发包错误   
	public static final int  E_RECV_PACKET		= 7;		//收包错误  
	public static final int  E_RESOLVE_PACKET	= 8;		//解包错误  
	public static final int  E_REVERSE_FAIL		= 9;		//冲正失败 
	public static final int  E_NO_OLD_TRANS	    = 10;		//无原始交易 
	public static final int  E_TRANS_VOIDED		= 11;		//交易已被撤消 
	public static final int  E_ERR_SWIPE		= 12;		//刷卡错误
	public static final int  E_MEM_ERR			= 13;		//文件操作失败
	public static final int  E_PINPAD_KEY		= 14;		//密码键盘或者密钥出错
	public static final int  E_FILE_OPEN		= 15;		//打开文件错
	public static final int  E_FILE_SEEK		= 16;		//定位文件错
	public static final int  E_FILE_READ		= 17;		//读文件错
	public static final int  E_FILE_WRITE		= 18;		//写文件错
	public static final int  E_CHECK_MAC_VALUE	= 19;		//收包MAC校验错
	public static final int  E_TRANS_CANCEL		= 20;		//交易被取消  
	public static final int	 E_MAC				= 21;		//Mac校验错误
	public static final int  E_SYS				= 22;		//系统错误
	//public static final int  E_FAIL				23;		//交易失败
	public static final int	 E_REVTIMEOUT		= 24;		//接收超时
	public static final int	 E_RESPERR			= 25;		//返回码错误
	public static final int	 E_SAMEPACKET		= 26;		//原包返回银行未开机
	//NO_DISP定为出错显示的最大值，注意随时更改
	public static final int  NO_DISP          = 0xBB;
	
	
	public static final int  KEYIN_CARD			= 0x01;	//手输卡号
	public static final int  SWIPED_CARD		= 0x02;
	public static final int  INSERT_ICCARD		= 0x05;	//IC卡
	public static final int  PAYPASS_ICCARD		= 0x07;    //非接快速消费
	public static final int  PAYPASS_MAG		= 0x91;	//非接简易流程
	
	public static final int POS_SALE  = 2			;		//1001消费
	public static final int POS_VOID = 7		;		//当日撤销
	public static final int POS_QUE = 8			;		//查余额
	
}
