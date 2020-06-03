//package com.vanstone.paywave;
//
//import android.app.Activity;
//import android.app.AlertDialog;
//import android.app.ProgressDialog;
//import android.content.DialogInterface;
//import android.os.Bundle;
//import android.os.Handler;
//import android.os.Message;
//import android.os.RemoteException;
//import android.util.Log;
//import android.view.KeyEvent;
//import android.view.View;
//import android.view.View.OnClickListener;
//import android.widget.Button;
//import android.widget.ImageView;
//import android.widget.TextView;
//
//import com.fahamutech.smartstock.R;
//import com.vanstone.demo.constants.DefConstants;
//import com.vanstone.demo.constants.GlobalConstants;
//import com.vanstone.l2.COMMON_PPSE_STATUS;
//import com.vanstone.l2.COMMON_TERMINAL_PARAM;
//import com.vanstone.l2.Common;
//import com.vanstone.l2.PayWave;
//import com.vanstone.trans.EmvCommon;
//import com.vanstone.trans.api.MathsApi;
//import com.vanstone.trans.api.PiccApi;
//import com.vanstone.trans.api.SystemApi;
//import com.vanstone.trans.tools.MyApplication;
//import com.vanstone.trans.tools.Util;
//import com.vanstone.transex.ped.IGetPinResultListenner;
//import com.vanstone.utils.ByteUtils;
//import com.vanstone.utils.CommonConvert;
//
//import java.text.SimpleDateFormat;
//
//public class Settle extends Activity implements OnClickListener {
//	private TextView sumAmount, card_No;
//	private Button okBtn, cancelBtn, backBtn;
//	private String card_no;
//	//private String cardNumber;
//	private String card_no_dis = "Card No.:";
//	private ProgressDialog progressDialog;
//	private Handler handler;
//	private boolean sloted_card = true;
//	private ImageView setPassword;
//	static int reselect = 0;
//	static int PWaveCLAllowed = 0;  //0-not allow paywave   1-allow paywave
//
//	static COMMON_PPSE_STATUS ppse = new COMMON_PPSE_STATUS();
//
//    int[] needIssuer = new int[1];
//    int pinret;
//    boolean cardflag = false, iccardflag = false, picccardflag = false;
//
//	@Override
//	protected void onCreate(Bundle savedInstanceState) {
//		MyApplication.getInstance().addActivity(this);
//		super.onCreate(savedInstanceState);
//		setContentView(R.layout.settlelayout);
//		sumAmount = (TextView) findViewById(R.id.sum_amount);
//		card_No = (TextView) findViewById(R.id.card_no);
//		byte amt[] = new byte[32];
//		byte samt[]= new byte[32];
//		MathsApi.BcdToAsc_Api(amt, GlobalConstants.PosCom.stTrans.TradeAmount, 12);
//		EmvCommon.FormatAmt_Str(samt, amt);
//		sumAmount.setText(CommonConvert.BytesToString(samt).trim());
//		setPassword = (ImageView) findViewById(R.id.set_password);
//		setPassword.setVisibility(View.GONE);
//		okBtn = (Button) findViewById(R.id.button_enter);
//		cancelBtn = (Button) findViewById(R.id.button_cancel);
//		backBtn = (Button) findViewById(R.id.button_back);
//		setPassword.setOnClickListener(this);
//		okBtn.setOnClickListener(this);
//		cancelBtn.setOnClickListener(this);
//		backBtn.setOnClickListener(this);
//		initHandler();
//
//		PiccApi.PiccClose_Api();
//		int ret = PiccApi.PiccOpen_Api();
//		Log.d("aabb", "PiccOpen_Api1:"+ret);
//		if(ret != 0){  //open failed
//			PiccApi.PiccClose_Api(); //to make sure PICC is closed
//			ret = PiccApi.PiccOpen_Api();
//			Log.d("aabb", "PiccOpen_Api2:"+ret);
//			if(ret != 0)	//failed
//			{
//				card_no = "Open PICC failed!";
//				handler.sendEmptyMessage(0);
//				sloted_card = false;
//			}
//		}
//		if(ret == 0)
//		{
//			//EmvCommon.initPayWaveConfig(0x00);
//			CTLPreProcess();
//		}
//
//		new Thread() {
//			public void run() {
//				while (sloted_card == true) {
//					int timerid = 0;
//					timerid = SystemApi.TimerSet_Api();
//					byte[] CardType = new byte[2];
//					byte[] SerialNo = new byte[20];
//					while (SystemApi.TimerCheck_Api(timerid, 40 * 1000) == 0) {
//						picccardflag = false;
//
//						int  aret = PiccApi.PiccCheck_Api(0, CardType, SerialNo);
//						//Log.d("aabb", "PiccCheck_Api:"+aret);
//						if (!cardflag && !iccardflag && aret == 0) {
//							picccardflag = true;
//						}
//						if (picccardflag) {
//							int ktype;
//							card_no = "Processing...";
//							handler.sendEmptyMessage(0);
//							GlobalConstants.PosCom.stTrans.ucSwipedFlag = DefConstants.MASK_INCARDNO_PICC;
//							Common.SetIcCardType_Api(Common.PEDPICCCARD, (byte) 0);
//							while(true)
//							{
//								ktype = App_CommonSelKernel();
//								if(ktype == DefConstants.TYPE_KER_PAYWAVE)
//								{
//									int pret = App_PaywaveTrans();
//									if(pret == Common.ERR_SELECTNEXT)
//										continue;
//									PiccApi.PiccClose_Api();
//									Log.d("aabb", "App_PaywaveTrans:"+pret);
//									DispRetCode(pret);
//									sloted_card = false;
//									break;
//								}
//								else {
//									PiccApi.PiccClose_Api();
//									card_no = "Read CL failed!";
//									handler.sendEmptyMessage(0);
//									sloted_card = false;
//									break;
//								}
//							}
//							if(sloted_card == false)
//								break;
//						}
//					}
//					if(sloted_card == false)
//						PiccApi.PiccClose_Api();
//				}
//			}
//		}.start();
//	}
//
//	@Override
//	public void onClick(View v) {
//		switch (v.getId()) {
//		case R.id.button_enter:
//			if (card_No.getText().toString().contains(card_no_dis)) {
//				initProgressDialog();
//			}
//			break;
//		case R.id.button_cancel:
//		case R.id.button_back:
//			sloted_card = false;
//			if (GlobalConstants.isPinPad == 0&& card_No.getText().equals("PLS input password")) {
//			} else {
//				PiccApi.PiccClose_Api();
//				finish();
//			}
//		}
//
//	}
//
//
//	private void initHandler() {
//		handler = new Handler() {
//			public void dispatchMessage(Message msg) {
//				card_No.setText(card_no);
//			}
//		};
//
//	}
//
//	private void initProgressDialog() {
//		progressDialog = new ProgressDialog(this);
//		progressDialog.setMessage("Processing...");
//		progressDialog.show();
//		mHandler.postDelayed(runnable, 2000);
//
//	}
//
//	private Runnable runnable = new Runnable() {
//
//		public void run() {
//			mHandler.sendEmptyMessage(1);
//		}
//
//	};
//	private Handler mHandler = new Handler() {
//
//		public void handleMessage(Message msg) {
//			switch (msg.what) {
//			case 1:
//				if (progressDialog != null) {
//					SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm ");
//					//GlobalConstants.receipts.add(new Receipt(dateFormat.format(System.currentTimeMillis()), "0.10", new String(GlobalConstants.PosCom.stTrans.MainAcc)));
//					progressDialog.dismiss();
//					new AlertDialog.Builder(Settle.this).setTitle("TIP").setMessage("Success").setPositiveButton("Confirm",
//									new DialogInterface.OnClickListener() {
//										@Override
//										public void onClick(
//                      DialogInterface paramDialogInterface, int paramInt)
//											{
//												Log.d("aabb", "before print");
//												//for (int i = 0; i < GlobalConstants.receipts.size(); i++) {
//														//Print.PrtTicket(0);
//														Log.d("aabb", "before PrtCardInfo");
//														Print.PrtCardInfo(Settle.this, 0);
//												//}
//												finish();
//												//Intent intent = new Intent(getApplicationContext(),Function.class);
//												//startActivity(intent);
//											}
//									}).show();
//				}
//				break;
//			}
//		}
//
//	};
//
//	@Override
//	protected void onStop() {
//		sloted_card = false;
//		super.onStop();
//	}
//
//	@Override
//	public boolean onKeyDown(int keyCode, KeyEvent event) {
//		sloted_card = false;
//		if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
//			if (GlobalConstants.isPinPad == 0&& card_No.getText().equals("PLS input password")) {
//			} else {
//				PiccApi.PiccClose_Api();
//				finish();
//			}
//			return true;
//		}
//		return super.onKeyDown(keyCode, event);
//	}
//
//	public static int App_CommonSelKernel()
//	{
//		int ret;
//
//		if (reselect == 0) {
//			//Util.Sleep(100);
//            ret = Common.SelectPPSE_Api(ppse);
//            Log.d("aabb", "SelectPPSE_Api:"+ret+" "+ppse.FCITemplateLen);
//            if (ret != Common.EMV_OK)
//                return ret;
//
//            if(PWaveCLAllowed == 1)
//            {
//	            ret = PayWave.PayWave_SelectApp_Api(ppse);
//	            Log.d("aabb", "PayWave_SelectApp_Api:"+ret);
//	            if (ret == Common.EMV_OK)
//	            	return DefConstants.TYPE_KER_PAYWAVE;
//            }
//        }
//        else
//        {
//            if(PWaveCLAllowed == 1)
//            {
//	            ret = PayWave.PayWave_SelectApp_Api(null);
//	            Log.d("aabb", "PayWave_SelectApp again:"+ret);
//	            if (ret == Common.EMV_OK)
//	            	return DefConstants.TYPE_KER_PAYWAVE;
//            }
//        }
//          //paypass
//        return DefConstants.TYPE_KER_ERR;
//	}
//
//	void CTLPreProcess()
//	{
//		int cbflag = 0; //has cash back amount or not
//		int nRet;
//		byte []amt = new byte[6];
//		byte []cashbackamt = new byte[6];
//
//		ByteUtils.memcpy(amt, GlobalConstants.PosCom.stTrans.TradeAmount, 6);
//		ByteUtils.memset(cashbackamt, 0, 6); //for test
//		PWaveCLAllowed = 1;
//		if(cbflag == 0)
//		{
//			nRet = PayWave.PayWave_PreProcess_Api(amt, null);
//			if (nRet != Common.EMV_OK)
//				PWaveCLAllowed = 0;
//		}
//		else
//		{
//			nRet = PayWave.PayWave_PreProcess_Api(amt, cashbackamt);
//			if (nRet != Common.EMV_OK)
//				PWaveCLAllowed = 0;
//		}
//	}
//	 public int App_PaywaveTrans()
//	 {
//        int ret, onlineResult;
//        int[] path = new int[1];
//        int[] cvm = new int[1];
//        int[] needOnline = new int[1];
//        COMMON_TERMINAL_PARAM param = new COMMON_TERMINAL_PARAM();
//
//	    Sendmsg(DefConstants.ProcessingMsg, 0);
//	    ret = PayWave.PayWave_InitApp_Api(path);
//	    Log.d("aabb", "PayWave_InitApp_Api:"+ret);
//	    if (ret != Common.EMV_OK) {
//	        if (ret == Common.ERR_SELECTNEXT) {
//	        	reselect = 1;
//	            return ret;
//	        } else if (ret == Common.ERR_EMVDENIAL) {
//	        }
//	        return ret;
//	    }
//
//	    if (path[0] == PayWave.PAYWAVE_PATH_MSD) {
//	        // msd no support
//	        return DefConstants.MsgMsdNoSupport;
//	    }
//
//	    ret = PayWave.PayWave_ReadAppData_Api();
//	    Log.d("aabb", "PayWave_ReadAppData_Api:"+ret);
//	    if (ret != Common.EMV_OK) {
//	        if (ret == Common.ERR_ICCINSERTED)
//	            ret = -10000;
//	        return ret;
//	    }
//
//	    Sendmsg(DefConstants.RemoveCard, 0);
//	    PiccApi.PiccClose_Api();
//
//	    ret = PayWave.PayWave_ProcRestrictions_Api();
//	    Log.d("aabb", "PayWave_ProcRestrictions_Api:"+ret);
//	    if (ret == Common.EMV_OK) {
//	        ret = PayWave.PayWave_OfflineDataAuth_Api();
//	        Log.d("aabb", "PayWave_OfflineDataAuth_Api:"+ret);
//	    }
//
//	    if (ret == Common.EMV_OK) {
//	        ret = PayWave.PayWave_VerifyCardholder_Api(cvm, needOnline);
//	        Log.d("aabb", "PayWave_VerifyCardholder_Api:"+ret+" "+needOnline[0]);
//
//	        if (ret == Common.EMV_OK) {
//	        	Log.d("aabb", "cvm[0]:"+cvm[0]);
//	            if (cvm[0] == 1) {
//	                //signature
//	                //TransData.needSignature = 1;
//	            } else if (cvm[0] == 2) {
//	            	byte[] pszPin = new byte[16];
//	            	GetHolderPwdA(1, 3, pszPin);
//	            }
//	        }
//	    }
//	    if (ret != Common.EMV_OK) {
//	        return ret;
//	    }
//
//	    onlineResult = Common.ONLINE_APPROVE;
//	    Log.d("aabb", "needOnline[0]:"+needOnline[0]);
//	    if (needOnline[0] != 0) {
//	        Sendmsg(DefConstants.OnlineProc, 0);
//	        Log.d("aabb", "---onlineProc---");
//	        //send message to server and get message from server
//	        //.....
//	        Log.d("aabb", onlineResult + " onlineResult");
//	        if (onlineResult == Common.ONLINE_FAILED) {
//	        	Log.d("aabb", "onlineResult:  Common.ONLINE_FAILED");
//	            Sendmsg(DefConstants.ComFail, 0);
//	            try {
//	                Thread.sleep(1000);
//	            } catch (InterruptedException e) {
//	                e.printStackTrace();
//	            }
//	        }
//	    }
//
////	    byte[] buf1 = new byte[32];
////        int[] len1 = new int[1];
////        Common.GetTLV_Api(0x8a, buf1, len1);
////        Log.d("aabb", "8a_1:"+CommonConvert.bcdToASCString(buf1));
//        int authCodeLen = 0, scriptLen = 0; // authCodeLen scriptLen should be real data length got by server response message
//	    ret = PayWave.PayWave_Completion_Api(onlineResult, authCodeLen, scriptLen, needIssuer);
//	    Log.d("aabb", "PayWave_Completion_Api:"+ret);
//		 ret =0; //only for demo
////	    ByteUtils.memset(buf1, 0, 32);
////	    Common.GetTLV_Api(0x8a, buf1, len1);
////	    Log.d("aabb", "8a_1:"+CommonConvert.bcdToASCString(buf1));
//	    Common.GetParam_Api(param);
//
//	    // For qVSDC, refund should not be declined for AAC
//	    if ((ret == Common.ERR_EMVDENIAL) && (param.TransType == Common.TRAN_TYPE_RETURNS)) {
//	        ret = Common.EMV_OK;
//	    }
//	    // Offline Declined trans must be uploaded also
//	    if ((needOnline[0] == 0) && (ret == Common.ERR_EMVDENIAL)) {
//	    	//send message to server and get response
//	    }
//
//	    Log.d("aabb","needIssuer[0]:"+needIssuer[0]);
//	    if (1 == needIssuer[0]) {
//	        Log.d("aabb", "need issuer update!!!");
//
//	        if(PiccApi.PiccOpen_Api() == 0){
//	            Sendmsg(DefConstants.WaveCardAgain, 0);
//	            Util.Sleep(500);
//	            byte []CardType = new byte[8];
//	            byte []SerialNo = new byte[64];
//	            while (true) {
//	            	if(PiccApi.PiccCheck_Api(0, CardType, SerialNo) == 0){
//	                    if (true) {
//	                        Sendmsg(DefConstants.ProcessingMsg, 0);
//	                        Util.Sleep(300);
//
//	                        int authDataLen=0;  //should got in response message
//	                        byte[] authData = new byte[128];  //should got in response message
//	                        int scriptLen1=0;  //should got in response message
//	                        byte[] script = new byte[1024];  //should got in response message
//	                        ret = PayWave.PayWave_ProcIssuerUpdate_Api(authDataLen,authData,scriptLen1,script);
//	                        Log.d("aabb", " ProcIssuerUpdate:"+ret);
//	                        PiccApi.PiccClose_Api();
//
//	                        if (ret == Common.ERR_AGAIN) {
//	                        	if(PiccApi.PiccCheck_Api(0, CardType, SerialNo) == 0){
//	                                Sendmsg(DefConstants.WaveCardAgain, 0);
//	                                Util.Sleep(500);
//	                                continue;
//	                            } else {
//	                                Log.d("aabb", "\\RF open error//");
//	                            }
//	                        }
//	                        Sendmsg(DefConstants.RemoveCard, 0);
//	                        Util.Sleep(600);
//	                        break;
//	                    }
//	                }
//	            }
//	        } else {
//	            Log.d("aabb", "picc open err !!!");
//	        }
//	    }
//	    Log.d("aabb", ret + " %%");
//	    return ret;
//	 }
//
//
//	 void WaveRetCode(int nRet)
//	 {
//		 if (nRet == DefConstants.RemoveCard) {
//			 card_no = "Please Remove Card";
//         } else if (nRet == DefConstants.MsgPICCStart) {
//        	 card_no = "Please Wave Card";
//         } else if (nRet == DefConstants.Approved) {
//             card_no = "Approved";
//         } else if (nRet == DefConstants.MsgUseMag) {
//             card_no = "USE MAG";
//         } else if (nRet == DefConstants.MsgMsdNoSupport) {
//             card_no = "MSD NO SUPPORT";
//         } else if (nRet == DefConstants.MultiCard) {
//             card_no = "Multi Card Detected,Present One Card";
//         } else if (nRet == DefConstants.OnlineProc) {
//        	 card_no = "In The Online...";
//         } else if (nRet == DefConstants.ComFail) {
//             card_no = "Comm Failed";
//         } else if (nRet == DefConstants.UseOtherIntrf) {
//             card_no = "Use Contact For Transaction";
//         } else if (nRet == DefConstants.WaveCardAgain) {
//        	 card_no = "Please Wave Card Again";
//         } else if (nRet == DefConstants.ProcessingMsg) {
//        	 card_no = "Processing...";
//         } else if (nRet == DefConstants.ContactDetected) {
//        	 card_no = "EMV Processing...";
//         } else if (nRet == DefConstants.MagDetected) {
//        	 card_no = "MAG Processing...";
//         } else if (nRet == DefConstants.InputPsdMsgErr) {
//             /*bPICCTimeOut = 1;
//             bTimeout_run_flag = false;*/
//         } else if (nRet == DefConstants.PICCOpenErr) {
//        	 card_no = "PICC OPEN ERROR,TERMINATED";
//         } else if (nRet == DefConstants.MsgUseICC) {
//             card_no = "IC CARD,USE CHIP READER";
//         } else if (nRet == DefConstants.GetTrackError) {
//             card_no = "Read MSC Error, Please Retry";
//         } else if (nRet == Common.ERR_APPBLOCK) {
//        	 card_no = "APP BLOCKED";
//         } else if (nRet == Common.ERR_NOAPP) {
//             card_no = "NO APP";
//         } else if (nRet == Common.ERR_USERCANCEL) {
//             card_no = "USER CANCELED";
//         } else if (nRet == Common.ERR_TIMEOUT) {
//             card_no = "TIME OUT";
//         } else if (nRet == Common.ERR_EMVDATA) {
//             card_no = "CARD DATA ERR";
//         } else if (nRet == Common.ERR_NOTACCEPT) {
//             card_no = "NOT ACCEPTED";
//         } else if (nRet == Common.ERR_EMVDENIAL) {
//             card_no = "DECLINED";
//         } else if (nRet == Common.ERR_ICCCMD) {
//             card_no = "ICC ERR,Please Wave Card Again";
//         } else if (nRet == Common.ERR_EMVRSP) {
//             card_no = "ERR RESPONSE";
//         } else if (nRet == Common.ERR_USECONTACT) {
//             card_no = "USE OTHER INTERFACE";
//         } else if (nRet == Common.ERR_BLACKLIST) {
//             card_no = "BLACK LIST CARD,DECLINED";
//         } else if (nRet == DefConstants.InputOnlinePin) {
//
//         } else if (nRet == DefConstants.PICCTimeOut) {
//             card_no = "Timeout";
//         } else if (nRet == Common.ERR_SEEPHONE) {
//        	 card_no = "SEE PHONE";
//         } else {
//             card_no = "TERMINATED";
//         }
//	 }
//
//	 void Sendmsg(int retcode, int amount)
//	 {
//		 WaveRetCode(retcode);
//		 handler.sendEmptyMessage(0);
//	 }
//
//
//	    private Object mObject = new Object();
//		private void lock(){
//			synchronized (mObject) {
//				try {
//					mObject.wait();
//				} catch (InterruptedException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//			}
//		}
//
//		private void unlock(){
//			synchronized (mObject) {
//				mObject.notifyAll();
//			}
//		}
//
//     public int GetHolderPwdA(int iTryFlag, int iRemainCnt, byte[] pszPin) {
//
//    	 pinret = Common.ERR_PINBLOCK;
//         IGetPinResultListenner aa = new IGetPinResultListenner.Stub() {
//
//             @Override
//             public void onTimerOut() throws RemoteException {
//                 // TODO Auto-generated method stub
//            	 pinret = Common.ERR_TIMEOUT;
//            	 Log.d("aabb", "onTimerOut:");
//            	 unlock();
//             }
//
//             @Override
//             public void onError(int errcode, String msg) throws RemoteException {
//                 // TODO Auto-generated method stub
//            	 Log.d("aabb", "onError:");
//            	 pinret = Common.ERR_PINBLOCK;
//            	 unlock();
//             }
//
//             @Override
//             public void onEnter(byte[] pinOut) throws RemoteException {
//                 // TODO Auto-generated method stub
//            	 if(pinOut.length == 0)
//            	 {
//                 	GlobalConstants.PosCom.HaveInputPin = 0;//no pin
//                 	pinret = Common.ERR_NOPIN;
//            	 }
//                 else
//                 {
//                    System.arraycopy(pinOut, 0,   GlobalConstants.PosCom.sPIN, 0, 8);
//                    GlobalConstants.PosCom.HaveInputPin = 1;
//                    pinret = Common.EMV_OK;
//                 }
//
//            	 Log.d("aabb", "onEnter:");
//            	 unlock();
//             }
//
//             @Override
//             public void onClick(int inputLen) throws RemoteException {
//                 // TODO Auto-generated method stub
//            	 Log.d("aabb", "onClick:");
//             }
//
//             @Override
//             public void onCancle() throws RemoteException {
//                 // TODO Auto-generated method stub
//            	 Log.d("aabb", "onCancle:");
//            	 pinret = Common.ERR_USERCANCEL;
//            	 unlock();
//             }
//         };
//
//         Log.d("aabb", " PEDGetPwd_Api 11 -----");
//
//
//
//        // PedApi.PEDSetPinBoardStyle_Api(3);
//        // PedApi.PEDGetPwd_Api("online pin", GlobalConstants.PosCom.stTrans.MainAcc, new byte[]{(byte) 4, (byte) 12}, 1, 60, 0x03, aa);
//         Log.d("aabb","samfan lock begin");
//         lock();
//         Log.d("aabb","samfan unlock ");
//    	 return pinret;
//    }
//
//    public void DispRetCode(int iRet)
//    {
//    	int iRC, len;
//    	long balance = 0xFFFFFFFF;
//    	byte []buf = new byte[1024];
//    	int []len1 = new int[2];
//        if (iRet == Common.EMV_OK) {
//            if ((1 != needIssuer[0])) {
//                iRC = Common.GetTLV_Api(0x9F5D, buf, len1);
//                if (iRC == Common.EMV_OK) {
//                    len = len1[0];
//                    balance = Util.Bcd2Long(buf, 0, len);
//                }
//            }
//            iRC = Common.GetTLV_Api(0x5A, buf, len1);
//            if (iRC == Common.EMV_OK) {
//            	Log.d("aabb", "5a 2:"+iRC+" :len1[0]:"+len1[0]+":"+ CommonConvert.bcdToASCString(buf));
//                len = len1[0];
//                String aa = CommonConvert.bcdToASCString(buf, 0, len);
//                card_no = "Card No.:"+aa.replace("f", "").replace("F", "");
//            }
//            else
//            	card_no = "Approved";
//            handler.sendEmptyMessage(0);
//        }else if (iRet == Common.ERR_SEEPHONE) {
//        	PiccApi.PiccClose_Api();
//            Sendmsg(DefConstants.PICCOpenErr, 0);
//        } else if (iRet == -10000) {
//        	Sendmsg(iRet, 0);
//            Log.d("dw", "Contactless Aborted");
//            return;
//        }
//        else if (iRet == Common.ERR_EMVDENIAL) {
//            iRC = Common.GetTLV_Api(0x9F5D, buf, len1);
//            if (iRC == Common.EMV_OK) {
//                len = len1[0];
//                balance = Util.Bcd2Long(buf, 0, len);
//                Sendmsg(iRet, (int) balance);
//            } else {
//                Sendmsg(iRet, 0);
//            }
//        } else {
//            Sendmsg(iRet, 0);
//        }
//    }
//
//}
