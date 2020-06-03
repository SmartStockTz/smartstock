package com.fahamutech.smartstock;

import android.os.Bundle;
import android.os.RemoteException;
import android.util.Log;

import com.fahamutech.smartstock.plugins.Printer;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.vanstone.appsdk.client.ISdkStatue;
import com.vanstone.demo.constants.DefConstants;
import com.vanstone.demo.constants.GlobalConstants;
import com.vanstone.l2.Common;
import com.vanstone.l2.CommonCB;
import com.vanstone.l2.EMV;
import com.vanstone.l2.EMVCB;
import com.vanstone.l2.PayPass;
import com.vanstone.l2.PayPassCB;
import com.vanstone.l2.PayWave;
import com.vanstone.trans.EmvCommon;
import com.vanstone.trans.api.MathsApi;
import com.vanstone.trans.api.PedApi;
import com.vanstone.trans.api.SystemApi;
import com.vanstone.trans.struct.LogStrc;
import com.vanstone.trans.tools.File;
import com.vanstone.trans.tools.Util;
import com.vanstone.transex.ped.IGetPinResultListenner;
import com.vanstone.utils.ByteUtils;
import com.vanstone.utils.CommonConvert;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  public static int pflag = 0;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // initiatePrinter();

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(Printer.class);
    }});
  }

  private void initiatePrinter() {
    new Thread() {
      public void run() {
        String CurAppDir = getApplicationContext().getFilesDir().getAbsolutePath();
        SystemApi.SystemInit_Api(0, CommonConvert.StringToBytes(CurAppDir + "/" + "\0"), MainActivity.this, new ISdkStatue() {
          @Override
          public void sdkInitSuccessed() {
            Common.setCallback(ccb);
            PayPass.setCallback(pcb);
            EMV.setCallback(emvcb);
            EMV.setSafeModeOfPinInput(true);
            Common.Init_Api();
            PayPass.Init_Api();
            PayWave.PayWave_Init_Api();
            EMV.Init_Api();
            EMV.GetParam_Api(GlobalConstants.stEmvParam);
            EmvCommon.EmvAddAppsExp(); //add EMV AID
            EmvCommon.PayPassAddAppExp(0x00); //add paypass AID
            EmvCommon.PayWaveAddAppExp(); //add paywave AID
            EmvCommon.AddCapkExample(); //add capk
            PedApi.PEDWriteMKey_Api(1, 0x03, CommonConvert.ascStringToBCD("11111111111111111111111111111111"));
            PedApi.PEDWriteWKey_Api(1, 1, 0x83, CommonConvert.ascStringToBCD("9E90DE82745E6852BEA9E7E4A8BCF8EE"));
            pflag = 1;
          }

          @Override
          public void sdkInitFailed() {
            pflag = 0;
          }
        });
      }

      ;
    }.start();
  }

  private PayPassCB pcb = new PayPassCB() {

    @Override
    public int DEKDET(int DTSLen, byte[] DTS, int DNLen, byte[] DN) {
      return 0;
    }
  };

  private CommonCB ccb = new CommonCB() {
    @Override
    public int GetDateTime(byte[] bytes) {
      byte[] DataTimeTemp = new byte[10];
      SystemApi.GetSysTime_Api(DataTimeTemp);
      ByteUtils.memcpy(bytes, 0, DataTimeTemp, 1, 6);
      return 0;
    }

    @Override
    public int ReadSN(byte[] bytes) {
      byte[] sTemp = new byte[32];
      if (PedApi.PEDReadPinPadSn_Api(sTemp) == 0x00) {
        int nLen = (sTemp[0] - 0x30) * 10 + (sTemp[1] - 0x30) + 2;
        if (nLen > 11)
          ByteUtils.memcpy(bytes, 0, sTemp, 2 + nLen - 11, 11);
        else
          ByteUtils.memcpy(bytes, 0, sTemp, 2, nLen);
      }
      return Common.EMV_OK;
    }

    @Override
    public int GetUnknowTLV(int i, byte[] bytes, int i1) {
      return -1;
    }
  };

  public EMVCB emvcb = new EMVCB() {

    @Override
    public int WaitAppSel(int TryCnt, byte[] AppNameList, int num) {
      String[] value = new String[num];
      byte[] TName = new byte[Common.MAX_APPNAME_LEN];
      GlobalConstants.SelAppFlag = false;
      GlobalConstants.SelAppInx = -1;
      for (int i = 0; i < num; i++) {
        Util.memset(TName, 0, Common.MAX_APPNAME_LEN);
        int j;
        System.arraycopy(AppNameList, i * Common.MAX_APPNAME_LEN, TName, 0, Common.MAX_APPNAME_LEN);
        for (j = 0; j <= Common.MAX_APPNAME_LEN - 1; j++) {
          if (TName[j] == 0)
            break;
        }
        byte[] tname = new byte[j];
        System.arraycopy(TName, 0, tname, 0, j);
        String strTmp = new String(tname);
        String str = strTmp.trim();
        value[i] = str;
      }
      // Intent intent = new Intent(MainActivity.this, AppSelActivity.class);
//      intent.putExtra("appsel", value);
//      intent.putExtra("trycnt", TryCnt);
//      intent.putExtra("num", num);
//      startActivityForResult(intent, 3);
      while (!GlobalConstants.SelAppFlag) {
        Util.Sleep(100);
      }
      GlobalConstants.SelAppFlag = false;
      return GlobalConstants.SelAppInx;
    }

    //select app /complete will use IoCtrl
    @Override
    public void IoCtrl(int ioname, byte[] iovalue) {
      switch (ioname) {
        case DefConstants.EMV_GET_POSENTRYMODE:
          iovalue[0] = (byte) EmvCommon.GetPosEntryMode();
          break;
        case DefConstants.EMV_GET_BATCHCAPTUREINFO:
          iovalue[0] = (byte) EmvCommon.GetPosBatchCaptureInfo();
          break;
        case DefConstants.EMV_GET_ADVICESUPPORTINFO:
          iovalue[0] = (byte) EmvCommon.GetPosAdviceSupportInfo();
          break;
      }
      return;
    }

    @Override
    public int HandleBeforeGPO() {
      return 0;
    }

    @Override
    public int InputAmt(byte[] AuthAmt, byte[] CashbackAmt) {
      //You can define your own interface to input amount
      Log.d("aabb", "CEmvInputAmt");
      ByteUtils.memcpy(AuthAmt, 0, CommonConvert.ascStringToBCD("000000000222"), 0, 6);
      ByteUtils.memset(CashbackAmt, 0, 6);
      return Common.EMV_OK;
    }

    @Override
    public void VerifyPINOK() {
      return;
    }

    @Override
    public int GetSignature() {
      //TransData.needSignature = 1;
      GlobalConstants.PosCom.stTrans.needSignature = 1;
      return 0;
    }


    private int nGetOnlinePwdRet = Common.ERR_ICCCMD;
    private Object mObject = new Object();

    private void lock() {
      synchronized (mObject) {
        try {
          mObject.wait();
        } catch (InterruptedException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }
      }
    }

    private void unlock() {
      synchronized (mObject) {
        mObject.notifyAll();
      }
    }


    @Override
    public int GetOnlineHolderPwd(int paramInt1, int paramInt2, byte[] paramArrayOfByte) {
      // TODO Auto-generated method stub

      nGetOnlinePwdRet = Common.ERR_PINBLOCK;
      IGetPinResultListenner pinResultListenner = new IGetPinResultListenner.Stub() {
        @Override
        public void onTimerOut() throws RemoteException {
          // TODO Auto-generated method stub
          nGetOnlinePwdRet = Common.ERR_TIMEOUT;
          unlock();
        }

        @Override
        public void onError(int errcode, String msg) throws RemoteException {
          // TODO Auto-generated method stub
          Log.d("aabb", "GetOnlineHolderPwd onError errcode:" + errcode + " " + msg);
          nGetOnlinePwdRet = Common.ERR_PINBLOCK;
          unlock();
        }

        @Override
        public void onEnter(byte[] pinOut) throws RemoteException {
          // TODO Auto-generated method stub
          if (pinOut.length == 0) {
            //no pin
            GlobalConstants.PosCom.HaveInputPin = 0;
            nGetOnlinePwdRet = Common.ERR_NOPIN;
          } else {
            System.arraycopy(pinOut, 0, GlobalConstants.PosCom.sPIN, 0, 8);
            GlobalConstants.PosCom.HaveInputPin = 1;
            nGetOnlinePwdRet = Common.EMV_OK;
          }
          Log.d("aabb", "online sPIN:" + CommonConvert.bcdToASCString(GlobalConstants.PosCom.sPIN));

          unlock();
        }

        @Override
        public void onClick(int inputLen) throws RemoteException {
          // TODO Auto-generated method stub
        }

        @Override
        public void onCancle() throws RemoteException {
          // TODO Auto-generated method stub
          nGetOnlinePwdRet = Common.ERR_USERCANCEL;
          unlock();
        }
      };

      int[] len = new int[1];
      byte[] PAN = new byte[10];
      byte[] cc = new byte[32];
      String CardNo;

      Common.GetTLV_Api(0x5A, PAN, len);
      String aa = CommonConvert.bcdToASCString(PAN);
      ByteUtils.memcpy(cc, 0, CommonConvert.StringToBytes(aa), 0, len[0] * 2);
      CardNo = CommonConvert.BytesToString(cc);
      PedApi.PEDSetPinBoardStyle_Api(3);

      //PedApi.setTitleBackGroundColor("#C4C9AF");
      PedApi.PEDGetPwd_Api("Online Pin \r\n hello", CommonConvert.StringToBytes(CardNo), new byte[]{(byte) 0, (byte) 4, (byte) 12}, 1, 20, 0x03, pinResultListenner);
      lock();
      Log.d("aabb", "PEDGetPwd_Api sPIN:" + CommonConvert.bcdToASCString(GlobalConstants.PosCom.sPIN));
      return nGetOnlinePwdRet;
    }

    @Override
    public int GetOfflineHolderPwd(int paramInt1, int paramInt2) {
      // TODO Auto-generated method stub
      int ret = 0;
      PedApi.PEDSetPinBoardStyle_Api(2);
      ret = PedApi.PEDGetEMVOfflinePin_Api("Offline Pin \r\n offpin", 4, 6, 1000);
      if (ret == 0) {
        ret = Common.EMV_OK;
      } else if (ret == 5) {
        ret = Common.ERR_USERCANCEL;
      } else if (ret == 3) {
        ret = Common.ERR_TIMEOUT;
      } else if (ret != 0) {
        ret = Common.ERR_ICCCMD;
      }
      return ret;
    }

    public int GetHolderPwd(int iTryFlag, int iRemainCnt, byte[] pszPlainPin) {
      //this GetHolderPwd will not be called if already set "EMV.setSafeModeOfPinInput(true);"
      return 0;
    }

    @Override
    public void GetAllAmt(byte[] PANData, int PANDataLen, byte[] AuthAmt, byte[] bcdTotalAmt) {
      int i;
      //long BefAmount;
      LogStrc tLog = new LogStrc();
      byte[] PanDataTem = new byte[22];

      MathsApi.BcdToAsc_Api(PanDataTem, PANData, PANDataLen * 2);
      ByteUtils.memcpy(bcdTotalAmt, AuthAmt, 6);
      if ((PANData == null) || (PANDataLen <= 0)) {
        return;
      }
      for (i = 0; i < GlobalConstants.gCtrlParam.getiTransNum(); i++) {
        if (File.ReadLog(tLog, i) == 0) {
          if (tLog.Trans_id != DefConstants.POS_SALE)
            continue;
          if (ByteUtils.strcmp(tLog.getMainAcc(), PanDataTem) == 0) {
            if ((tLog.state != DefConstants.TSTATE_VOID) && tLog.state != DefConstants.TSTATE_ADJUST && (tLog.EntryMode[0] == DefConstants.INSERT_ICCARD)) {
              MathsApi.BcdAdd_Api(bcdTotalAmt, tLog.getTradeAmount(), 6);
            }
          }
        }
      }
    }

    @Override
    public void AdviceProc() {
      return;
    }

    public int ReferProc() {
      return Common.REFER_DENIAL;
    }
  };
}
