package com.vanstone.trans;

import android.util.Log;

import com.vanstone.demo.constants.DefConstants;
import com.vanstone.demo.constants.EmvTagConstants;
import com.vanstone.demo.constants.GlobalConstants;
import com.vanstone.l2.Common;
import com.vanstone.l2.EMV;
import com.vanstone.l2.EMV_APPLIST;
import com.vanstone.l2.EMV_CAPK;
import com.vanstone.l2.PAYPASS_APPLIST;
import com.vanstone.l2.PAYPASS_DE_PARAM;
import com.vanstone.l2.PAYPASS_TERM_PARAM;
import com.vanstone.l2.PAYWAVE_APPLIST;
import com.vanstone.l2.PAYWAVE_TERM_PARAM;
import com.vanstone.l2.PayPass;
import com.vanstone.l2.PayWave;
import com.vanstone.trans.api.IcApi;
import com.vanstone.trans.api.Itwell;
import com.vanstone.trans.api.LcdApi;
import com.vanstone.trans.api.MathsApi;
import com.vanstone.trans.struct.TCardAccountInfo;
import com.vanstone.utils.ByteUtils;
import com.vanstone.utils.CommonConvert;

public class EmvCommon {

	public static int G_IcCardMode;
    public static final int MENU_LINES = 5;
	public static final int APPNAMELEN = 33;

	public static int EmvCardProcSL(int tradetype, int procType,
			TCardAccountInfo pAccInfo) {
		int Ret = 0;
		Ret = EmvCardProc(tradetype, procType, pAccInfo);
		return Ret;
	}

	public static int EmvCardProc(int tradetype, int procType,
			TCardAccountInfo pAccInfo) {
		int ret;

		Common.SetIcCardType_Api(Common.PEDICCARD, (byte) 0);
		ret = IcApi.IccInit_Api(0, 1, new byte[256], new byte[4]);
		Log.d("aabb", "IcApiaa.IccInit_Api:"+ret);
		if(ret != 0)
			return -20; //ERR_ICCRESET

        EMV.Clear_Api();
        EMV.SetTradeAmt_Api(GlobalConstants.PosCom.stTrans.TradeAmount, GlobalConstants.PosCom.stTrans.SecondAmount);
        LcdApi.LedLightOn_Api(DefConstants.LED_YELLOW|DefConstants.LED_BLUE);
		if ((procType & DefConstants.CARD_EMVSIMPLE) != 0) {
			GlobalConstants.g_EmvFullOrSim = 0; // EMV simple flow
		} else {
			GlobalConstants.g_EmvFullOrSim = 1; // EMV full flow
		}
		EmvInitDefParam();
		ret = EMV.SelectApp_Api(DefConstants.ICC_EMV, GlobalConstants.gCtrlParam.getlTraceNo());
		Log.d("aabb", "after SelectApp_Api:"+ret); //SetTLV_Api can work after SelectApp_Api
		while(true)
		{
			if (ret == Common.EMV_OK)
				ret = EMV.InitApp_Api();
			Log.d("aabb", "InitApp_Api:"+ret);

			if (ret == Common.EMV_OK)
				ret = EMV.ReadAppData_Api();
			Log.d("aabb", "ReadAppData_Api:"+ret);

			if (ret == Common.EMV_OK)
			{
				// read track2 and PAN
				ret = GetEmvTrackData(pAccInfo);
				if (ret < 0) {
					return DefConstants.E_TRANS_FAIL;
				}

				if ((procType & DefConstants.CARD_EMVSIMPLE) != 0) { //simple process
					return 0;
				}
			}

			if (ret == Common.EMV_OK)
				ret = EMV.OfflineDataAuth_Api();
			Log.d("aabb", "OfflineDataAuth_Api:"+ret);

			if(ret != Common.EMV_OK){
                if(ret == Common.ERR_SELECTNEXT){
                    ret = EMV.SelectApp_Api(1, GlobalConstants.gCtrlParam.getlTraceNo());
                }
                else if(ret == Common.ERR_ICCCMD) {
                	//MainActivity.isFallBack = 1;
                    return ret;
                }
                else{
                    return ret;
                }
            }
            else{
                break;
            }
		}
		return 0;
	}

	public static int EmvTranProc()
	{
		int ret;
		int []bOnlineFlag = new int[1];

		ret = EMV.ProcRestrictions_Api();
		Log.d("aabb", "ProcRestrictions_Api:"+ret);

		if (ret == Common.EMV_OK)
			ret = EMV.VerifyCardholder_Api();
		Log.d("aabb", "VerifyCardholder_Api:"+ret);

		if (ret == Common.EMV_OK)
			ret = EMV.RiskManagement_Api();
		Log.d("aabb", "RiskManagement_Api:"+ret);

		if (ret == Common.EMV_OK)
			ret = EMV.TermActAnalyse_Api(bOnlineFlag);
		Log.d("aabb", "TermActAnalyse_Api:"+ret);

		if (bOnlineFlag[0] == 1) //online transaction
			GlobalConstants.PosCom.stTrans.bOffline = 0;
		else //offline transaction
			GlobalConstants.PosCom.stTrans.bOffline = 1;
		return ret;
	}

	public static int GetEmvTrackData(TCardAccountInfo pAccInfo)
	{
		int iRet = 0;
		int iLength = 0;
		byte[] sTemp = new byte[30];
		byte cRet = 0;

		cRet = pAccInfo.cardMode;
		pAccInfo.toBean(new byte[pAccInfo.size()]);
		pAccInfo.cardMode = cRet;
		// Read Track 2 Equivalent Data
		int[] iLengthAddr = new int[1];
		iRet = Common.GetTLV_Api(0x57, sTemp, iLengthAddr);
		iLength = iLengthAddr[0];
		if(iRet == Common.EMV_OK)
		{
			pAccInfo.Track2Len = (byte) (iLength * 2);
			Itwell.FormBcdToAsc( pAccInfo.Track2, sTemp, iLength * 2);
			if(pAccInfo.Track2[ByteUtils.strlen(pAccInfo.Track2) -1] == 0x3f)
			{
				pAccInfo.Track2[ByteUtils.strlen(pAccInfo.Track2) -1] = 0;
				pAccInfo.Track2Len--;
			}
			int index = CommonConvert.BytesToString(pAccInfo.Track2).indexOf('=');

			if(index != -1)
			{
				if(index > DefConstants.MCARDNO_MAX_LEN + 1)
					return DefConstants.E_ERR_SWIPE;
				ByteUtils.memcpy(pAccInfo.MainAcc,pAccInfo.Track2, index);
			}
			else
				return DefConstants.E_ERR_SWIPE;
		}
		 else
			 	return DefConstants.E_ERR_SWIPE;

		// read PAN
		sTemp = new byte[30];
		iRet = Common.GetTLV_Api(0x5A, sTemp, iLengthAddr);
		iLength = iLengthAddr[0];
		if(iRet == Common.EMV_OK)
		{
			byte[] tmp = new byte[24];
			MathsApi.BcdToAsc_Api(tmp, sTemp, iLength * 2);
			if(tmp[iLength * 2 - 1] == 'F')
				tmp[iLength * 2 - 1] = 0;
			else
				tmp[iLength * 2 ] = 0;

			if(ByteUtils.strcmp(tmp, pAccInfo.MainAcc) != 0)
				return DefConstants.E_ERR_SWIPE;
		}

		byte[] temp = CommonConvert.intToBytes(pAccInfo.ucPanSeqNo);
		iRet = Common.GetTLV_Api((short)0x5F34, temp, iLengthAddr);
		if(iRet == Common.EMV_OK)
		{
			GlobalConstants.PosCom.stTrans.bPanSeqNoOk = 1;
		}else
		{
			GlobalConstants.PosCom.stTrans.bPanSeqNoOk = 0;
		}
		GlobalConstants.PosCom.getStTrans().setUcPanSeqNo(temp[0]);
		iLength = iLengthAddr[0];
		pAccInfo.ucPanSeqNo =(byte) CommonConvert.bytesToInt(temp);

		// read Application Expiration Date
		sTemp = new byte[30];
		iRet = Common.GetTLV_Api((short)0x5F24, sTemp, iLengthAddr);
		//iLength = iLengthAddr[0];
		if(iRet == Common.EMV_OK)
		{
			ByteUtils.memcpy(pAccInfo.ExpDate, sTemp, 3);
		}

		// read other data for print slip
		if(Common.GetTLV_Api((short)0x5f20, pAccInfo.HoldCardName, iLengthAddr)!=0)
			pAccInfo.HoldCardName[iLength] = 0;
		else
		{
			if(Common.GetTLV_Api(0x9f0b, pAccInfo.HoldCardName, iLengthAddr) == 0)
				pAccInfo.HoldCardName[iLength] = 0;
		}

		return 0;
	}

	public static void EmvAddAppsExp()
	{
    	EMV_APPLIST emv_applist = new EMV_APPLIST();

    	//EMV.ClearApp_Api();

    	ByteUtils.memcpy(emv_applist.Version, CommonConvert.ascStringToBCD("008C"), 2);
    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A000000333010101"), 8);
    	emv_applist.AidLen = 8;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.Version, CommonConvert.ascStringToBCD("008C"), 2);
    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A0000003330101"), 7);
    	emv_applist.AidLen = 7;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A0000000031010"), 7);
        ByteUtils.memcpy(emv_applist.Version, CommonConvert.ascStringToBCD("0096"), 2);
    	emv_applist.AidLen = 7;
    	//emv_applist.SelFlag = Common.PART_MATCH;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A000000003101003"), 8);
    	emv_applist.AidLen = 8;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A000000003101004"), 8);
    	emv_applist.AidLen = 8;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A000000003101005"), 8);
    	emv_applist.AidLen = 8;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A000000003101006"), 8);
    	emv_applist.AidLen = 8;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A000000003101007"), 8);
    	emv_applist.AidLen = 8;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A0000000999090"), 7);
    	emv_applist.AidLen = 7;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A00000999901"), 6);
    	emv_applist.AidLen = 6;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A0000000041010"), 7);
    	emv_applist.AidLen = 7;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A0000000651010"), 7);
    	emv_applist.AidLen = 7;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A122334455"), 5);
    	ByteUtils.memcpy(emv_applist.Version, CommonConvert.ascStringToBCD("0096"), 2);
    	emv_applist.AidLen = 5;
    	emv_applist.SelFlag = Common.PART_MATCH;
    	EMV.AddApp_Api(emv_applist);

    	ByteUtils.memcpy(emv_applist.AID, CommonConvert.ascStringToBCD("A000000003"), 5);
        ByteUtils.memcpy(emv_applist.Version, CommonConvert.ascStringToBCD("0096"), 2);
    	emv_applist.AidLen = 5;
    	EMV.AddApp_Api(emv_applist);
	}

	public static void AddCapkExample()
	{
		int ret;
        EMV_CAPK capk = new EMV_CAPK();

        capk.ArithInd = 0x01;
        capk.HashInd = 0x01;
        ByteUtils.memcpy(capk.RID, CommonConvert.ascStringToBCD("A000000004"), 5);
        capk.KeyID = 0x05;
        ByteUtils.memcpy(capk.Modul, CommonConvert.ascStringToBCD("B8048ABC30C90D976336543E3FD7091C8FE4800DF820ED55E7E94813ED00555B573FECA3D84AF6131A651D66CFF4284FB13B635EDD0EE40176D8BF04B7FD1C7BACF9AC7327DFAA8AA72D10DB3B8E70B2DDD811CB4196525EA386ACC33C0D9D4575916469C4E4F53E8E1C912CC618CB22DDE7C3568E90022E6BBA770202E4522A2DD623D180E215BD1D1507FE3DC90CA310D27B3EFCCD8F83DE3052CAD1E48938C68D095AAC91B5F37E28BB49EC7ED597"), 352/2);
        capk.ModulLen = (byte)(352/2);
        ByteUtils.memcpy(capk.Exponent, CommonConvert.ascStringToBCD("030000"), 3);
        capk.ExponentLen = 0x01;
        ByteUtils.memcpy(capk.ExpDate, CommonConvert.ascStringToBCD("351231"), 3);  //211231
        ByteUtils.memcpy(capk.CheckSum, CommonConvert.ascStringToBCD("EBFA0D5D06D8CE702DA3EAE890701D45E274C845"));
        capk.KeyID = 0x05;
        ret = Common.AddCapk_Api(capk);
        Log.d("aabb", "AddCapk_Api:"+ret);

        //paypass
        capk = new EMV_CAPK();
        capk.ArithInd = 0x01;
        capk.HashInd = 0x01;
        ByteUtils.memcpy(capk.RID, CommonConvert.ascStringToBCD("A000000004"), 5);
        capk.KeyID = (byte)0xF5;
        ByteUtils.memcpy(capk.Modul, CommonConvert.ascStringToBCD("A6E6FB72179506F860CCCA8C27F99CECD94C7D4F3191D303BBEE37481C7AA15F233BA755E9E4376345A9A67E7994BDC1C680BB3522D8C93EB0CCC91AD31AD450DA30D337662D19AC03E2B4EF5F6EC18282D491E19767D7B24542DFDEFF6F62185503532069BBB369E3BB9FB19AC6F1C30B97D249EEE764E0BAC97F25C873D973953E5153A42064BBFABFD06A4BB486860BF6637406C9FC36813A4A75F75C31CCA9F69F8DE59ADECEF6BDE7E07800FCBE035D3176AF8473E23E9AA3DFEE221196D1148302677C720CFE2544A03DB553E7F1B8427BA1CC72B0F29B12DFEF4C081D076D353E71880AADFF386352AF0AB7B28ED49E1E672D11F9"), 496/2);
        capk.ModulLen = (byte)(496/2);
        ByteUtils.memcpy(capk.Exponent, CommonConvert.ascStringToBCD("010001"), 3);
        capk.ExponentLen = 0x03;
        ByteUtils.memcpy(capk.ExpDate, CommonConvert.ascStringToBCD("251231"), 3);  //211231
        ByteUtils.memcpy(capk.CheckSum, CommonConvert.ascStringToBCD("C2239804C8098170BE52D6D5D4159E81CE8466BF"));
        ret = Common.AddCapk_Api(capk);

        //paywave 1
        capk = new EMV_CAPK();
        capk.ArithInd = 0x01;
        capk.HashInd = 0x01;
        ByteUtils.memcpy(capk.RID, CommonConvert.ascStringToBCD("A000000003"), 5);
        capk.KeyID = (byte)0x50;
        ByteUtils.memcpy(capk.Modul, CommonConvert.ascStringToBCD("D11197590057B84196C2F4D11A8F3C05408F422A35D702F90106EA5B019BB28AE607AA9CDEBCD0D81A38D48C7EBB0062D287369EC0C42124246AC30D80CD602AB7238D51084DED4698162C59D25EAC1E66255B4DB2352526EF0982C3B8AD3D1CCE85B01DB5788E75E09F44BE7361366DEF9D1E1317B05E5D0FF5290F88A0DB47"), 256/2);
        capk.ModulLen = (byte)(256/2);
        ByteUtils.memcpy(capk.Exponent, CommonConvert.ascStringToBCD("010001"), 3);
        capk.ExponentLen = 0x03;
        ByteUtils.memcpy(capk.ExpDate, CommonConvert.ascStringToBCD("251231"), 3);  //211231
        ByteUtils.memcpy(capk.CheckSum, CommonConvert.ascStringToBCD("B769775668CACB5D22A647D1D993141EDAB7237B"));
        ret = Common.AddCapk_Api(capk);

        capk = new EMV_CAPK();
        capk.ArithInd = 0x01;
        capk.HashInd = 0x01;
        ByteUtils.memcpy(capk.RID, CommonConvert.ascStringToBCD("A000000003"), 5);
        capk.KeyID = (byte)0x51;
        ByteUtils.memcpy(capk.Modul, CommonConvert.ascStringToBCD("DB5FA29D1FDA8C1634B04DCCFF148ABEE63C772035C79851D3512107586E02A917F7C7E885E7C4A7D529710A145334CE67DC412CB1597B77AA2543B98D19CF2CB80C522BDBEA0F1B113FA2C86216C8C610A2D58F29CF3355CEB1BD3EF410D1EDD1F7AE0F16897979DE28C6EF293E0A19282BD1D793F1331523FC71A228800468C01A3653D14C6B4851A5C029478E757F"), 288/2);
        capk.ModulLen = (byte)(288/2);
        ByteUtils.memcpy(capk.Exponent, CommonConvert.ascStringToBCD("03"), 1);
        capk.ExponentLen = 0x01;
        ByteUtils.memcpy(capk.ExpDate, CommonConvert.ascStringToBCD("251231"), 3);  //211231
        ByteUtils.memcpy(capk.CheckSum, CommonConvert.ascStringToBCD("B9D248075A3F23B522FE45573E04374DC4995D71"));
        ret = Common.AddCapk_Api(capk);

        //2
        capk = new EMV_CAPK();
        capk.ArithInd = 0x01;
        capk.HashInd = 0x01;
        ByteUtils.memcpy(capk.RID, CommonConvert.ascStringToBCD("A000000003"), 5);
        capk.KeyID = (byte)0x53;
        ByteUtils.memcpy(capk.Modul, CommonConvert.ascStringToBCD("BCD83721BE52CCCC4B6457321F22A7DC769F54EB8025913BE804D9EABBFA19B3D7C5D3CA658D768CAF57067EEC83C7E6E9F81D0586703ED9DDDADD20675D63424980B10EB364E81EB37DB40ED100344C928886FF4CCC37203EE6106D5B59D1AC102E2CD2D7AC17F4D96C398E5FD993ECB4FFDF79B17547FF9FA2AA8EEFD6CBDA124CBB17A0F8528146387135E226B005A474B9062FF264D2FF8EFA36814AA2950065B1B04C0A1AE9B2F69D4A4AA979D6CE95FEE9485ED0A03AEE9BD953E81CFD1EF6E814DFD3C2CE37AEFA38C1F9877371E91D6A5EB59FDEDF75D3325FA3CA66CDFBA0E57146CC789818FF06BE5FCC50ABD362AE4B80996D"), 496/2);
        capk.ModulLen = (byte)(496/2);
        ByteUtils.memcpy(capk.Exponent, CommonConvert.ascStringToBCD("03"), 1);
        capk.ExponentLen = 0x01;
        ByteUtils.memcpy(capk.ExpDate, CommonConvert.ascStringToBCD("251231"), 3);  //211231
        ByteUtils.memcpy(capk.CheckSum, CommonConvert.ascStringToBCD("AC213A2E0D2C0CA35AD0201323536D58097E4E57"));
        ret = Common.AddCapk_Api(capk);

        //3
        capk = new EMV_CAPK();
        capk.ArithInd = 0x01;
        capk.HashInd = 0x01;
        ByteUtils.memcpy(capk.RID, CommonConvert.ascStringToBCD("A000000003"), 5);
        capk.KeyID = (byte)0x96;
        ByteUtils.memcpy(capk.Modul, CommonConvert.ascStringToBCD("B74586D19A207BE6627C5B0AAFBC44A2ECF5A2942D3A26CE19C4FFAEEE920521868922E893E7838225A3947A2614796FB2C0628CE8C11E3825A56D3B1BBAEF783A5C6A81F36F8625395126FA983C5216D3166D48ACDE8A431212FF763A7F79D9EDB7FED76B485DE45BEB829A3D4730848A366D3324C3027032FF8D16A1E44D8D"), 256/2);
        capk.ModulLen = (byte)(256/2);
        ByteUtils.memcpy(capk.Exponent, CommonConvert.ascStringToBCD("03"), 1);
        capk.ExponentLen = 0x01;
        ByteUtils.memcpy(capk.ExpDate, CommonConvert.ascStringToBCD("251231"), 3);  //211231
        ByteUtils.memcpy(capk.CheckSum, CommonConvert.ascStringToBCD("7616E9AC8BE014AF88CA11A8FB17967B7394030E"));
        ret = Common.AddCapk_Api(capk);

        //4
        capk = new EMV_CAPK();
        capk.ArithInd = 0x01;
        capk.HashInd = 0x01;
        ByteUtils.memcpy(capk.RID, CommonConvert.ascStringToBCD("A000000003"), 5);
        capk.KeyID = (byte)0x58;
        ByteUtils.memcpy(capk.Modul, CommonConvert.ascStringToBCD("99552C4A1ECD68A0260157FC4151B5992837445D3FC57365CA5692C87BE358CDCDF2C92FB6837522842A48EB11CDFFE2FD91770C7221E4AF6207C2DE4004C7DEE1B6276DC62D52A87D2CD01FBF2DC4065DB52824D2A2167A06D19E6A0F781071CDB2DD314CB94441D8DC0E936317B77BF06F5177F6C5ABA3A3BC6AA30209C97260B7A1AD3A192C9B8CD1D153570AFCC87C3CD681D13E997FE33B3963A0A1C79772ACF991033E1B8397AD0341500E48A24770BC4CBE19D2CCF419504FDBF0389BC2F2FDCD4D44E61F"), 400/2);
        capk.ModulLen = (byte)(400/2);
        ByteUtils.memcpy(capk.Exponent, CommonConvert.ascStringToBCD("010001"), 3);
        capk.ExponentLen = 0x03;
        ByteUtils.memcpy(capk.ExpDate, CommonConvert.ascStringToBCD("251231"), 3);  //211231
        ByteUtils.memcpy(capk.CheckSum, CommonConvert.ascStringToBCD("753ED0AA23E4CD5ABD69EAE7904B684A34A57C22"));
        ret = Common.AddCapk_Api(capk);

        //5
        capk = new EMV_CAPK();
        capk.ArithInd = 0x01;
        capk.HashInd = 0x01;
        ByteUtils.memcpy(capk.RID, CommonConvert.ascStringToBCD("A000000003"), 5);
        capk.KeyID = (byte)0x52;
        ByteUtils.memcpy(capk.Modul, CommonConvert.ascStringToBCD("AFF740F8DBE763F333A1013A43722055C8E22F41779E219B0E1C409D60AFD45C8789C57EECD71EA4A269A675916CC1C5E1A05A35BD745A79F94555CE29612AC9338769665B87C3CA8E1AC4957F9F61FA7BFFE4E17631E937837CABF43DD6183D6360A228A3EBC73A1D1CDC72BF09953C81203AB7E492148E4CB774CDDFAAC3544D0DD4F8C8A0E9C70B877EA79F2C22E4CE52C69F3EF376F61B0F43A540FE96C63F586310C3B6E39C78C4D647CADB5933"), 352/2);
        capk.ModulLen = (byte)(352/2);
        ByteUtils.memcpy(capk.Exponent, CommonConvert.ascStringToBCD("03"), 1);
        capk.ExponentLen = 0x01;
        ByteUtils.memcpy(capk.ExpDate, CommonConvert.ascStringToBCD("251231"), 3);  //211231
        ByteUtils.memcpy(capk.CheckSum, CommonConvert.ascStringToBCD("42D96E6E1217E5B59CC2079CE50C3D9F55B6FC1D"));
        ret = Common.AddCapk_Api(capk);
	 }

	public static int GetPosEntryMode()
	{
		//fallback:0x92   magstrip_notfallback:0x02  chip:0x05
		if(GlobalConstants.PosCom.stTrans.ucSwipedFlag == DefConstants.MASK_INCARDNO_PICC
				|| GlobalConstants.PosCom.stTrans.ucSwipedFlag == DefConstants.MASK_INCARDNO_ICC)
			return 0x05;
		else if(GlobalConstants.PosCom.stTrans.ucSwipedFlag == DefConstants.MASK_INCARDNO_MAGCARD)
		{
			if(GlobalConstants.PosCom.stTrans.IccFallBack == 1)
				return 0x92;
			else
				return 0x02;
		}
		else
			return 0;
	}

	public static int GetPosBatchCaptureInfo()
	{
		return 0;
	}

	public static int GetPosAdviceSupportInfo()
	{
		return 1;
	}


	public static void FormatAmt_Bcd(byte[] pAmount, byte[] pBcd)
	{
		byte[] sBuf = new byte[16];

		MathsApi.BcdToAsc_Api(sBuf, pBcd, 12);
		FormatAmt_Str(pAmount, sBuf);
	}

	public static void FormatAmt_Str(byte[] pDest, byte[] pSrc) {
		int i = 0;
		int cLen = 0;

		cLen = ByteUtils.strlen(pSrc);
		for (i = 0; i < cLen; i++) {
			if ((pSrc[i] != '0') || (pSrc[i] == 0))
				break;
		}
		pSrc = ByteUtils.subBytes(pSrc, i);
		cLen = ByteUtils.strlen(pSrc);

		ByteUtils.strcpy(pDest, "0.00");
		if (cLen > 2) {
			ByteUtils.memcpy(pDest, pSrc, cLen - 2);
			pDest[cLen - 2] = '.';

			byte[] temp = new byte[pDest.length];
			ByteUtils.strcpy(temp, ByteUtils.subBytes(pSrc, cLen - 2));
			ByteUtils.memcpy(pDest, cLen - 1, temp, 0, ByteUtils.strlen(temp));
		} else {
			ByteUtils.memcpy(pDest, 4 - cLen, pSrc, 0, cLen);
		}
	}

	public static int EMVICCOnlineTransComplete(int IsOnLineSucc) {
		int ret = 0, IAuthDataLen = 0, ScriptLen = 0, AuthCodeLen = 0;
		byte[] RspCode = new byte[2], AuthCode = new byte[6];
		byte[] IAuthData = new byte[16], Script = new byte[400];// 300

		//PublicSource.DisplayProcessing();

		// online reference, online denail , online approve
		if ((IsOnLineSucc == Common.ONLINE_REFER )||(IsOnLineSucc == Common.ONLINE_FAILED )|| (IsOnLineSucc ==  Common.ONLINE_APPROVE)) {
			byte[] AuthCodeLenAddr = CommonConvert.intToBytes(AuthCodeLen);
			byte[] IAuthDataLenAddr = CommonConvert.intToBytes(IAuthDataLen);
			byte[] ScriptLenAddr = CommonConvert.intToBytes(ScriptLen);
			// ret =
			// EMVGetOnlineRespData(RspCode,AuthCode,&AuthCodeLen,IAuthData,&IAuthDataLen,Script,&ScriptLen);

			/*  //to get the right data /////
			ret = EMVGetOnlineRespData(RspCode, AuthCode, AuthCodeLenAddr,
					IAuthData, IAuthDataLenAddr, Script, ScriptLenAddr);
					*/
			AuthCodeLen = CommonConvert.bytesToInt(AuthCodeLenAddr);
			IAuthDataLen = CommonConvert.bytesToInt(IAuthDataLenAddr);
			ScriptLen = CommonConvert.bytesToInt(ScriptLenAddr);
		} else {
			ret = IsOnLineSucc;
		}

		ret = EMV.Complete_Api((byte)ret, RspCode, AuthCode, AuthCodeLen, IAuthData, IAuthDataLen, Script, ScriptLen);
		/*
        //save script first  //this need to be open
		Log.writeLog("ScriptLen:" + ScriptLen);
		if (ScriptLen != 0)
			SaveScriptResult(); // save script
			*/
		if (ret != 0)
			return ret;

		ByteUtils.memcpy(GlobalConstants.PosCom.stTrans.Arpc, IAuthData, 8);
		int[] ScriptLenAddr = new int[1];
		Common.GetTLV_Api(EmvTagConstants.TLV_TAG_AC,
				GlobalConstants.PosCom.stTrans.tc, ScriptLenAddr);
		ScriptLen = ScriptLenAddr[0];

		Common.GetTLV_Api(EmvTagConstants.TLV_TAG_CID, GlobalConstants.PosCom.stTrans.cid, ScriptLenAddr);
		ScriptLen = ScriptLenAddr[0];

		// EmvSaveDataOnline();
		//
		// if(IsOnLineSucc == EmvCommonConstants.ONLINE_APPROVE)
		// {
		// Script = new byte[400];
		// byte[] ScriptLenAddr = CommonConvert.intToBytes(ScriptLen);
		// ret = EmvLibApi.EmvGetTLV_Api((short)0x9f26, Script, ScriptLenAddr);
		// ScriptLen = CommonConvert.bcdToINT(ScriptLenAddr);
		//
		// if(ret == EmvCommonConstants.EMV_OK)
		// {
		// ByteUtils.memcpyHex(IAuthData, "/x9F/x26/x08", "/x", "", 3);
		// ByteUtils.memcpy(IAuthData, 3, Script, 0, 8);
		// ByteUtils.memcpy(GlobalConstants.PosCom.getStTrans().getIccData(),
		// IAuthData, 11);
		// Curp += 11;
		// }
		//
		// ByteUtils.memset(Script, 0, Script.length);
		//
		// ScriptLenAddr = CommonConvert.intToBytes(ScriptLen);
		// ret = EmvLibApi.EmvGetTLV_Api((short)0x9f27, Script, ScriptLenAddr);
		// ScriptLen = CommonConvert.bcdToINT(ScriptLenAddr);
		//
		// if(ret == EmvCommonConstants.EMV_OK)
		// {
		// ByteUtils.memcpyHex(IAuthData, "/x9F/x27/x01", "/x", "", 3);
		// ByteUtils.memcpy(IAuthData, 3, Script, 0, 1);
		// ByteUtils.memcpy(GlobalConstants.PosCom.getStTrans().getIccData(),
		// Curp, IAuthData, 0, 4);
		// Curp += 4;
		// }
		//
		// ByteUtils.memset(Script, 0, Script.length);
		//
		// ScriptLenAddr = CommonConvert.intToBytes(ScriptLen);
		// ret = EmvLibApi.EmvGetTLV_Api((short)0x8a, Script, ScriptLenAddr);
		// ScriptLen = CommonConvert.bcdToINT(ScriptLenAddr);
		//
		// if(ret == EmvCommonConstants.EMV_OK)
		// {
		// ByteUtils.memcpyHex(IAuthData, "/x8a/x02", "/x", "", 2);
		// ByteUtils.memcpy(IAuthData, 2, Script, 0, 2);
		// ByteUtils.memcpy(GlobalConstants.PosCom.getStTrans().getIccData(),
		// GlobalConstants.PosCom.getStTrans().getnIccDataLen(), IAuthData, 0,
		// 4);
		// GlobalConstants.PosCom.getStTrans().setnIccDataLen(
		// (short)(GlobalConstants.PosCom.getStTrans().getnIccDataLen() + 4));
		// }
		//
		// Log.writeLog("EMVICCOnlineTransComplete: IccDataLen="+GlobalConstants.PosCom.getStTrans().getnIccDataLen());
		// Log.writeLog("EMVICCOnlineTransComplete: IccData="+CommonConvert.bytes2HexString(GlobalConstants.PosCom.getStTrans().getIccData()));
		//
		// }
		return ret;
	}

	public static int EmvInitDefParam() {
		EMV.GetParam_Api(GlobalConstants.stEmvParam);
		Common.GetParam_Api(GlobalConstants.termParam); //mtermParam
		ByteUtils.memcpy(GlobalConstants.termParam.MerchName, GlobalConstants.gCtrlParam.getMerchantName());
		ByteUtils.memcpy(GlobalConstants.termParam.MerchName, new byte[]{0x00, 0x01});
		ByteUtils.strcpy(GlobalConstants.termParam.MerchId, GlobalConstants.gCtrlParam.getMerchantNo());
		ByteUtils.strcpy(GlobalConstants.termParam.TermId,GlobalConstants.gCtrlParam.getTerminalNo());
		ByteUtils.memcpy(GlobalConstants.termParam.CountryCode, new byte[]{0x08, 0x40});
		ByteUtils.memcpy(GlobalConstants.termParam.TransCurrCode, new byte[]{0x08, 0x40});
		ByteUtils.memcpy(GlobalConstants.termParam.ReferCurrCode, new byte[]{0x08, 0x40});
		ByteUtils.memcpy(GlobalConstants.termParam.AcquierId, "12345678".getBytes());
		GlobalConstants.termParam.ReferCurrExp = 0x02;
        GlobalConstants.termParam.ReferCurrCon = 1000;//1000
        GlobalConstants.termParam.TerminalType = 0x22;  //(byte)tradetype;
        GlobalConstants.termParam.TransCurrExp = 0x02;
        ByteUtils.memcpy(GlobalConstants.stEmvParam.Capability, CommonConvert.ascStringToBCD("E0F1C8"));
        Log.d("aabb", "EmvInitDefParam Capability::"+ CommonConvert.bcdToASCString(GlobalConstants.stEmvParam.Capability));
        Common.SetParam_Api(GlobalConstants.termParam);
		EMV.SetParam_Api(GlobalConstants.stEmvParam);

		return 0;
	}

	public static void initPayPassWaveConfig(int transType) {

        PAYPASS_TERM_PARAM ppParam = new PAYPASS_TERM_PARAM();
        PAYPASS_DE_PARAM ppDEParam = new PAYPASS_DE_PARAM();

        if (transType == 0xFF)
            transType = 0x00;

        // Common Terminal Param

		Common.GetParam_Api(GlobalConstants.termParam); //mtermParam
		GlobalConstants.termParam.AcquierId[0] = 0;
		ByteUtils.memcpy(GlobalConstants.termParam.MerchName, GlobalConstants.gCtrlParam.getMerchantName());
		ByteUtils.memcpy(GlobalConstants.termParam.MerchCateCode, CommonConvert.ascStringToBCD("0001"));
		ByteUtils.strcpy(GlobalConstants.termParam.MerchId, GlobalConstants.gCtrlParam.getMerchantNo());
		ByteUtils.strcpy(GlobalConstants.termParam.TermId,GlobalConstants.gCtrlParam.getTerminalNo());
		ByteUtils.memcpy(GlobalConstants.termParam.CountryCode, new byte[]{0x08, 0x40});
		ByteUtils.memcpy(GlobalConstants.termParam.TransCurrCode, new byte[]{0x08, 0x40});
		ByteUtils.memcpy(GlobalConstants.termParam.ReferCurrCode, new byte[]{0x08, 0x40});
		ByteUtils.memcpy(GlobalConstants.termParam.AcquierId, "12345678".getBytes());
		GlobalConstants.termParam.ReferCurrExp = 0x02;
        GlobalConstants.termParam.ReferCurrCon = 1000;//1000
        GlobalConstants.termParam.TerminalType = 0x22;  //(byte)tradetype;
        GlobalConstants.termParam.TransCurrExp = 0x02;
        GlobalConstants.termParam.TransType = (byte)transType;
        Common.SetParam_Api(GlobalConstants.termParam);

        // PayPass Terminal Param
        PayPass.GetParam_Api(ppParam);
        ppParam.CardDataInputCapability = 0x00;
        ppParam.SecurityCapability = 0x08;
        ByteUtils.memset(ppParam.ExCapability, 0x00, 5);
        ppParam.ReadBalanceBeforeGenAC = 0;
        ppParam.ReadBalanceAfterGenAC = 0;
        ByteUtils.memset(ppParam.BalanceBG, 0xFF, 6);
        ByteUtils.memset(ppParam.BalanceAG, 0xFF, 6);
        System.arraycopy(new byte[]{0x00, 0x00}, 0, ppParam.MaxTornTransTime, 0, 2);
        ppParam.MaxTornTransNum = 0;
        System.arraycopy(new byte[]{0x00, 0x00, 0x13}, 0, ppParam.MessageHoldTime, 0, 3);
        System.arraycopy(new byte[]{0x00, 0x32}, 0, ppParam.MaxRRTGrace, 0, 2);
        System.arraycopy(new byte[]{0x00, 0x14}, 0, ppParam.MinRRTGrace, 0, 2);
        ppParam.RRTThresholdM = 0x32;
        System.arraycopy(new byte[]{0x01, 0x2C}, 0, ppParam.RRTThresholdA, 0, 2);
        System.arraycopy(new byte[]{0x00, 0x12}, 0, ppParam.ExpRRTCAPDU, 0, 2);
        System.arraycopy(new byte[]{0x00, 0x18}, 0, ppParam.ExpRRTRAPDU, 0, 2);
        System.arraycopy(new byte[]{0x04, 0x11, 0x22, 0x33, 0x44}, 0, ppParam.MerchantCustomData, 0, 5);
        ppParam.TransCategoryCode = 0x01;
        PayPass.SetParam_Api(ppParam);

        // PayPass DE Param
        ppDEParam.clear();
        ppDEParam.hasDSVNTerm = 1;
        ppDEParam.hasDSACType = 1;
        ppDEParam.hasDSInputCard = 1;
        ppDEParam.hasDSInputTerm = 1;
        ppDEParam.hasDSODSInfo = 1;
        ppDEParam.hasDSODSInfoForReader = 1;
        ppDEParam.hasDSODSTerm = 1;
        PayPass.SetDEParam_Api(ppDEParam);
        //configType = PPS_MChip1;

        PAYWAVE_TERM_PARAM pwparm = new PAYWAVE_TERM_PARAM();
        PayWave.PayWave_GetParam_Api(pwparm);
        ByteUtils.memcpy(pwparm.TTQ , CommonConvert.ascStringToBCD("3600C000"), 4);
        pwparm.bCheckBlacklist = 1;
        pwparm.bDRL = 1;
        pwparm.bCashDRL = 1;
        pwparm.bCashbackDRL = 1;
        ByteUtils.memcpy(pwparm.CA_TTQ , CommonConvert.ascStringToBCD("3600C000"), 4);
        pwparm.CA_bStatusCheck = 1;
        pwparm.CA_bZeroAmtCheck = 1;
        pwparm.CA_ZeroAmtCheckOpt = 0;
        pwparm.CA_bTransLimitCheck = 1;
        pwparm.CA_bCVMLimitCheck = 1;
        pwparm.CA_bFloorLimitCheck = 1;
        pwparm.CA_bHasFloorLimit = 1;
        pwparm.CA_TransLimit = 3000;
        pwparm.CA_CVMLimit = 1000;
        pwparm.CA_FloorLimit = 2000;
        ByteUtils.memcpy(pwparm.CB_TTQ , CommonConvert.ascStringToBCD("3600C000"), 4);
        pwparm.CB_bStatusCheck = 1;
        pwparm.CB_bZeroAmtCheck = 1;
        pwparm.CB_ZeroAmtCheckOpt = 0;
        pwparm.CB_bTransLimitCheck = 1;
        pwparm.CB_bCVMLimitCheck = 1;
        pwparm.CB_bFloorLimitCheck = 1;
        pwparm.CB_bHasFloorLimit = 1;
        pwparm.CB_TransLimit = 5000;
        pwparm.CB_CVMLimit = 1000;
        pwparm.CB_FloorLimit = 2000;
        PayWave.PayWave_SetParam_Api(pwparm);
        PayWave.PayWave_SaveParam_Api(pwparm);
    }

	//example for adding paypass AID
	public static void PayPassAddAppExp(int transType)
    {
    	PAYPASS_APPLIST app = new PAYPASS_APPLIST();

    	// AID List
        //PayPass.ClearApp_Api();

        // MasterCard
        System.arraycopy(new byte[]{(byte)0xA0, 0x00, 0x00, 0x00, 0x04, 0x10, 0x10}, 0, app.AID, 0, 7);
        app.AidLen = 7;
        System.arraycopy(new byte[]{0x00, 0x02}, 0, app.Version, 0, 2);
        app.CVMCapabilityCVM = 0x60;
        app.CVMCapabilityNoCVM = 0x08;
        System.arraycopy(new byte[]{0x03, (byte) 0x9F, 0x6A, 0x04}, 0, app.uDOL, 0, 4);
        app.KernelID = 0x02;
        System.arraycopy(new byte[]{0x00, 0x01}, 0, app.MagStripeAVN, 0, 2);
        System.arraycopy(new byte[]{0x08, 0x6C, (byte) 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}, 0, app.RiskManData, 0, 9);
        if (transType == 0x17)
            app.MagCVMCapabilityCVM = 0x20;
        else
            app.MagCVMCapabilityCVM = 0x10;
        app.MagCVMCapabilityNoCVM = 0x00;
        app.FloorLimit = 10000;
        app.TransLimitNoODCVM = 30000;
        app.TransLimitODCVM = 50000;
        ByteUtils.memset(app.TACDenial, 0, 6);
        ByteUtils.memset(app.TACOnline, 0, 6);
        ByteUtils.memset(app.TACDefault, 0, 6);
        app.KernelConfig = 0x20;
        if ((transType == 0x00) || (transType == 0x12) || (transType == 0x21))
            app.CVMLimit = 1000;
        else
            app.CVMLimit = 20000;
        PayPass.AddApp_Api(app);

        // Maestro
        System.arraycopy(new byte[]{(byte)0xA0, 0x00, 0x00, 0x00, 0x04, 0x30, 0x60}, 0, app.AID, 0, 7);
        app.AidLen = 7;
        app.KernelConfig = (byte)0xA0;
        app.CVMLimit = 30000;
        System.arraycopy(new byte[]{0x08, 0x44, (byte) 0xFF, (byte) 0x80, 0x00, 0x00, 0x00, 0x00, 0x00}, 0, app.RiskManData, 0, 9);
        if (transType == 0x17) {
            app.MagCVMCapabilityCVM = (byte)0xF0;
            app.MagCVMCapabilityNoCVM = (byte)0xF0;
        }
        else {
            app.MagCVMCapabilityCVM = 0x10;
            app.MagCVMCapabilityNoCVM = 0x00;
        }
        PayPass.AddApp_Api(app);

        // Test
        System.arraycopy(new byte[]{(byte)0xB0, 0x12, 0x34, 0x56, 0x78}, 0, app.AID, 0, 5);
        app.AidLen = 5;
        app.KernelConfig = 0x20;
        if ((transType == 0x00) ||
                (transType == 0x12) || (transType == 0x21))
            app.CVMLimit = 1000;
        else
            app.CVMLimit = 10000;
        ByteUtils.memset(app.RiskManData, 0, 9);
        app.MagCVMCapabilityCVM = 0x10;
        app.MagCVMCapabilityNoCVM = 0x00;
        PayPass.AddApp_Api(app);

    }
	//example for adding paywave aid
    public static void PayWaveAddAppExp()
    {
    	PAYWAVE_APPLIST item = new PAYWAVE_APPLIST();

        item.SelFlag = 0;
        item.bStatusCheck = 1;
        item.bZeroAmtCheck = 1;
        item.ZeroAmtCheckOpt = 1;
        item.bTransLimitCheck = 1;
        item.bCVMLimitCheck = 1;
        item.bFloorLimitCheck = 1;
        item.bHasFloorLimit = 1;
        item.TransLimit = 1000;
        item.CVMLimit = 2;
        item.FloorLimit = 1000;
        item.TermFloorLimit = 1000;

        ByteUtils.memset(item.AID, 0, item.AID.length);
        ByteUtils.memcpy(item.AID, CommonConvert.ascStringToBCD("A0000000031010"), 7 );
        item.AidLen= 7;
        PayWave.PayWave_AddApp_Api(item);

        ByteUtils.memset(item.AID, 0, item.AID.length);
        ByteUtils.memcpy(item.AID, CommonConvert.ascStringToBCD("A000000003"), 5);
        item.AidLen= 5;
        PayWave.PayWave_AddApp_Api(item);

        ByteUtils.memset(item.AID, 0, item.AID.length);
        ByteUtils.memcpy(item.AID, CommonConvert.ascStringToBCD("A00000000310"), 6);
        item.AidLen= 6;
        PayWave.PayWave_AddApp_Api(item);

        ByteUtils.memset(item.AID, 0, item.AID.length);
        ByteUtils.memcpy(item.AID, CommonConvert.ascStringToBCD("A000000003101002"), 8);
        item.AidLen= 8;
        PayWave.PayWave_AddApp_Api(item);
    }


	/*
	public static void InitCapkFile()
		{
			int	i = 0;

			EmvCapk[] tempCAPK = new EmvCapk[]{
					new EmvCapk(
							new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x03, (byte)0x33}, (byte)0x80,
							(byte)0x00, (byte)0x01, (byte)0x80,
							new byte[]{(byte)0xCC,(byte)0xDB,(byte)0xA6,(byte)0x86,(byte)0xE2,(byte)0xEF,(byte)0xB8,(byte)0x4C,(byte)0xE2,(byte)0xEA,(byte)0x01,(byte)0x20,(byte)0x9E,(byte)0xEB,(byte)0x53,(byte)0xBE,
								(byte)0xF2,(byte)0x1A,(byte)0xB6,(byte)0xD3,(byte)0x53,(byte)0x27,(byte)0x4F,(byte)0xF8,(byte)0x39,(byte)0x1D,(byte)0x70,(byte)0x35,(byte)0xD7,(byte)0x6E,(byte)0x21,(byte)0x56,
								(byte)0xCA,(byte)0xED,(byte)0xD0,(byte)0x75,(byte)0x10,(byte)0xE0,(byte)0x7D,(byte)0xAF,(byte)0xCA,(byte)0xCA,(byte)0xBB,(byte)0x7C,(byte)0xCB,(byte)0x09,(byte)0x50,(byte)0xBA,
								(byte)0x2F,(byte)0x0A,(byte)0x3C,(byte)0xEC,(byte)0x31,(byte)0x3C,(byte)0x52,(byte)0xEE,(byte)0x6C,(byte)0xD0,(byte)0x9E,(byte)0xF0,(byte)0x04,(byte)0x01,(byte)0xA3,(byte)0xD6,
								(byte)0xCC,(byte)0x5F,(byte)0x68,(byte)0xCA,(byte)0x5F,(byte)0xCD,(byte)0x0A,(byte)0xC6,(byte)0x13,(byte)0x21,(byte)0x41,(byte)0xFA,(byte)0xFD,(byte)0x1C,(byte)0xFA,(byte)0x36,
								(byte)0xA2,(byte)0x69,(byte)0x2D,(byte)0x02,(byte)0xDD,(byte)0xC2,(byte)0x7E,(byte)0xDA,(byte)0x4C,(byte)0xD5,(byte)0xBE,(byte)0xA6,(byte)0xFF,(byte)0x21,(byte)0x91,(byte)0x3B,
								(byte)0x51,(byte)0x3C,(byte)0xE7,(byte)0x8B,(byte)0xF3,(byte)0x3E,(byte)0x68,(byte)0x77,(byte)0xAA,(byte)0x5B,(byte)0x60,(byte)0x5B,(byte)0xC6,(byte)0x9A,(byte)0x53,(byte)0x4F,
								(byte)0x37,(byte)0x77,(byte)0xCB,(byte)0xED,(byte)0x63,(byte)0x76,(byte)0xBA,(byte)0x64,(byte)0x9C,(byte)0x72,(byte)0x51,(byte)0x6A,(byte)0x7E,(byte)0x16,(byte)0xAF,(byte)0x85
							},
							(byte)3, new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
							new byte[]{(byte)0x00}
							),

							new EmvCapk(
									new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x03,(byte)0x33}, (byte)0x57,
									(byte)0x00, (byte)0x04, (byte)0x40,
									new byte[]{(byte)0xE8,(byte)0x10,(byte)0x5E,(byte)0x77,(byte)0x86,(byte)0x1F,(byte)0xD2,(byte)0xEB,(byte)0x72,(byte)0x7C,(byte)0x84,(byte)0xE3,(byte)0x6D,(byte)0x3D,(byte)0x4A,(byte)0x56,
										(byte)0x66,(byte)0xBD,(byte)0x0A,(byte)0xDC,(byte)0xE8,(byte)0x78,(byte)0x1F,(byte)0x01,(byte)0x45,(byte)0xD3,(byte)0xD8,(byte)0x2D,(byte)0x72,(byte)0xB9,(byte)0x27,(byte)0x48,
										(byte)0xE2,(byte)0x2D,(byte)0x54,(byte)0x04,(byte)0xC6,(byte)0xC4,(byte)0x1F,(byte)0x3E,(byte)0xC8,(byte)0xB7,(byte)0x90,(byte)0xDE,(byte)0x2F,(byte)0x61,(byte)0xCF,(byte)0x29,
										(byte)0xFA,(byte)0xEC,(byte)0xB1,(byte)0x68,(byte)0xC7,(byte)0x9F,(byte)0x5C,(byte)0x86,(byte)0x66,(byte)0x76,(byte)0x2D,(byte)0x53,(byte)0xCC,(byte)0x26,(byte)0xA4,(byte)0x60
									},
									(byte)0,new byte[]{(byte)0x00},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
									new byte[]{(byte)0x00}
									),

									new EmvCapk(
											new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x03,(byte)0x33},(byte)0x58,
											(byte)0x00,(byte)0x04,(byte)0x40,
											new byte[]{(byte)0xFF,(byte)0xC2,(byte)0xB1,(byte)0x51,(byte)0x33,(byte)0x20,(byte)0xC2,(byte)0x75,(byte)0x41,(byte)0x1D,(byte)0xBA,(byte)0xDD,(byte)0x21,(byte)0x88,(byte)0x20,(byte)0x3F,
												(byte)0x7B,(byte)0x62,(byte)0x51,(byte)0x9F,(byte)0x8C,(byte)0x7B,(byte)0xA9,(byte)0x8E,(byte)0xF8,(byte)0xAA,(byte)0x9F,(byte)0xD6,(byte)0xD2,(byte)0xE4,(byte)0x75,(byte)0x98,
												(byte)0x4E,(byte)0x38,(byte)0x3C,(byte)0x3E,(byte)0x12,(byte)0x78,(byte)0x4B,(byte)0x42,(byte)0xB0,(byte)0x66,(byte)0x96,(byte)0x0E,(byte)0xEA,(byte)0x0C,(byte)0x8F,(byte)0xC8,
												(byte)0x09,(byte)0x9E,(byte)0x14,(byte)0x12,(byte)0x80,(byte)0x55,(byte)0xD6,(byte)0x7A,(byte)0x66,(byte)0x6C,(byte)0xCA,(byte)0x5A,(byte)0x05,(byte)0x8C,(byte)0x26,(byte)0xA4
											},
											(byte)0,new byte[]{(byte)0x00},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
											new byte[]{(byte)0x00}
											),

											new EmvCapk(
													new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x03,(byte)0x33},(byte)0x61,
													(byte)0x00,(byte)0x01,(byte)0x80,
													new byte[]{(byte)0x83,(byte)0x4D,(byte)0x2A,(byte)0x38,(byte)0x7C,(byte)0x5A,(byte)0x5F,(byte)0x17,(byte)0x6E,(byte)0xF3,(byte)0xE6,(byte)0x6C,(byte)0xAA,(byte)0xF8,(byte)0x3F,(byte)0x19,
														(byte)0x4B,(byte)0x15,(byte)0xAA,(byte)0xD2,(byte)0x47,(byte)0x0C,(byte)0x78,(byte)0xC7,(byte)0x7D,(byte)0x6E,(byte)0xB3,(byte)0x8E,(byte)0xDA,(byte)0xE3,(byte)0xA2,(byte)0xF9,
														(byte)0xBA,(byte)0x16,(byte)0x23,(byte)0xF6,(byte)0xA5,(byte)0x8C,(byte)0x89,(byte)0x2C,(byte)0xC9,(byte)0x25,(byte)0x63,(byte)0x2D,(byte)0xFF,(byte)0x48,(byte)0xCE,(byte)0x95,
														(byte)0x4B,(byte)0x21,(byte)0xA5,(byte)0x3E,(byte)0x1F,(byte)0x1E,(byte)0x43,(byte)0x66,(byte)0xBE,(byte)0x40,(byte)0x3C,(byte)0x27,(byte)0x9B,(byte)0x90,(byte)0x02,(byte)0x7C,
														(byte)0xBC,(byte)0x72,(byte)0x60,(byte)0x5D,(byte)0xB6,(byte)0xC7,(byte)0x90,(byte)0x49,(byte)0xB8,(byte)0x99,(byte)0x2C,(byte)0xB4,(byte)0x91,(byte)0x2E,(byte)0xFA,(byte)0x27,
														(byte)0x0B,(byte)0xEC,(byte)0xAB,(byte)0x3A,(byte)0x7C,(byte)0xEF,(byte)0xE0,(byte)0x5B,(byte)0xFA,(byte)0x46,(byte)0xE4,(byte)0xC7,(byte)0xBB,(byte)0xCF,(byte)0x7C,(byte)0x7A,
														(byte)0x17,(byte)0x3B,(byte)0xD9,(byte)0x88,(byte)0xD9,(byte)0x89,(byte)0xB3,(byte)0x2C,(byte)0xB7,(byte)0x9F,(byte)0xAC,(byte)0x8E,(byte)0x35,(byte)0xFB,(byte)0xE1,(byte)0x86,
														(byte)0x0E,(byte)0x7E,(byte)0xA9,(byte)0xF2,(byte)0x38,(byte)0xA9,(byte)0x2A,(byte)0x35,(byte)0x93,(byte)0x55,(byte)0x2D,(byte)0x03,(byte)0xD1,(byte)0xE3,(byte)0x86,(byte)0x01
													},
													(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
													new byte[]{(byte)0x00}
													),

													new EmvCapk(
															new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x03,(byte)0x33},(byte)0x62,
															(byte)0x00,(byte)0x01,(byte)0x80,
															new byte[]{(byte)0xB5,(byte)0xCD,(byte)0xD1,(byte)0xE5,(byte)0x36,(byte)0x88,(byte)0x19,(byte)0xFC,(byte)0x3E,(byte)0xA6,(byte)0x5B,(byte)0x80,(byte)0xC6,(byte)0x81,(byte)0x17,(byte)0xBB,
																(byte)0xC2,(byte)0x9F,(byte)0x90,(byte)0x96,(byte)0xEB,(byte)0xD2,(byte)0x17,(byte)0x26,(byte)0x9B,(byte)0x58,(byte)0x3B,(byte)0x07,(byte)0x45,(byte)0xE0,(byte)0xC1,(byte)0x64,
																(byte)0x33,(byte)0xD5,(byte)0x4B,(byte)0x8E,(byte)0xF3,(byte)0x87,(byte)0xB1,(byte)0xE6,(byte)0xCD,(byte)0xDA,(byte)0xED,(byte)0x49,(byte)0x23,(byte)0xC3,(byte)0x9E,(byte)0x37,
																(byte)0x0E,(byte)0x5C,(byte)0xAD,(byte)0xFE,(byte)0x04,(byte)0x17,(byte)0x73,(byte)0x02,(byte)0x3A,(byte)0x6B,(byte)0xC0,(byte)0xA0,(byte)0x33,(byte)0xB0,(byte)0x03,(byte)0x1B,
																(byte)0x00,(byte)0x48,(byte)0xF1,(byte)0x8A,(byte)0xC1,(byte)0x59,(byte)0x77,(byte)0x3C,(byte)0xB6,(byte)0x69,(byte)0x5E,(byte)0xE9,(byte)0x9F,(byte)0x55,(byte)0x1F,(byte)0x41,
																(byte)0x48,(byte)0x83,(byte)0xFB,(byte)0x05,(byte)0xE5,(byte)0x26,(byte)0x40,(byte)0xE8,(byte)0x93,(byte)0xF4,(byte)0x81,(byte)0x60,(byte)0x82,(byte)0x24,(byte)0x1D,(byte)0x7B,
																(byte)0xFA,(byte)0x36,(byte)0x40,(byte)0x96,(byte)0x00,(byte)0x03,(byte)0xAD,(byte)0x75,(byte)0x17,(byte)0x89,(byte)0x5C,(byte)0x50,(byte)0xE1,(byte)0x84,(byte)0xAA,(byte)0x95,
																(byte)0x63,(byte)0x67,(byte)0xB7,(byte)0xBF,(byte)0xFC,(byte)0x6D,(byte)0x86,(byte)0x16,(byte)0xA7,(byte)0xB5,(byte)0x7E,(byte)0x2D,(byte)0x44,(byte)0x7A,(byte)0xB3,(byte)0xE1
															},
															(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
															new byte[]{(byte)0x00}
															),

															new EmvCapk(
																	new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x03,(byte)0x33},(byte)0x63,
																	(byte)0x00,(byte)0x01,(byte)0x90,
																	new byte[]{(byte)0x86,(byte)0x7E,(byte)0xCA,(byte)0x26,(byte)0xA5,(byte)0x74,(byte)0x72,(byte)0xDE,(byte)0xFB,(byte)0x6C,(byte)0xA9,(byte)0x42,(byte)0x89,(byte)0x31,(byte)0x2B,(byte)0xA3,
																		(byte)0x9C,(byte)0x63,(byte)0x05,(byte)0x25,(byte)0x18,(byte)0xDC,(byte)0x48,(byte)0x0B,(byte)0x6E,(byte)0xD4,(byte)0x91,(byte)0xAC,(byte)0xC3,(byte)0x7C,(byte)0x02,(byte)0x88,
																		(byte)0x46,(byte)0xF4,(byte)0xD7,(byte)0xB7,(byte)0x9A,(byte)0xFA,(byte)0xEE,(byte)0xFA,(byte)0x07,(byte)0xFB,(byte)0x01,(byte)0x1D,(byte)0xAA,(byte)0x46,(byte)0xC0,(byte)0x60,
																		(byte)0x21,(byte)0xE9,(byte)0x32,(byte)0xD5,(byte)0x01,(byte)0xBF,(byte)0x52,(byte)0xF2,(byte)0x83,(byte)0x4A,(byte)0xDE,(byte)0x3A,(byte)0xC7,(byte)0x68,(byte)0x9E,(byte)0x94,
																		(byte)0xB2,(byte)0x48,(byte)0xB2,(byte)0x8F,(byte)0x3F,(byte)0xE2,(byte)0x80,(byte)0x36,(byte)0x69,(byte)0xDE,(byte)0xDA,(byte)0x00,(byte)0x09,(byte)0x88,(byte)0xDA,(byte)0x12,
																		(byte)0x49,(byte)0xF9,(byte)0xA8,(byte)0x91,(byte)0x55,(byte)0x8A,(byte)0x05,(byte)0xA1,(byte)0xE5,(byte)0xA7,(byte)0xBD,(byte)0x2C,(byte)0x28,(byte)0x2F,(byte)0xE1,(byte)0x8D,
																		(byte)0x20,(byte)0x41,(byte)0x89,(byte)0xA9,(byte)0x99,(byte)0x4D,(byte)0x4A,(byte)0xDD,(byte)0x86,(byte)0xC0,(byte)0xCE,(byte)0x50,(byte)0x95,(byte)0x2E,(byte)0xD8,(byte)0xBC,
																		(byte)0xEC,(byte)0x0C,(byte)0xE6,(byte)0x33,(byte)0x67,(byte)0x91,(byte)0x88,(byte)0x28,(byte)0x5E,(byte)0x51,(byte)0xE1,(byte)0xBE,(byte)0xD8,(byte)0x40,(byte)0xFC,(byte)0xBF,
																		(byte)0xC1,(byte)0x09,(byte)0x53,(byte)0x93,(byte)0x9A,(byte)0xF4,(byte)0x9D,(byte)0xB9,(byte)0x00,(byte)0x48,(byte)0x91,(byte)0x2E,(byte)0x48,(byte)0xB4,(byte)0x41,(byte)0x81
																	},
																	(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																	new byte[]{(byte)0x00}
																	),

																	new EmvCapk(
																			new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x03,(byte)0x33},(byte)0x64,
																			(byte)0x00,(byte)0x01,(byte)0xA0,
																			new byte[]{(byte)0x91,(byte)0x12,(byte)0x3E,(byte)0xCF,(byte)0x02,(byte)0x30,(byte)0xE3,(byte)0xCB,(byte)0x24,(byte)0x5C,(byte)0x88,(byte)0xDD,(byte)0xFA,(byte)0x3E,(byte)0xE5,(byte)0x7B,
																				(byte)0xC5,(byte)0x8E,(byte)0xD0,(byte)0x0B,(byte)0x36,(byte)0x7B,(byte)0x38,(byte)0x75,(byte)0xFC,(byte)0xB7,(byte)0x95,(byte)0x48,(byte)0x87,(byte)0x26,(byte)0x80,(byte)0xF6,
																				(byte)0x01,(byte)0xE8,(byte)0xC8,(byte)0x39,(byte)0xAC,(byte)0x07,(byte)0x21,(byte)0xBA,(byte)0xB3,(byte)0xB8,(byte)0x9E,(byte)0xD2,(byte)0x16,(byte)0x07,(byte)0x28,(byte)0x1C,
																				(byte)0x89,(byte)0x19,(byte)0xBF,(byte)0x72,(byte)0x62,(byte)0x66,(byte)0xEA,(byte)0xB8,(byte)0x48,(byte)0x50,(byte)0x2A,(byte)0xD8,(byte)0x74,(byte)0xB5,(byte)0x10,(byte)0x7A,
																				(byte)0x4E,(byte)0x65,(byte)0x4E,(byte)0xF6,(byte)0xD3,(byte)0x77,(byte)0x73,(byte)0x34,(byte)0x3F,(byte)0x46,(byte)0x14,(byte)0x35,(byte)0xC8,(byte)0x6E,(byte)0x4A,(byte)0x8F,
																				(byte)0x86,(byte)0x6F,(byte)0xB1,(byte)0x8C,(byte)0x7C,(byte)0xBA,(byte)0x49,(byte)0x7B,(byte)0x42,(byte)0x62,(byte)0x90,(byte)0xC3,(byte)0x8D,(byte)0x19,(byte)0x6E,(byte)0x2A,
																				(byte)0xFF,(byte)0x33,(byte)0xC0,(byte)0x90,(byte)0x6F,(byte)0x92,(byte)0x96,(byte)0xF2,(byte)0x97,(byte)0xE1,(byte)0x56,(byte)0xDC,(byte)0x60,(byte)0x2A,(byte)0x5E,(byte)0x65,
																				(byte)0x3C,(byte)0xA1,(byte)0x16,(byte)0x8F,(byte)0x11,(byte)0x09,(byte)0x26,(byte)0x11,(byte)0x14,(byte)0xBF,(byte)0x7B,(byte)0xE8,(byte)0x12,(byte)0x7A,(byte)0x3E,(byte)0x80,
																				(byte)0x07,(byte)0x19,(byte)0x18,(byte)0x30,(byte)0x13,(byte)0x42,(byte)0x99,(byte)0x39,(byte)0x5C,(byte)0xE2,(byte)0xB3,(byte)0x22,(byte)0x22,(byte)0x86,(byte)0x67,(byte)0xB7,
																				(byte)0x6E,(byte)0x07,(byte)0x2E,(byte)0xB7,(byte)0xFD,(byte)0x5D,(byte)0x0F,(byte)0xB3,(byte)0xA8,(byte)0x3E,(byte)0x8A,(byte)0xD1,(byte)0xD7,(byte)0xF6,(byte)0xFD,(byte)0x81
																			},
																			(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																			new byte[]{(byte)0x00}
																			),

																			new EmvCapk(
																					new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x03,(byte)0x33},(byte)0x65,
																					(byte)0x00,(byte)0x01,(byte)0xB0,
																					new byte[]{(byte)0x81,(byte)0xBA,(byte)0x1E,(byte)0x6B,(byte)0x9F,(byte)0x67,(byte)0x1C,(byte)0xFC,(byte)0x84,(byte)0x8C,(byte)0xA2,(byte)0xAC,(byte)0xD8,(byte)0xE1,(byte)0x7A,(byte)0xF4,
																						(byte)0x06,(byte)0xB4,(byte)0xD3,(byte)0x29,(byte)0xD1,(byte)0xEC,(byte)0xA5,(byte)0xD0,(byte)0x1B,(byte)0xC0,(byte)0x94,(byte)0xA8,(byte)0x7C,(byte)0x30,(byte)0xAF,(byte)0x49,
																						(byte)0x86,(byte)0x79,(byte)0x44,(byte)0xC6,(byte)0x32,(byte)0xE8,(byte)0x18,(byte)0x50,(byte)0x74,(byte)0x65,(byte)0x5F,(byte)0xA5,(byte)0x35,(byte)0xAD,(byte)0x8C,(byte)0xA4,
																						(byte)0x2A,(byte)0x83,(byte)0xB4,(byte)0x1A,(byte)0xAA,(byte)0xEA,(byte)0x85,(byte)0x9F,(byte)0x43,(byte)0x2F,(byte)0xA0,(byte)0xB8,(byte)0x18,(byte)0xE7,(byte)0x2D,(byte)0xC0,
																						(byte)0x7E,(byte)0xD3,(byte)0xF7,(byte)0x7F,(byte)0xB3,(byte)0x18,(byte)0xA4,(byte)0x75,(byte)0xA2,(byte)0x61,(byte)0xC0,(byte)0x76,(byte)0x0A,(byte)0x15,(byte)0x6E,(byte)0x5D,
																						(byte)0xDC,(byte)0x15,(byte)0x7A,(byte)0xE8,(byte)0xB7,(byte)0x9B,(byte)0xA7,(byte)0x2D,(byte)0x89,(byte)0xD6,(byte)0x9F,(byte)0xFF,(byte)0x75,(byte)0x46,(byte)0x19,(byte)0xE9,
																						(byte)0x28,(byte)0xF1,(byte)0x51,(byte)0x6A,(byte)0x2A,(byte)0x72,(byte)0xC0,(byte)0xF8,(byte)0x6B,(byte)0x09,(byte)0xB8,(byte)0xEA,(byte)0x25,(byte)0xF8,(byte)0x6D,(byte)0xC5,
																						(byte)0xA4,(byte)0x8E,(byte)0xBC,(byte)0x5A,(byte)0x16,(byte)0xF8,(byte)0x3F,(byte)0xBA,(byte)0x8F,(byte)0xC4,(byte)0xE3,(byte)0xA9,(byte)0x82,(byte)0x78,(byte)0x91,(byte)0x22,
																						(byte)0x49,(byte)0xF4,(byte)0xE0,(byte)0x79,(byte)0xBC,(byte)0xBC,(byte)0x06,(byte)0xE7,(byte)0xBE,(byte)0xD9,(byte)0xAE,(byte)0xD3,(byte)0x97,(byte)0x87,(byte)0x9D,(byte)0x27,
																						(byte)0x9E,(byte)0xD9,(byte)0x19,(byte)0x25,(byte)0x39,(byte)0x49,(byte)0x01,(byte)0x26,(byte)0x09,(byte)0x49,(byte)0xBC,(byte)0xCE,(byte)0x6F,(byte)0xA1,(byte)0x16,(byte)0x97,
																						(byte)0x98,(byte)0xA2,(byte)0x71,(byte)0x5D,(byte)0xAE,(byte)0x32,(byte)0x98,(byte)0x8B,(byte)0xEF,(byte)0xBE,(byte)0x96,(byte)0x21,(byte)0xAE,(byte)0x15,(byte)0xE0,(byte)0xC1
																					},
																					(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																					new byte[]{(byte)0x00}
																					),

																					new EmvCapk(
																							new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x03,(byte)0x33},(byte)0x66,
																							(byte)0x00,(byte)0x01,(byte)0x60,
																							new byte[]{(byte)0x7F,(byte)0x5A,(byte)0x39,(byte)0x45,(byte)0x79,(byte)0x4D,(byte)0x6B,(byte)0x15,(byte)0xF5,(byte)0xF2,(byte)0x6B,(byte)0x4A,(byte)0x21,(byte)0xA6,(byte)0x3A,(byte)0x5E,
																								(byte)0xF3,(byte)0x55,(byte)0x40,(byte)0xD8,(byte)0xC8,(byte)0xC0,(byte)0x99,(byte)0x15,(byte)0x1F,(byte)0x22,(byte)0x79,(byte)0x78,(byte)0x0A,(byte)0x5C,(byte)0x18,(byte)0xA3,
																								(byte)0x17,(byte)0x70,(byte)0x3C,(byte)0x98,(byte)0x63,(byte)0x2E,(byte)0x80,(byte)0x4D,(byte)0x25,(byte)0x57,(byte)0x6A,(byte)0x7B,(byte)0x46,(byte)0x0C,(byte)0x05,(byte)0x06,
																								(byte)0x1E,(byte)0x03,(byte)0x97,(byte)0x5E,(byte)0x50,(byte)0xFB,(byte)0xD7,(byte)0x49,(byte)0x5B,(byte)0x3A,(byte)0xDC,(byte)0x8E,(byte)0x42,(byte)0x5E,(byte)0x53,(byte)0xDF,
																								(byte)0x76,(byte)0xFA,(byte)0x40,(byte)0xB0,(byte)0x35,(byte)0xE8,(byte)0x7F,(byte)0x69,(byte)0xAB,(byte)0xF8,(byte)0x76,(byte)0x5A,(byte)0x52,(byte)0x52,(byte)0x3F,(byte)0x3B,
																								(byte)0x1A,(byte)0x39,(byte)0xB1,(byte)0x95,(byte)0x28,(byte)0xB0,(byte)0x02,(byte)0x23,(byte)0x90,(byte)0x15,(byte)0xFA,(byte)0xDB,(byte)0xA5,(byte)0x92,(byte)0x10,(byte)0x51
																							},
																							(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																							new byte[]{(byte)0x00}
																							),

																							new EmvCapk(
																									new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x99,(byte)0x99},(byte)0xE1,
																									(byte)0x00,(byte)0x01,(byte)0x70,
																									new byte[]{(byte)0x99,(byte)0xC5,(byte)0xB7,(byte)0x0A,(byte)0xA6,(byte)0x1B,(byte)0x4F,(byte)0x4C,(byte)0x51,(byte)0xB6,(byte)0xF9,(byte)0x0B,(byte)0x0E,(byte)0x3B,(byte)0xFB,(byte)0x7A,
																										(byte)0x3E,(byte)0xE0,(byte)0xE7,(byte)0xDB,(byte)0x41,(byte)0xBC,(byte)0x46,(byte)0x68,(byte)0x88,(byte)0xB3,(byte)0xEC,(byte)0x8E,(byte)0x99,(byte)0x77,(byte)0xC7,(byte)0x62,
																										(byte)0x40,(byte)0x7E,(byte)0xF1,(byte)0xD7,(byte)0x9E,(byte)0x0A,(byte)0xFB,(byte)0x28,(byte)0x23,(byte)0x10,(byte)0x0A,(byte)0x02,(byte)0x0C,(byte)0x3E,(byte)0x80,(byte)0x20,
																										(byte)0x59,(byte)0x3D,(byte)0xB5,(byte)0x0E,(byte)0x90,(byte)0xDB,(byte)0xEA,(byte)0xC1,(byte)0x8B,(byte)0x78,(byte)0xD1,(byte)0x3F,(byte)0x96,(byte)0xBB,(byte)0x2F,(byte)0x57,
																										(byte)0xEE,(byte)0xDD,(byte)0xC3,(byte)0x0F,(byte)0x25,(byte)0x65,(byte)0x92,(byte)0x41,(byte)0x7C,(byte)0xDF,(byte)0x73,(byte)0x9C,(byte)0xA6,(byte)0x80,(byte)0x4A,(byte)0x10,
																										(byte)0xA2,(byte)0x9D,(byte)0x28,(byte)0x06,(byte)0xE7,(byte)0x74,(byte)0xBF,(byte)0xA7,(byte)0x51,(byte)0xF2,(byte)0x2C,(byte)0xF3,(byte)0xB6,(byte)0x5B,(byte)0x38,(byte)0xF3,
																										(byte)0x7F,(byte)0x91,(byte)0xB4,(byte)0xDA,(byte)0xF8,(byte)0xAE,(byte)0xC9,(byte)0xB8,(byte)0x03,(byte)0xF7,(byte)0x61,(byte)0x0E,(byte)0x06,(byte)0xAC,(byte)0x9E,(byte)0x6B
																									},
																									(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																									new byte[]{(byte)0x00}
																									),

																									new EmvCapk(
																											new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x99,(byte)0x99},(byte)0xE2,
																											(byte)0x00,(byte)0x01,(byte)0x70,
																											new byte[]{(byte)0xBD,(byte)0x23,(byte)0x2E,(byte)0x34,(byte)0x8B,(byte)0x11,(byte)0x8E,(byte)0xB3,(byte)0xF6,(byte)0x44,(byte)0x6E,(byte)0xF4,(byte)0xDA,(byte)0x6C,(byte)0x3B,(byte)0xAC,
																												(byte)0x9B,(byte)0x2A,(byte)0xE5,(byte)0x10,(byte)0xC5,(byte)0xAD,(byte)0x10,(byte)0x7D,(byte)0x38,(byte)0x34,(byte)0x32,(byte)0x55,(byte)0xD2,(byte)0x1C,(byte)0x4B,(byte)0xDF,
																												(byte)0x49,(byte)0x52,(byte)0xA4,(byte)0x2E,(byte)0x92,(byte)0xC6,(byte)0x33,(byte)0xB1,(byte)0xCE,(byte)0x4B,(byte)0xFE,(byte)0xC3,(byte)0x9A,(byte)0xFB,(byte)0x6D,(byte)0xFE,
																												(byte)0x14,(byte)0x7E,(byte)0xCB,(byte)0xB9,(byte)0x1D,(byte)0x68,(byte)0x1D,(byte)0xAC,(byte)0x15,(byte)0xFB,(byte)0x0E,(byte)0x19,(byte)0x8E,(byte)0x9A,(byte)0x7E,(byte)0x46,
																												(byte)0x36,(byte)0xBD,(byte)0xCA,(byte)0x10,(byte)0x7B,(byte)0xCD,(byte)0xA3,(byte)0x38,(byte)0x4F,(byte)0xCB,(byte)0x28,(byte)0xB0,(byte)0x6A,(byte)0xFE,(byte)0xF9,(byte)0x0F,
																												(byte)0x09,(byte)0x9E,(byte)0x70,(byte)0x84,(byte)0x51,(byte)0x1F,(byte)0x3C,(byte)0xC0,(byte)0x10,(byte)0xD4,(byte)0x34,(byte)0x35,(byte)0x03,(byte)0xE1,(byte)0xE5,(byte)0xA6,
																												(byte)0x72,(byte)0x64,(byte)0xB4,(byte)0x36,(byte)0x7D,(byte)0xAA,(byte)0x9A,(byte)0x39,(byte)0x49,(byte)0x49,(byte)0x92,(byte)0x72,(byte)0xE9,(byte)0xB5,(byte)0x02,(byte)0x2F
																											},
																											(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																											new byte[]{(byte)0x00}
																											),

																											new EmvCapk(
																													new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x99,(byte)0x99},(byte)0xE3,
																													(byte)0x00,(byte)0x01,(byte)0x70,
																													new byte[]{(byte)0xBC,(byte)0x01,(byte)0xE1,(byte)0x22,(byte)0x23,(byte)0xE1,(byte)0xA4,(byte)0x1E,(byte)0x88,(byte)0xBF,(byte)0xFA,(byte)0x80,(byte)0x10,(byte)0x93,(byte)0xC5,(byte)0xF8,
																														(byte)0xCE,(byte)0xC5,(byte)0xCD,(byte)0x05,(byte)0xDB,(byte)0xBD,(byte)0xBB,(byte)0x78,(byte)0x7C,(byte)0xE8,(byte)0x72,(byte)0x49,(byte)0xE8,(byte)0x80,(byte)0x83,(byte)0x27,
																														(byte)0xC2,(byte)0xD2,(byte)0x18,(byte)0x99,(byte)0x1F,(byte)0x97,(byte)0xA1,(byte)0x13,(byte)0x1E,(byte)0x8A,(byte)0x25,(byte)0xB0,(byte)0x12,(byte)0x2E,(byte)0xD1,(byte)0x1E,
																														(byte)0x70,(byte)0x9C,(byte)0x53,(byte)0x3E,(byte)0x88,(byte)0x86,(byte)0xA1,(byte)0x25,(byte)0x9A,(byte)0xDD,(byte)0xFD,(byte)0xCB,(byte)0xB3,(byte)0x96,(byte)0x60,(byte)0x4D,
																														(byte)0x24,(byte)0xE5,(byte)0x05,(byte)0xA2,(byte)0xD0,(byte)0xB5,(byte)0xDD,(byte)0x03,(byte)0x84,(byte)0xFB,(byte)0x00,(byte)0x02,(byte)0xA7,(byte)0xA1,(byte)0xEB,(byte)0x39,
																														(byte)0xBC,(byte)0x8A,(byte)0x11,(byte)0x33,(byte)0x9C,(byte)0x7A,(byte)0x94,(byte)0x33,(byte)0xA9,(byte)0x48,(byte)0x33,(byte)0x77,(byte)0x61,(byte)0xBE,(byte)0x73,(byte)0xBC,
																														(byte)0x49,(byte)0x7B,(byte)0x8E,(byte)0x58,(byte)0x73,(byte)0x6D,(byte)0xA4,(byte)0x63,(byte)0x65,(byte)0x38,(byte)0xAD,(byte)0x28,(byte)0x2D,(byte)0x3C,(byte)0xD3,(byte)0xDB
																													},
																													(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																													new byte[]{(byte)0x00}
																													),

																													new EmvCapk(
																															new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x99,(byte)0x99},(byte)0xE4,
																															(byte)0x00,(byte)0x01,(byte)0x80,
																															new byte[]{(byte)0xCB,(byte)0xF2,(byte)0xE4,(byte)0x0F,(byte)0x08,(byte)0x36,(byte)0xC9,(byte)0xA5,(byte)0xE3,(byte)0x90,(byte)0xA3,(byte)0x7B,(byte)0xE3,(byte)0xB8,(byte)0x09,(byte)0xBD,
																																(byte)0xF5,(byte)0xD7,(byte)0x40,(byte)0xCB,(byte)0x1D,(byte)0xA3,(byte)0x8C,(byte)0xFC,(byte)0x05,(byte)0xD5,(byte)0xF8,(byte)0xD6,(byte)0xB7,(byte)0x74,(byte)0x5B,(byte)0x5E,
																																(byte)0x9A,(byte)0x3F,(byte)0xA6,(byte)0x96,(byte)0x1E,(byte)0x55,(byte)0xFF,(byte)0x20,(byte)0x41,(byte)0x21,(byte)0x08,(byte)0x52,(byte)0x5E,(byte)0x66,(byte)0xB9,(byte)0x70,
																																(byte)0xF9,(byte)0x02,(byte)0xF7,(byte)0xFF,(byte)0x43,(byte)0x05,(byte)0xDD,(byte)0x83,(byte)0x2C,(byte)0xD0,(byte)0x76,(byte)0x3E,(byte)0x3A,(byte)0xA8,(byte)0xB8,(byte)0x17,
																																(byte)0x3F,(byte)0x84,(byte)0x77,(byte)0x71,(byte)0x00,(byte)0xB1,(byte)0x04,(byte)0x7B,(byte)0xD1,(byte)0xD7,(byte)0x44,(byte)0x50,(byte)0x93,(byte)0x12,(byte)0xA0,(byte)0x93,
																																(byte)0x2E,(byte)0xD2,(byte)0x5F,(byte)0xED,(byte)0x52,(byte)0xA9,(byte)0x59,(byte)0x43,(byte)0x07,(byte)0x68,(byte)0xCC,(byte)0xD9,(byte)0x02,(byte)0xFD,(byte)0x8C,(byte)0x8A,
																																(byte)0xD9,(byte)0x12,(byte)0x3E,(byte)0x6A,(byte)0xDD,(byte)0xB3,(byte)0xF3,(byte)0x4B,(byte)0x92,(byte)0xE7,(byte)0x92,(byte)0x4D,(byte)0x72,(byte)0x9C,(byte)0xB6,(byte)0x47,
																																(byte)0x35,(byte)0x33,(byte)0xAE,(byte)0x2B,(byte)0x2B,(byte)0x55,(byte)0xBF,(byte)0x0E,(byte)0x44,(byte)0x96,(byte)0x4F,(byte)0xDE,(byte)0xA8,(byte)0x44,(byte)0x01,(byte)0x17
																															},
																															(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																															new byte[]{(byte)0x00}
																															),

																															new EmvCapk(
																																	new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x99,(byte)0x99},(byte)0xE5,
																																	(byte)0x00,(byte)0x01,(byte)0x80,
																																	new byte[]{(byte)0xD4,(byte)0xFD,(byte)0xAE,(byte)0x94,(byte)0xDE,(byte)0xDB,(byte)0xEC,(byte)0xC6,(byte)0xD2,(byte)0x0D,(byte)0x38,(byte)0xB0,(byte)0x1E,(byte)0x91,(byte)0x82,(byte)0x6D,
																																		(byte)0xC6,(byte)0x95,(byte)0x43,(byte)0x38,(byte)0x37,(byte)0x99,(byte)0x17,(byte)0xB2,(byte)0xBB,(byte)0x8A,(byte)0x6B,(byte)0x36,(byte)0xB5,(byte)0xD3,(byte)0xB0,(byte)0xC5,
																																		(byte)0xED,(byte)0xA6,(byte)0x0B,(byte)0x33,(byte)0x74,(byte)0x48,(byte)0xBA,(byte)0xFF,(byte)0xEB,(byte)0xCC,(byte)0x3A,(byte)0xBD,(byte)0xBA,(byte)0x86,(byte)0x9E,(byte)0x8D,
																																		(byte)0xAD,(byte)0xEC,(byte)0x6C,(byte)0x87,(byte)0x01,(byte)0x10,(byte)0xC4,(byte)0x2F,(byte)0x5A,(byte)0xAB,(byte)0x90,(byte)0xA1,(byte)0x8F,(byte)0x4F,(byte)0x86,(byte)0x7F,
																																		(byte)0x72,(byte)0xE3,(byte)0x38,(byte)0x6F,(byte)0xFC,(byte)0x7E,(byte)0x67,(byte)0xE7,(byte)0xFF,(byte)0x94,(byte)0xEB,(byte)0xA0,(byte)0x79,(byte)0xE5,(byte)0x31,(byte)0xB3,
																																		(byte)0xCF,(byte)0x32,(byte)0x95,(byte)0x17,(byte)0xE8,(byte)0x1C,(byte)0x5D,(byte)0xD9,(byte)0xB3,(byte)0xDC,(byte)0x65,(byte)0xDB,(byte)0x5F,(byte)0x90,(byte)0x43,(byte)0x19,
																																		(byte)0x0B,(byte)0xE0,(byte)0xBE,(byte)0x89,(byte)0x7E,(byte)0x5F,(byte)0xE4,(byte)0x8A,(byte)0xDF,(byte)0x5D,(byte)0x3B,(byte)0xFA,(byte)0x05,(byte)0x85,(byte)0xE0,(byte)0x76,
																																		(byte)0xE5,(byte)0x54,(byte)0xF2,(byte)0x6E,(byte)0xC6,(byte)0x98,(byte)0x14,(byte)0x79,(byte)0x7F,(byte)0x15,(byte)0x66,(byte)0x9F,(byte)0x4A,(byte)0x25,(byte)0x5C,(byte)0x13
																																	},
																																	(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																	new byte[]{(byte)0x00}
																																	),

																																	new EmvCapk(
																																			new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x99,(byte)0x99},(byte)0xE6,
																																			(byte)0x00,(byte)0x01,(byte)0x80,
																																			new byte[]{(byte)0xEB,(byte)0xF9,(byte)0xFA,(byte)0xEC,(byte)0xC3,(byte)0xE5,(byte)0xC3,(byte)0x15,(byte)0x70,(byte)0x96,(byte)0x94,(byte)0x66,(byte)0x47,(byte)0x75,(byte)0xD3,(byte)0xFB,
																																				(byte)0xDA,(byte)0x5A,(byte)0x50,(byte)0x4D,(byte)0x89,(byte)0x34,(byte)0x4D,(byte)0xD9,(byte)0x20,(byte)0xC5,(byte)0x56,(byte)0x96,(byte)0xE8,(byte)0x91,(byte)0xD9,(byte)0xAB,
																																				(byte)0x62,(byte)0x25,(byte)0x98,(byte)0xA9,(byte)0xD6,(byte)0xAB,(byte)0x8F,(byte)0xBF,(byte)0x35,(byte)0xE4,(byte)0x59,(byte)0x9C,(byte)0xAB,(byte)0x7E,(byte)0xB2,(byte)0x2F,
																																				(byte)0x95,(byte)0x69,(byte)0x92,(byte)0xF8,(byte)0xAB,(byte)0x2E,(byte)0x65,(byte)0x35,(byte)0xDE,(byte)0xCB,(byte)0x6B,(byte)0x57,(byte)0x6F,(byte)0xA0,(byte)0x67,(byte)0x5F,
																																				(byte)0x97,(byte)0xC2,(byte)0x3D,(byte)0xD4,(byte)0xC3,(byte)0x74,(byte)0xA6,(byte)0x6E,(byte)0x6A,(byte)0xF4,(byte)0x19,(byte)0xC9,(byte)0xD2,(byte)0x04,(byte)0xD0,(byte)0xB9,
																																				(byte)0xF9,(byte)0x3C,(byte)0x08,(byte)0xD7,(byte)0x89,(byte)0xD6,(byte)0x38,(byte)0x05,(byte)0x66,(byte)0x0F,(byte)0xBB,(byte)0x62,(byte)0x9D,(byte)0xF1,(byte)0xB4,(byte)0x88,
																																				(byte)0xCF,(byte)0xA1,(byte)0xD7,(byte)0xA1,(byte)0x3E,(byte)0x9B,(byte)0x72,(byte)0x94,(byte)0x37,(byte)0xEE,(byte)0xAF,(byte)0xE7,(byte)0x18,(byte)0xEF,(byte)0xA8,(byte)0x59,
																																				(byte)0x34,(byte)0x8B,(byte)0xA0,(byte)0xD7,(byte)0x68,(byte)0x12,(byte)0xA9,(byte)0x9F,(byte)0x31,(byte)0xCD,(byte)0x36,(byte)0x4F,(byte)0x2A,(byte)0x4F,(byte)0xD4,(byte)0x2F
																																			},
																																			(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																			new byte[]{(byte)0x00}
																																			),

																																			new EmvCapk(
																																					new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x04},(byte)0xFE,
																																					(byte)0x00,(byte)0x01,(byte)0x90,
																																					new byte[]{(byte)0xE7,(byte)0x63,(byte)0x17,(byte)0x96,(byte)0x51,(byte)0x75,(byte)0xA0,(byte)0x8B,(byte)0xEE,(byte)0x51,(byte)0x0F,(byte)0x58,(byte)0x83,(byte)0x0E,(byte)0x87,(byte)0xB2,
																																						(byte)0x62,(byte)0xC7,(byte)0x0D,(byte)0x52,(byte)0x98,(byte)0x03,(byte)0x24,(byte)0x5F,(byte)0xA8,(byte)0xB8,(byte)0x8E,(byte)0x0C,(byte)0x75,(byte)0x35,(byte)0x62,(byte)0xDE,
																																						(byte)0x7A,(byte)0xEB,(byte)0x5A,(byte)0x9E,(byte)0x3E,(byte)0x6C,(byte)0x1A,(byte)0x98,(byte)0xE9,(byte)0x4D,(byte)0x8D,(byte)0xB7,(byte)0xC3,(byte)0x14,(byte)0x07,(byte)0xDA,
																																						(byte)0xC5,(byte)0xD0,(byte)0x71,(byte)0xE0,(byte)0x6B,(byte)0x80,(byte)0xB0,(byte)0x9E,(byte)0x14,(byte)0x6F,(byte)0x22,(byte)0xDB,(byte)0x85,(byte)0xF1,(byte)0xD7,(byte)0x2D,
																																						(byte)0x1E,(byte)0xA1,(byte)0x8D,(byte)0x22,(byte)0x60,(byte)0x00,(byte)0x32,(byte)0xC6,(byte)0xDD,(byte)0x40,(byte)0xE3,(byte)0x71,(byte)0x4D,(byte)0x5A,(byte)0xDA,(byte)0x7D,
																																						(byte)0xE9,(byte)0xD7,(byte)0xD0,(byte)0x1E,(byte)0x88,(byte)0x39,(byte)0x1F,(byte)0x89,(byte)0x31,(byte)0x56,(byte)0xD6,(byte)0xF4,(byte)0xBF,(byte)0x13,(byte)0xE9,(byte)0x06,
																																						(byte)0x35,(byte)0x59,(byte)0xDA,(byte)0x07,(byte)0x86,(byte)0xDE,(byte)0x9B,(byte)0xDE,(byte)0x6B,(byte)0x1C,(byte)0x9B,(byte)0x0B,(byte)0xB9,(byte)0x68,(byte)0xED,(byte)0xDE,
																																						(byte)0x07,(byte)0x14,(byte)0x5A,(byte)0xBF,(byte)0x87,(byte)0x7B,(byte)0x93,(byte)0x16,(byte)0x82,(byte)0xCC,(byte)0xB1,(byte)0xFB,(byte)0x80,(byte)0x07,(byte)0x28,(byte)0x72,
																																						(byte)0x4D,(byte)0x04,(byte)0xAF,(byte)0x24,(byte)0x1E,(byte)0x28,(byte)0x27,(byte)0xE0,(byte)0xFA,(byte)0x1F,(byte)0x62,(byte)0x59,(byte)0x19,(byte)0x14,(byte)0xFF,(byte)0x25
																																					},
																																					(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																					new byte[]{(byte)0x00}
																																					),

																																					new EmvCapk(
																																							new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x04},(byte)0xFC,
																																							(byte)0x00,(byte)0x01,(byte)0xF8,
																																							new byte[]{(byte)0xB3,(byte)0x29,(byte)0x6C,(byte)0x91,(byte)0xF4,(byte)0x79,(byte)0x5B,(byte)0xD9,(byte)0x71,(byte)0x12,(byte)0x60,(byte)0x69,(byte)0x03,(byte)0x40,(byte)0x7B,(byte)0x6E,
																																								(byte)0xFF,(byte)0x3A,(byte)0xB3,(byte)0x92,(byte)0x46,(byte)0xE9,(byte)0x10,(byte)0x95,(byte)0xE5,(byte)0x1D,(byte)0x17,(byte)0x86,(byte)0x7D,(byte)0xA4,(byte)0xAD,(byte)0xE5,
																																								(byte)0x9A,(byte)0x48,(byte)0xBE,(byte)0x2F,(byte)0xE9,(byte)0xB5,(byte)0x27,(byte)0x10,(byte)0x28,(byte)0x3D,(byte)0x3D,(byte)0x32,(byte)0x26,(byte)0x0E,(byte)0x2C,(byte)0x7D,
																																								(byte)0x24,(byte)0x72,(byte)0x14,(byte)0xC5,(byte)0x7D,(byte)0x46,(byte)0xAA,(byte)0x64,(byte)0x65,(byte)0xE4,(byte)0x7E,(byte)0x0A,(byte)0x4B,(byte)0x3F,(byte)0xFA,(byte)0xAD,
																																								(byte)0x8A,(byte)0x7F,(byte)0x6A,(byte)0x19,(byte)0x07,(byte)0x55,(byte)0xBC,(byte)0xCF,(byte)0xE3,(byte)0xF3,(byte)0xFB,(byte)0x39,(byte)0x89,(byte)0xA9,(byte)0xF6,(byte)0xB1,
																																								(byte)0xC9,(byte)0xE1,(byte)0x84,(byte)0x5B,(byte)0xCC,(byte)0xCA,(byte)0xD6,(byte)0xF2,(byte)0x0B,(byte)0x1D,(byte)0xAC,(byte)0x60,(byte)0x33,(byte)0x60,(byte)0x02,(byte)0x34,
																																								(byte)0xE8,(byte)0x1D,(byte)0xAC,(byte)0x41,(byte)0x53,(byte)0x21,(byte)0x2B,(byte)0x0F,(byte)0x76,(byte)0x0C,(byte)0x23,(byte)0x09,(byte)0x91,(byte)0x92,(byte)0xAA,(byte)0x6C,
																																								(byte)0x4C,(byte)0x90,(byte)0x83,(byte)0xBE,(byte)0xFF,(byte)0xD9,(byte)0xA7,(byte)0x9D,(byte)0x2A,(byte)0x27,(byte)0xB0,(byte)0x8F,(byte)0xEC,(byte)0xC8,(byte)0xE5,(byte)0xD4,
																																								(byte)0x37,(byte)0xD6,(byte)0xC6,(byte)0x85,(byte)0x50,(byte)0xA8,(byte)0x39,(byte)0xB1,(byte)0x29,(byte)0x41,(byte)0x51,(byte)0xDA,(byte)0xBA,(byte)0x9D,(byte)0x9C,(byte)0xB2,
																																								(byte)0xF1,(byte)0x60,(byte)0xF6,(byte)0x0F,(byte)0x74,(byte)0x92,(byte)0x89,(byte)0xF5,(byte)0x00,(byte)0xC8,(byte)0xC7,(byte)0xF3,(byte)0x34,(byte)0xBD,(byte)0x20,(byte)0xEB,
																																								(byte)0xAC,(byte)0x4A,(byte)0xB1,(byte)0x09,(byte)0xCF,(byte)0x3C,(byte)0x18,(byte)0x2F,(byte)0x1B,(byte)0x78,(byte)0x1C,(byte)0x7C,(byte)0x09,(byte)0x7A,(byte)0x79,(byte)0x03,
																																								(byte)0x53,(byte)0x07,(byte)0x46,(byte)0xC4,(byte)0x49,(byte)0xB9,(byte)0x9E,(byte)0x39,(byte)0xE4,(byte)0xDB,(byte)0x64,(byte)0x93,(byte)0xDD,(byte)0x2A,(byte)0x02,(byte)0xE3,
																																								(byte)0x7C,(byte)0x62,(byte)0xAE,(byte)0x8B,(byte)0xC9,(byte)0xA7,(byte)0x47,(byte)0x0E,(byte)0xCC,(byte)0xCF,(byte)0x8D,(byte)0xC0,(byte)0x6A,(byte)0x18,(byte)0xC3,(byte)0x3C,
																																								(byte)0xD2,(byte)0x4B,(byte)0x30,(byte)0xD5,(byte)0x6F,(byte)0x25,(byte)0xD2,(byte)0x75,(byte)0x5C,(byte)0xE8,(byte)0x2A,(byte)0xA4,(byte)0xDE,(byte)0x4D,(byte)0x2E,(byte)0xAE,
																																								(byte)0xC0,(byte)0x77,(byte)0x50,(byte)0xA0,(byte)0x3D,(byte)0xB7,(byte)0x5E,(byte)0xBD,(byte)0x0D,(byte)0x8E,(byte)0xBC,(byte)0x9F,(byte)0x2A,(byte)0x1D,(byte)0x85,(byte)0xA0,
																																								(byte)0xD2,(byte)0x52,(byte)0xEF,(byte)0xF4,(byte)0x03,(byte)0x29,(byte)0xBE,(byte)0x05
																																							},
																																							(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																							new byte[]{(byte)0x00}
																																							),

																																							new EmvCapk(
																																									new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x04},(byte)0xFD,
																																									(byte)0x00,(byte)0x01,(byte)0x90,
																																									new byte[]{(byte)0xC9,(byte)0x48,(byte)0x5D,(byte)0xBE,(byte)0xB5,(byte)0xE4,(byte)0x04,(byte)0x15,(byte)0xD1,(byte)0xB3,(byte)0x97,(byte)0x52,(byte)0x4F,(byte)0x47,(byte)0x68,(byte)0x5F,
																																										(byte)0x30,(byte)0x6C,(byte)0xFD,(byte)0xC4,(byte)0x99,(byte)0xD4,(byte)0xE2,(byte)0xE7,(byte)0xD0,(byte)0xCB,(byte)0xAF,(byte)0x22,(byte)0x2C,(byte)0xFA,(byte)0x81,(byte)0x84,
																																										(byte)0xBD,(byte)0x11,(byte)0x1D,(byte)0xAE,(byte)0xED,(byte)0xC9,(byte)0xCC,(byte)0x6E,(byte)0xC8,(byte)0x54,(byte)0x0C,(byte)0x3F,(byte)0x72,(byte)0x71,(byte)0xEA,(byte)0x99,
																																										(byte)0x90,(byte)0x11,(byte)0x9C,(byte)0xC5,(byte)0xC4,(byte)0x31,(byte)0x80,(byte)0x50,(byte)0x1D,(byte)0x9F,(byte)0x45,(byte)0x25,(byte)0x2D,(byte)0x68,(byte)0x35,(byte)0x05,
																																										(byte)0x3F,(byte)0xAE,(byte)0x35,(byte)0x69,(byte)0x6A,(byte)0xE8,(byte)0xCD,(byte)0x67,(byte)0xA3,(byte)0x25,(byte)0x64,(byte)0x74,(byte)0x49,(byte)0xCF,(byte)0x5E,(byte)0x59,
																																										(byte)0x4D,(byte)0xA8,(byte)0xF6,(byte)0x27,(byte)0x20,(byte)0x9F,(byte)0x7F,(byte)0x03,(byte)0xAE,(byte)0x8D,(byte)0x6D,(byte)0xFC,(byte)0x0D,(byte)0xB3,(byte)0xE7,(byte)0x9E,
																																										(byte)0x28,(byte)0xE4,(byte)0x15,(byte)0xDF,(byte)0x29,(byte)0xA5,(byte)0xB5,(byte)0x7D,(byte)0x68,(byte)0x14,(byte)0x85,(byte)0x6C,(byte)0xC3,(byte)0x0A,(byte)0x96,(byte)0xDA,
																																										(byte)0x5B,(byte)0x88,(byte)0x90,(byte)0x36,(byte)0x3E,(byte)0x50,(byte)0x7F,(byte)0xCB,(byte)0x2E,(byte)0x28,(byte)0x3D,(byte)0xA1,(byte)0xEB,(byte)0xB5,(byte)0xF1,(byte)0x8E,
																																										(byte)0x8E,(byte)0x24,(byte)0x10,(byte)0x2B,(byte)0x7D,(byte)0x01,(byte)0x92,(byte)0xBB,(byte)0x8E,(byte)0x35,(byte)0xA4,(byte)0xF7,(byte)0xCD,(byte)0x05,(byte)0xA4,(byte)0x35
																																									},
																																									(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																									new byte[]{(byte)0x00}
																																									),

																																									new EmvCapk(
																																											new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x04},(byte)0xFB,
																																											(byte)0x00,(byte)0x01,(byte)0x90,
																																											new byte[]{(byte)0x9B,(byte)0x17,(byte)0x06,(byte)0x03,(byte)0xA4,(byte)0x89,(byte)0xC7,(byte)0x54,(byte)0x6C,(byte)0x45,(byte)0xDA,(byte)0x57,(byte)0xB8,(byte)0xFF,(byte)0xD1,(byte)0xDB,
																																												(byte)0x20,(byte)0x61,(byte)0x24,(byte)0x0F,(byte)0x0E,(byte)0x8C,(byte)0x6D,(byte)0x1F,(byte)0x9A,(byte)0xBD,(byte)0xC6,(byte)0xB2,(byte)0x65,(byte)0xAA,(byte)0x89,(byte)0x11,
																																												(byte)0x91,(byte)0x5C,(byte)0x1A,(byte)0x4E,(byte)0xAB,(byte)0xD8,(byte)0xD0,(byte)0xED,(byte)0x47,(byte)0x55,(byte)0xD1,(byte)0xB9,(byte)0x02,(byte)0xBA,(byte)0x06,(byte)0xFE,
																																												(byte)0x5A,(byte)0x64,(byte)0x5B,(byte)0x78,(byte)0x6C,(byte)0xD2,(byte)0x41,(byte)0x29,(byte)0x55,(byte)0x17,(byte)0xD4,(byte)0x4E,(byte)0xF1,(byte)0xA7,(byte)0xC2,(byte)0x5D,
																																												(byte)0x75,(byte)0xAF,(byte)0xE0,(byte)0xEB,(byte)0x28,(byte)0x06,(byte)0x6E,(byte)0x4D,(byte)0x69,(byte)0xFE,(byte)0xE7,(byte)0xAB,(byte)0xAF,(byte)0xDD,(byte)0x5E,(byte)0xEB,
																																												(byte)0x23,(byte)0x0F,(byte)0x14,(byte)0xE4,(byte)0x02,(byte)0xC9,(byte)0x84,(byte)0x08,(byte)0x25,(byte)0xFA,(byte)0x77,(byte)0xEA,(byte)0xD1,(byte)0x2B,(byte)0x5F,(byte)0x1C,
																																												(byte)0x54,(byte)0x94,(byte)0x70,(byte)0x1D,(byte)0xE1,(byte)0x89,(byte)0x7F,(byte)0x65,(byte)0xFE,(byte)0x6B,(byte)0xF1,(byte)0x06,(byte)0xD4,(byte)0x75,(byte)0x45,(byte)0xEB,
																																												(byte)0xF7,(byte)0x0C,(byte)0xE7,(byte)0xC1,(byte)0x58,(byte)0x06,(byte)0x8C,(byte)0x61,(byte)0xF0,(byte)0x77,(byte)0x35,(byte)0x34,(byte)0xDB,(byte)0x74,(byte)0x2A,(byte)0xB8,
																																												(byte)0x3C,(byte)0x28,(byte)0x03,(byte)0x8C,(byte)0x14,(byte)0x94,(byte)0xF1,(byte)0x59,(byte)0x05,(byte)0xD0,(byte)0xAD,(byte)0x17,(byte)0xCF,(byte)0x1B,(byte)0xD3,(byte)0x8D
																																											},
																																											(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																											new byte[]{(byte)0x00}
																																											),

																																											new EmvCapk(
																																													new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x04},(byte)0xFA,
																																													(byte)0x00,(byte)0x01,(byte)0xF8,
																																													new byte[]{(byte)0xA4,(byte)0x20,(byte)0x3E,(byte)0x0C,(byte)0x7B,(byte)0xEB,(byte)0x27,(byte)0x09,(byte)0x7B,(byte)0x63,(byte)0xC1,(byte)0x03,(byte)0xC1,(byte)0x9F,(byte)0xDC,(byte)0xDA,
																																														(byte)0x67,(byte)0x1A,(byte)0xEA,(byte)0x7F,(byte)0x81,(byte)0x30,(byte)0x65,(byte)0x75,(byte)0x6F,(byte)0x3B,(byte)0x9B,(byte)0x81,(byte)0x81,(byte)0x0C,(byte)0xBD,(byte)0x4B,
																																														(byte)0xC4,(byte)0xDE,(byte)0xC5,(byte)0x48,(byte)0xFB,(byte)0xF1,(byte)0xF3,(byte)0xCD,(byte)0xAE,(byte)0x51,(byte)0xF8,(byte)0x47,(byte)0x23,(byte)0x5C,(byte)0xBF,(byte)0x2C,
																																														(byte)0x8B,(byte)0xAD,(byte)0xD8,(byte)0xAC,(byte)0xA7,(byte)0xC9,(byte)0x3B,(byte)0xEA,(byte)0x3D,(byte)0x44,(byte)0xE8,(byte)0x0E,(byte)0xD6,(byte)0xA7,(byte)0xB7,(byte)0x0E,
																																														(byte)0x29,(byte)0x62,(byte)0x26,(byte)0x19,(byte)0xDB,(byte)0x42,(byte)0x0A,(byte)0xCC,(byte)0xCE,(byte)0x07,(byte)0xE1,(byte)0xDD,(byte)0x4E,(byte)0x6C,(byte)0x35,(byte)0x4F,
																																														(byte)0x35,(byte)0x9F,(byte)0xBD,(byte)0xC9,(byte)0xC5,(byte)0xB7,(byte)0x08,(byte)0x13,(byte)0x92,(byte)0x6F,(byte)0x77,(byte)0xD8,(byte)0x27,(byte)0xE5,(byte)0x2B,(byte)0x19,
																																														(byte)0xDA,(byte)0xF0,(byte)0x9B,(byte)0xFA,(byte)0xE5,(byte)0x27,(byte)0x44,(byte)0x38,(byte)0xBB,(byte)0x8F,(byte)0x61,(byte)0xD1,(byte)0x77,(byte)0x53,(byte)0xC9,(byte)0xEC,
																																														(byte)0x0A,(byte)0x8E,(byte)0xFA,(byte)0x3B,(byte)0x7E,(byte)0x46,(byte)0xF0,(byte)0x26,(byte)0x92,(byte)0x16,(byte)0x0D,(byte)0x26,(byte)0x53,(byte)0xCD,(byte)0xBC,(byte)0xC7,
																																														(byte)0x1B,(byte)0x7D,(byte)0x48,(byte)0xBD,(byte)0x37,(byte)0x96,(byte)0x83,(byte)0x16,(byte)0xEB,(byte)0x44,(byte)0x4F,(byte)0x65,(byte)0x04,(byte)0xB9,(byte)0x42,(byte)0x1B,
																																														(byte)0x7D,(byte)0xD3,(byte)0x03,(byte)0x5A,(byte)0x2C,(byte)0x11,(byte)0x7D,(byte)0x8B,(byte)0x1F,(byte)0x76,(byte)0xA8,(byte)0x97,(byte)0x54,(byte)0x40,(byte)0xDA,(byte)0x95,
																																														(byte)0x63,(byte)0x61,(byte)0x81,(byte)0x02,(byte)0x39,(byte)0x7B,(byte)0x88,(byte)0x1C,(byte)0xEF,(byte)0x8A,(byte)0xDA,(byte)0x76,(byte)0x89,(byte)0xED,(byte)0xFA,(byte)0xCE,
																																														(byte)0x32,(byte)0x48,(byte)0x2A,(byte)0x2D,(byte)0xFF,(byte)0xED,(byte)0x65,(byte)0x6E,(byte)0x7F,(byte)0x95,(byte)0x1D,(byte)0xB8,(byte)0x41,(byte)0xDA,(byte)0x78,(byte)0x36,
																																														(byte)0x8C,(byte)0x62,(byte)0x93,(byte)0xBF,(byte)0xC1,(byte)0x05,(byte)0x3A,(byte)0x86,(byte)0xA8,(byte)0x45,(byte)0xBF,(byte)0xA6,(byte)0x57,(byte)0x8E,(byte)0x4B,(byte)0x69,
																																														(byte)0xF1,(byte)0x00,(byte)0xB4,(byte)0x2B,(byte)0x55,(byte)0x8F,(byte)0xDE,(byte)0x1A,(byte)0xEC,(byte)0xEC,(byte)0x6D,(byte)0x25,(byte)0x07,(byte)0x41,(byte)0xBC,(byte)0x78,
																																														(byte)0x3A,(byte)0xA8,(byte)0xA6,(byte)0x8A,(byte)0x42,(byte)0x61,(byte)0xE7,(byte)0xBB,(byte)0x92,(byte)0x46,(byte)0xB1,(byte)0x05,(byte)0x87,(byte)0xA4,(byte)0x98,(byte)0xD6,
																																														(byte)0x8D,(byte)0xD9,(byte)0x55,(byte)0xCE,(byte)0x8B,(byte)0x2B,(byte)0x24,(byte)0x33
																																													},
																																													(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																													new byte[]{(byte)0x00}
																																													),

																																													new EmvCapk(
																																															new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x04},(byte)0xFF,
																																															(byte)0x00,(byte)0x01,(byte)0x90,
																																															new byte[]{(byte)0xF6,(byte)0x9D,(byte)0xBB,(byte)0x5E,(byte)0x15,(byte)0x98,(byte)0x3E,(byte)0xAE,(byte)0x3C,(byte)0xCF,(byte)0x31,(byte)0xCF,(byte)0x4E,(byte)0x47,(byte)0x09,(byte)0x8C,
																																																(byte)0x2F,(byte)0xC1,(byte)0x6F,(byte)0x97,(byte)0xA0,(byte)0xC7,(byte)0x10,(byte)0xF8,(byte)0x47,(byte)0x77,(byte)0xEF,(byte)0xA9,(byte)0x96,(byte)0x22,(byte)0xD8,(byte)0x65,
																																																(byte)0x02,(byte)0xB1,(byte)0x38,(byte)0x72,(byte)0x8A,(byte)0xB1,(byte)0x2E,(byte)0x34,(byte)0x81,(byte)0xA8,(byte)0x4D,(byte)0x20,(byte)0xE0,(byte)0x14,(byte)0xAD,(byte)0x2D,
																																																(byte)0x63,(byte)0x4D,(byte)0x28,(byte)0x36,(byte)0xF2,(byte)0x7F,(byte)0x29,(byte)0x49,(byte)0x24,(byte)0xB8,(byte)0x95,(byte)0xA8,(byte)0x7F,(byte)0x91,(byte)0xF8,(byte)0x1B,
																																																(byte)0x81,(byte)0x69,(byte)0xD4,(byte)0xDF,(byte)0xDA,(byte)0xD8,(byte)0xD7,(byte)0xCB,(byte)0xD7,(byte)0x41,(byte)0x80,(byte)0x4C,(byte)0xD6,(byte)0x1B,(byte)0x46,(byte)0x7C,
																																																(byte)0x7A,(byte)0x9A,(byte)0xCF,(byte)0xEC,(byte)0xEB,(byte)0x71,(byte)0x18,(byte)0x8C,(byte)0xAA,(byte)0x73,(byte)0xA9,(byte)0x07,(byte)0x54,(byte)0x76,(byte)0x99,(byte)0xD4,
																																																(byte)0x5C,(byte)0x9C,(byte)0x7D,(byte)0x20,(byte)0x98,(byte)0xAC,(byte)0x29,(byte)0x66,(byte)0x26,(byte)0x64,(byte)0x17,(byte)0xF6,(byte)0x65,(byte)0xA4,(byte)0x6B,(byte)0xDD,
																																																(byte)0x01,(byte)0x2C,(byte)0x09,(byte)0x7D,(byte)0xBD,(byte)0x33,(byte)0xD1,(byte)0xD1,(byte)0x1A,(byte)0xFF,(byte)0x6E,(byte)0xC8,(byte)0xA9,(byte)0xC0,(byte)0xAD,(byte)0x81,
																																																(byte)0x4A,(byte)0x65,(byte)0xB4,(byte)0x82,(byte)0x62,(byte)0xCA,(byte)0x01,(byte)0x16,(byte)0x36,(byte)0x07,(byte)0x9A,(byte)0x32,(byte)0x8C,(byte)0x1A,(byte)0xAE,(byte)0xB7
																																															},
																																															(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																															new byte[]{(byte)0x00}
																																															),

																																															new EmvCapk(
																																																	new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x65},(byte)0x02,
																																																	(byte)0x00,(byte)0x01,(byte)0x80,
																																																	new byte[]{(byte)0xBB,(byte)0x7F,(byte)0x51,(byte)0x98,(byte)0x3F,(byte)0xD8,(byte)0x70,(byte)0x7F,(byte)0xD6,(byte)0x22,(byte)0x7C,(byte)0x23,(byte)0xDE,(byte)0xF5,(byte)0xD5,(byte)0x37,
																																																		(byte)0x7A,(byte)0x5A,(byte)0x73,(byte)0x7C,(byte)0xEF,(byte)0x3C,(byte)0x52,(byte)0x52,(byte)0xE5,(byte)0x78,(byte)0xEF,(byte)0xE1,(byte)0x36,(byte)0xDF,(byte)0x87,(byte)0xB5,
																																																		(byte)0x04,(byte)0x73,(byte)0xF9,(byte)0x34,(byte)0x1F,(byte)0x16,(byte)0x40,(byte)0xC8,(byte)0xD2,(byte)0x58,(byte)0x03,(byte)0x4E,(byte)0x14,(byte)0xC1,(byte)0x69,(byte)0x93,
																																																		(byte)0xFC,(byte)0xE6,(byte)0xC6,(byte)0xB8,(byte)0xC3,(byte)0xCE,(byte)0xEB,(byte)0x65,(byte)0xFC,(byte)0x8F,(byte)0xBC,(byte)0xD8,(byte)0xEB,(byte)0x77,(byte)0xB3,(byte)0xB0,
																																																		(byte)0x5A,(byte)0xC7,(byte)0xC4,(byte)0xD0,(byte)0x9E,(byte)0x0F,(byte)0xA1,(byte)0xBA,(byte)0x2E,(byte)0xFE,(byte)0x87,(byte)0xD3,(byte)0x18,(byte)0x4D,(byte)0xB6,(byte)0x71,
																																																		(byte)0x8A,(byte)0xE4,(byte)0x1A,(byte)0x7C,(byte)0xAD,(byte)0x89,(byte)0xB8,(byte)0xDC,(byte)0xE0,(byte)0xFE,(byte)0x80,(byte)0xCE,(byte)0xB5,(byte)0x23,(byte)0xD5,(byte)0xD6,
																																																		(byte)0x47,(byte)0xF9,(byte)0xDB,(byte)0x58,(byte)0xA3,(byte)0x1D,(byte)0x2E,(byte)0x71,(byte)0xAC,(byte)0x67,(byte)0x7E,(byte)0x67,(byte)0xFA,(byte)0x6E,(byte)0x75,(byte)0x82,
																																																		(byte)0x07,(byte)0x36,(byte)0xC9,(byte)0x89,(byte)0x37,(byte)0x61,(byte)0xEE,(byte)0x4A,(byte)0xCD,(byte)0x11,(byte)0xF3,(byte)0x1D,(byte)0xBD,(byte)0xC3,(byte)0x49,(byte)0xEF
																																																	},
																																																	(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																																	new byte[]{(byte)0x00}
																																																	),

																																																	new EmvCapk(
																																																			new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x65},(byte)0x03,
																																																			(byte)0x00,(byte)0x01,(byte)0xF8,
																																																			new byte[]{(byte)0xC9,(byte)0xE6,(byte)0xC1,(byte)0xF3,(byte)0xC6,(byte)0x94,(byte)0x9A,(byte)0x8A,(byte)0x42,(byte)0xA9,(byte)0x1F,(byte)0x8D,(byte)0x02,(byte)0x24,(byte)0x13,(byte)0x2B,
																																																				(byte)0x28,(byte)0x65,(byte)0xE6,(byte)0xD9,(byte)0x53,(byte)0xA5,(byte)0xB5,(byte)0xA5,(byte)0x4C,(byte)0xFF,(byte)0xB0,(byte)0x41,(byte)0x24,(byte)0x39,(byte)0xD5,(byte)0x4A,
																																																				(byte)0xEB,(byte)0xA7,(byte)0x9E,(byte)0x9B,(byte)0x39,(byte)0x9A,(byte)0x6C,(byte)0x10,(byte)0x46,(byte)0x84,(byte)0xDF,(byte)0x3F,(byte)0xB7,(byte)0x27,(byte)0xC7,(byte)0xF5,
																																																				(byte)0x59,(byte)0x84,(byte)0xDB,(byte)0x7A,(byte)0x45,(byte)0x0E,(byte)0x6A,(byte)0xA9,(byte)0x17,(byte)0xE1,(byte)0x10,(byte)0xA7,(byte)0xF2,(byte)0x34,(byte)0x3A,(byte)0x00,
																																																				(byte)0x24,(byte)0xD2,(byte)0x78,(byte)0x5D,(byte)0x9E,(byte)0xBE,(byte)0x09,(byte)0xF6,(byte)0x01,(byte)0xD5,(byte)0x92,(byte)0x36,(byte)0x2F,(byte)0xDB,(byte)0x23,(byte)0x77,
																																																				(byte)0x00,(byte)0xB5,(byte)0x67,(byte)0xBA,(byte)0x14,(byte)0xBB,(byte)0xE2,(byte)0xA6,(byte)0xD3,(byte)0xD2,(byte)0x3C,(byte)0xF1,(byte)0x27,(byte)0x0B,(byte)0x3D,(byte)0xD8,
																																																				(byte)0x22,(byte)0xB5,(byte)0x49,(byte)0x65,(byte)0x49,(byte)0xBF,(byte)0x88,(byte)0x49,(byte)0x48,(byte)0xF5,(byte)0x5A,(byte)0x0D,(byte)0x30,(byte)0x83,(byte)0x48,(byte)0xC4,
																																																				(byte)0xB7,(byte)0x23,(byte)0xBA,(byte)0xFB,(byte)0x6A,(byte)0x7F,(byte)0x39,(byte)0x75,(byte)0xAC,(byte)0x39,(byte)0x7C,(byte)0xAD,(byte)0x3C,(byte)0x5D,(byte)0x0F,(byte)0xC2,
																																																				(byte)0xD1,(byte)0x78,(byte)0x71,(byte)0x6F,(byte)0x5E,(byte)0x8E,(byte)0x79,(byte)0xE7,(byte)0x5B,(byte)0xEB,(byte)0x1C,(byte)0x84,(byte)0xFA,(byte)0x20,(byte)0x2F,(byte)0x80,
																																																				(byte)0xE6,(byte)0x80,(byte)0x69,(byte)0xA9,(byte)0x84,(byte)0xE0,(byte)0x08,(byte)0x70,(byte)0x6B,(byte)0x30,(byte)0xC2,(byte)0x12,(byte)0x30,(byte)0x54,(byte)0x56,(byte)0x20,
																																																				(byte)0x15,(byte)0x40,(byte)0x78,(byte)0x79,(byte)0x25,(byte)0xE8,(byte)0x6A,(byte)0x8B,(byte)0x28,(byte)0xB1,(byte)0x29,(byte)0xA1,(byte)0x1A,(byte)0xF2,(byte)0x04,(byte)0xB3,
																																																				(byte)0x87,(byte)0xCB,(byte)0x6E,(byte)0xE4,(byte)0x3D,(byte)0xB5,(byte)0x3D,(byte)0x15,(byte)0xA4,(byte)0x6E,(byte)0x13,(byte)0x90,(byte)0x1B,(byte)0xEB,(byte)0xD5,(byte)0xCE,
																																																				(byte)0xCF,(byte)0x48,(byte)0x54,(byte)0x25,(byte)0x1D,(byte)0x9E,(byte)0x98,(byte)0x75,(byte)0xB1,(byte)0x6E,(byte)0x82,(byte)0xAD,(byte)0x1C,(byte)0x59,(byte)0x38,(byte)0xA9,
																																																				(byte)0x72,(byte)0x84,(byte)0x2C,(byte)0x8F,(byte)0x1A,(byte)0x42,(byte)0xEB,(byte)0xB5,(byte)0xAE,(byte)0x53,(byte)0x36,(byte)0xB0,(byte)0x4F,(byte)0xF3,(byte)0xDA,(byte)0x8B,
																																																				(byte)0x8D,(byte)0xFB,(byte)0xE6,(byte)0x06,(byte)0xFC,(byte)0xA8,(byte)0xB9,(byte)0x08,(byte)0x4E,(byte)0xE0,(byte)0x5B,(byte)0xF6,(byte)0x79,(byte)0x50,(byte)0xBA,(byte)0x89,
																																																				(byte)0x89,(byte)0x7C,(byte)0xD0,(byte)0x89,(byte)0xF9,(byte)0x24,(byte)0xDB,(byte)0xCD
																																																			},
																																																			(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																																			new byte[]{(byte)0x00}
																																																			),

																																																			new EmvCapk(
																																																					new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x03},(byte)0x50,
																																																					(byte)0x00,(byte)0x01,(byte)0x80,
																																																					new byte[]{(byte)0xD1,(byte)0x11,(byte)0x97,(byte)0x59,(byte)0x00,(byte)0x57,(byte)0xB8,(byte)0x41,(byte)0x96,(byte)0xC2,(byte)0xF4,(byte)0xD1,(byte)0x1A,(byte)0x8F,(byte)0x3C,(byte)0x05,
																																																						(byte)0x40,(byte)0x8F,(byte)0x42,(byte)0x2A,(byte)0x35,(byte)0xD7,(byte)0x02,(byte)0xF9,(byte)0x01,(byte)0x06,(byte)0xEA,(byte)0x5B,(byte)0x01,(byte)0x9B,(byte)0xB2,(byte)0x8A,
																																																						(byte)0xE6,(byte)0x07,(byte)0xAA,(byte)0x9C,(byte)0xDE,(byte)0xBC,(byte)0xD0,(byte)0xD8,(byte)0x1A,(byte)0x38,(byte)0xD4,(byte)0x8C,(byte)0x7E,(byte)0xBB,(byte)0x00,(byte)0x62,
																																																						(byte)0xD2,(byte)0x87,(byte)0x36,(byte)0x9E,(byte)0xC0,(byte)0xC4,(byte)0x21,(byte)0x24,(byte)0x24,(byte)0x6A,(byte)0xC3,(byte)0x0D,(byte)0x80,(byte)0xCD,(byte)0x60,(byte)0x2A,
																																																						(byte)0xB7,(byte)0x23,(byte)0x8D,(byte)0x51,(byte)0x08,(byte)0x4D,(byte)0xED,(byte)0x46,(byte)0x98,(byte)0x16,(byte)0x2C,(byte)0x59,(byte)0xD2,(byte)0x5E,(byte)0xAC,(byte)0x1E,
																																																						(byte)0x66,(byte)0x25,(byte)0x5B,(byte)0x4D,(byte)0xB2,(byte)0x35,(byte)0x25,(byte)0x26,(byte)0xEF,(byte)0x09,(byte)0x82,(byte)0xC3,(byte)0xB8,(byte)0xAD,(byte)0x3D,(byte)0x1C,
																																																						(byte)0xCE,(byte)0x85,(byte)0xB0,(byte)0x1D,(byte)0xB5,(byte)0x78,(byte)0x8E,(byte)0x75,(byte)0xE0,(byte)0x9F,(byte)0x44,(byte)0xBE,(byte)0x73,(byte)0x61,(byte)0x36,(byte)0x6D,
																																																						(byte)0xEF,(byte)0x9D,(byte)0x1E,(byte)0x13,(byte)0x17,(byte)0xB0,(byte)0x5E,(byte)0x5D,(byte)0x0F,(byte)0xF5,(byte)0x29,(byte)0x0F,(byte)0x88,(byte)0xA0,(byte)0xDB,(byte)0x47
																																																					},
																																																					(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																																					new byte[]{(byte)0x00}
																																																					),

																																																					new EmvCapk(
																																																							new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x03},(byte)0x51,
																																																							(byte)0x00,(byte)0x01,(byte)0x90,
																																																							new byte[]{(byte)0xDB,(byte)0x5F,(byte)0xA2,(byte)0x9D,(byte)0x1F,(byte)0xDA,(byte)0x8C,(byte)0x16,(byte)0x34,(byte)0xB0,(byte)0x4D,(byte)0xCC,(byte)0xFF,(byte)0x14,(byte)0x8A,(byte)0xBE,
																																																								(byte)0xE6,(byte)0x3C,(byte)0x77,(byte)0x20,(byte)0x35,(byte)0xC7,(byte)0x98,(byte)0x51,(byte)0xD3,(byte)0x51,(byte)0x21,(byte)0x07,(byte)0x58,(byte)0x6E,(byte)0x02,(byte)0xA9,
																																																								(byte)0x17,(byte)0xF7,(byte)0xC7,(byte)0xE8,(byte)0x85,(byte)0xE7,(byte)0xC4,(byte)0xA7,(byte)0xD5,(byte)0x29,(byte)0x71,(byte)0x0A,(byte)0x14,(byte)0x53,(byte)0x34,(byte)0xCE,
																																																								(byte)0x67,(byte)0xDC,(byte)0x41,(byte)0x2C,(byte)0xB1,(byte)0x59,(byte)0x7B,(byte)0x77,(byte)0xAA,(byte)0x25,(byte)0x43,(byte)0xB9,(byte)0x8D,(byte)0x19,(byte)0xCF,(byte)0x2C,
																																																								(byte)0xB8,(byte)0x0C,(byte)0x52,(byte)0x2B,(byte)0xDB,(byte)0xEA,(byte)0x0F,(byte)0x1B,(byte)0x11,(byte)0x3F,(byte)0xA2,(byte)0xC8,(byte)0x62,(byte)0x16,(byte)0xC8,(byte)0xC6,
																																																								(byte)0x10,(byte)0xA2,(byte)0xD5,(byte)0x8F,(byte)0x29,(byte)0xCF,(byte)0x33,(byte)0x55,(byte)0xCE,(byte)0xB1,(byte)0xBD,(byte)0x3E,(byte)0xF4,(byte)0x10,(byte)0xD1,(byte)0xED,
																																																								(byte)0xD1,(byte)0xF7,(byte)0xAE,(byte)0x0F,(byte)0x16,(byte)0x89,(byte)0x79,(byte)0x79,(byte)0xDE,(byte)0x28,(byte)0xC6,(byte)0xEF,(byte)0x29,(byte)0x3E,(byte)0x0A,(byte)0x19,
																																																								(byte)0x28,(byte)0x2B,(byte)0xD1,(byte)0xD7,(byte)0x93,(byte)0xF1,(byte)0x33,(byte)0x15,(byte)0x23,(byte)0xFC,(byte)0x71,(byte)0xA2,(byte)0x28,(byte)0x80,(byte)0x04,(byte)0x68,
																																																								(byte)0xC0,(byte)0x1A,(byte)0x36,(byte)0x53,(byte)0xD1,(byte)0x4C,(byte)0x6B,(byte)0x48,(byte)0x51,(byte)0xA5,(byte)0xC0,(byte)0x29,(byte)0x47,(byte)0x8E,(byte)0x75,(byte)0x7F
																																																							},
																																																							(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																																							new byte[]{(byte)0x00}
																																																							),

																																																							new EmvCapk(
																																																									new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x03},(byte)0x53,
																																																									(byte)0x00,(byte)0x01,(byte)0xF8,
																																																									new byte[]{(byte)0xBC,(byte)0xD8,(byte)0x37,(byte)0x21,(byte)0xBE,(byte)0x52,(byte)0xCC,(byte)0xCC,(byte)0x4B,(byte)0x64,(byte)0x57,(byte)0x32,(byte)0x1F,(byte)0x22,(byte)0xA7,(byte)0xDC,
																																																										(byte)0x76,(byte)0x9F,(byte)0x54,(byte)0xEB,(byte)0x80,(byte)0x25,(byte)0x91,(byte)0x3B,(byte)0xE8,(byte)0x04,(byte)0xD9,(byte)0xEA,(byte)0xBB,(byte)0xFA,(byte)0x19,(byte)0xB3,
																																																										(byte)0xD7,(byte)0xC5,(byte)0xD3,(byte)0xCA,(byte)0x65,(byte)0x8D,(byte)0x76,(byte)0x8C,(byte)0xAF,(byte)0x57,(byte)0x06,(byte)0x7E,(byte)0xEC,(byte)0x83,(byte)0xC7,(byte)0xE6,
																																																										(byte)0xE9,(byte)0xF8,(byte)0x1D,(byte)0x05,(byte)0x86,(byte)0x70,(byte)0x3E,(byte)0xD9,(byte)0xDD,(byte)0xDA,(byte)0xDD,(byte)0x20,(byte)0x67,(byte)0x5D,(byte)0x63,(byte)0x42,
																																																										(byte)0x49,(byte)0x80,(byte)0xB1,(byte)0x0E,(byte)0xB3,(byte)0x64,(byte)0xE8,(byte)0x1E,(byte)0xB3,(byte)0x7D,(byte)0xB4,(byte)0x0E,(byte)0xD1,(byte)0x00,(byte)0x34,(byte)0x4C,
																																																										(byte)0x92,(byte)0x88,(byte)0x86,(byte)0xFF,(byte)0x4C,(byte)0xCC,(byte)0x37,(byte)0x20,(byte)0x3E,(byte)0xE6,(byte)0x10,(byte)0x6D,(byte)0x5B,(byte)0x59,(byte)0xD1,(byte)0xAC,
																																																										(byte)0x10,(byte)0x2E,(byte)0x2C,(byte)0xD2,(byte)0xD7,(byte)0xAC,(byte)0x17,(byte)0xF4,(byte)0xD9,(byte)0x6C,(byte)0x39,(byte)0x8E,(byte)0x5F,(byte)0xD9,(byte)0x93,(byte)0xEC,
																																																										(byte)0xB4,(byte)0xFF,(byte)0xDF,(byte)0x79,(byte)0xB1,(byte)0x75,(byte)0x47,(byte)0xFF,(byte)0x9F,(byte)0xA2,(byte)0xAA,(byte)0x8E,(byte)0xEF,(byte)0xD6,(byte)0xCB,(byte)0xDA,
																																																										(byte)0x12,(byte)0x4C,(byte)0xBB,(byte)0x17,(byte)0xA0,(byte)0xF8,(byte)0x52,(byte)0x81,(byte)0x46,(byte)0x38,(byte)0x71,(byte)0x35,(byte)0xE2,(byte)0x26,(byte)0xB0,(byte)0x05,
																																																										(byte)0xA4,(byte)0x74,(byte)0xB9,(byte)0x06,(byte)0x2F,(byte)0xF2,(byte)0x64,(byte)0xD2,(byte)0xFF,(byte)0x8E,(byte)0xFA,(byte)0x36,(byte)0x81,(byte)0x4A,(byte)0xA2,(byte)0x95,
																																																										(byte)0x00,(byte)0x65,(byte)0xB1,(byte)0xB0,(byte)0x4C,(byte)0x0A,(byte)0x1A,(byte)0xE9,(byte)0xB2,(byte)0xF6,(byte)0x9D,(byte)0x4A,(byte)0x4A,(byte)0xA9,(byte)0x79,(byte)0xD6,
																																																										(byte)0xCE,(byte)0x95,(byte)0xFE,(byte)0xE9,(byte)0x48,(byte)0x5E,(byte)0xD0,(byte)0xA0,(byte)0x3A,(byte)0xEE,(byte)0x9B,(byte)0xD9,(byte)0x53,(byte)0xE8,(byte)0x1C,(byte)0xFD,
																																																										(byte)0x1E,(byte)0xF6,(byte)0xE8,(byte)0x14,(byte)0xDF,(byte)0xD3,(byte)0xC2,(byte)0xCE,(byte)0x37,(byte)0xAE,(byte)0xFA,(byte)0x38,(byte)0xC1,(byte)0xF9,(byte)0x87,(byte)0x73,
																																																										(byte)0x71,(byte)0xE9,(byte)0x1D,(byte)0x6A,(byte)0x5E,(byte)0xB5,(byte)0x9F,(byte)0xDE,(byte)0xDF,(byte)0x75,(byte)0xD3,(byte)0x32,(byte)0x5F,(byte)0xA3,(byte)0xCA,(byte)0x66,
																																																										(byte)0xCD,(byte)0xFB,(byte)0xA0,(byte)0xE5,(byte)0x71,(byte)0x46,(byte)0xCC,(byte)0x78,(byte)0x98,(byte)0x18,(byte)0xFF,(byte)0x06,(byte)0xBE,(byte)0x5F,(byte)0xCC,(byte)0x50,
																																																										(byte)0xAB,(byte)0xD3,(byte)0x62,(byte)0xAE,(byte)0x4B,(byte)0x80,(byte)0x99,(byte)0x6D
																																																									},
																																																									(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																																									new byte[]{(byte)0x00}
																																																									),

																																																									new EmvCapk(
																																																											new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x03},(byte)0x94,
																																																											(byte)0x00,(byte)0x01,(byte)0xF8,
																																																											new byte[]{(byte)0xD1,(byte)0xBE,(byte)0x39,(byte)0x61,(byte)0x5F,(byte)0x39,(byte)0x5A,(byte)0xC9,(byte)0x33,(byte)0x7E,(byte)0x33,(byte)0x07,(byte)0xAA,(byte)0x5A,(byte)0x7A,(byte)0xC3,
																																																												(byte)0x5E,(byte)0xAE,(byte)0x00,(byte)0x36,(byte)0xBF,(byte)0x20,(byte)0xB9,(byte)0x2F,(byte)0x9A,(byte)0x45,(byte)0xD1,(byte)0x90,(byte)0xB2,(byte)0xF4,(byte)0x61,(byte)0x6A,
																																																												(byte)0xBF,(byte)0x9D,(byte)0x34,(byte)0x0C,(byte)0xBF,(byte)0x5F,(byte)0xBB,(byte)0x3A,(byte)0x2B,(byte)0x94,(byte)0xBD,(byte)0x8F,(byte)0x2F,(byte)0x97,(byte)0x7C,(byte)0x0A,
																																																												(byte)0x10,(byte)0xB9,(byte)0x0E,(byte)0x59,(byte)0xD4,(byte)0x20,(byte)0x1A,(byte)0xA3,(byte)0x26,(byte)0x69,(byte)0xE8,(byte)0xCB,(byte)0xE7,(byte)0x53,(byte)0xF5,(byte)0x36,
																																																												(byte)0x11,(byte)0x9D,(byte)0xF4,(byte)0xFB,(byte)0x5E,(byte)0x63,(byte)0xCE,(byte)0xD8,(byte)0x7F,(byte)0x11,(byte)0x53,(byte)0xCE,(byte)0x91,(byte)0x4B,(byte)0x12,(byte)0x4F,
																																																												(byte)0x3E,(byte)0x6B,(byte)0x64,(byte)0x8C,(byte)0xD5,(byte)0xC9,(byte)0x76,(byte)0x55,(byte)0xF7,(byte)0xAB,(byte)0x4D,(byte)0xF6,(byte)0x26,(byte)0x07,(byte)0xC9,(byte)0x5D,
																																																												(byte)0xA5,(byte)0x05,(byte)0x17,(byte)0xAB,(byte)0x8B,(byte)0xE3,(byte)0x83,(byte)0x66,(byte)0x72,(byte)0xD1,(byte)0xC7,(byte)0x1B,(byte)0xCD,(byte)0xE9,(byte)0xBA,(byte)0x72,
																																																												(byte)0x93,(byte)0xFF,(byte)0x34,(byte)0x82,(byte)0xF1,(byte)0x24,(byte)0xF8,(byte)0x66,(byte)0x91,(byte)0x13,(byte)0x0A,(byte)0xB0,(byte)0x81,(byte)0x77,(byte)0xB0,(byte)0x2F,
																																																												(byte)0x45,(byte)0x9C,(byte)0x02,(byte)0x5A,(byte)0x1F,(byte)0x3D,(byte)0xFF,(byte)0xE0,(byte)0x88,(byte)0x4C,(byte)0xE7,(byte)0x81,(byte)0x22,(byte)0x54,(byte)0x2E,(byte)0xA1,
																																																												(byte)0xC8,(byte)0xEA,(byte)0x09,(byte)0x2B,(byte)0x55,(byte)0x2B,(byte)0x58,(byte)0x69,(byte)0x07,(byte)0xC8,(byte)0x3A,(byte)0xD6,(byte)0x5E,(byte)0x0C,(byte)0x6F,(byte)0x91,
																																																												(byte)0xA4,(byte)0x00,(byte)0xE4,(byte)0x85,(byte)0xE1,(byte)0x11,(byte)0x92,(byte)0xAA,(byte)0x4C,(byte)0x17,(byte)0x1C,(byte)0x5A,(byte)0x1E,(byte)0xF5,(byte)0x63,(byte)0x81,
																																																												(byte)0xF4,(byte)0xD0,(byte)0x91,(byte)0xCC,(byte)0x7E,(byte)0xF6,(byte)0xBD,(byte)0x86,(byte)0x04,(byte)0xCB,(byte)0xC4,(byte)0xC7,(byte)0x4D,(byte)0x5D,(byte)0x77,(byte)0xFF,
																																																												(byte)0xA0,(byte)0x7B,(byte)0x64,(byte)0x1D,(byte)0x53,(byte)0x99,(byte)0x8C,(byte)0xDB,(byte)0x5C,(byte)0x21,(byte)0xB7,(byte)0xBC,(byte)0x65,(byte)0xE0,(byte)0x82,(byte)0xA6,
																																																												(byte)0x51,(byte)0x3F,(byte)0x42,(byte)0x4A,(byte)0x4B,(byte)0x25,(byte)0x2E,(byte)0x0D,(byte)0x77,(byte)0xFA,(byte)0x40,(byte)0x56,(byte)0x98,(byte)0x6A,(byte)0x0A,(byte)0xB0,
																																																												(byte)0xCD,(byte)0xA6,(byte)0x15,(byte)0x5E,(byte)0xD9,(byte)0xA8,(byte)0x83,(byte)0xC6,(byte)0x9C,(byte)0xC2,(byte)0x99,(byte)0x2D,(byte)0x49,(byte)0xEC,(byte)0xBD,(byte)0x47,
																																																												(byte)0x97,(byte)0xDD,(byte)0x28,(byte)0x64,(byte)0xFF,(byte)0xC9,(byte)0x6B,(byte)0x8D
																																																											},
																																																											(byte)3,new byte[]{(byte)0x01,(byte)0x00,(byte)0x01},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																																											new byte[]{(byte)0x00}
																																																											),

																																																											new EmvCapk(
																																																													new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x03},(byte)0x96,
																																																													(byte)0x00,(byte)0x01,(byte)0x80,
																																																													new byte[]{(byte)0xB7,(byte)0x45,(byte)0x86,(byte)0xD1,(byte)0x9A,(byte)0x20,(byte)0x7B,(byte)0xE6,(byte)0x62,(byte)0x7C,(byte)0x5B,(byte)0x0A,(byte)0xAF,(byte)0xBC,(byte)0x44,(byte)0xA2,
																																																														(byte)0xEC,(byte)0xF5,(byte)0xA2,(byte)0x94,(byte)0x2D,(byte)0x3A,(byte)0x26,(byte)0xCE,(byte)0x19,(byte)0xC4,(byte)0xFF,(byte)0xAE,(byte)0xEE,(byte)0x92,(byte)0x05,(byte)0x21,
																																																														(byte)0x86,(byte)0x89,(byte)0x22,(byte)0xE8,(byte)0x93,(byte)0xE7,(byte)0x83,(byte)0x82,(byte)0x25,(byte)0xA3,(byte)0x94,(byte)0x7A,(byte)0x26,(byte)0x14,(byte)0x79,(byte)0x6F,
																																																														(byte)0xB2,(byte)0xC0,(byte)0x62,(byte)0x8C,(byte)0xE8,(byte)0xC1,(byte)0x1E,(byte)0x38,(byte)0x25,(byte)0xA5,(byte)0x6D,(byte)0x3B,(byte)0x1B,(byte)0xBA,(byte)0xEF,(byte)0x78,
																																																														(byte)0x3A,(byte)0x5C,(byte)0x6A,(byte)0x81,(byte)0xF3,(byte)0x6F,(byte)0x86,(byte)0x25,(byte)0x39,(byte)0x51,(byte)0x26,(byte)0xFA,(byte)0x98,(byte)0x3C,(byte)0x52,(byte)0x16,
																																																														(byte)0xD3,(byte)0x16,(byte)0x6D,(byte)0x48,(byte)0xAC,(byte)0xDE,(byte)0x8A,(byte)0x43,(byte)0x12,(byte)0x12,(byte)0xFF,(byte)0x76,(byte)0x3A,(byte)0x7F,(byte)0x79,(byte)0xD9,
																																																														(byte)0xED,(byte)0xB7,(byte)0xFE,(byte)0xD7,(byte)0x6B,(byte)0x48,(byte)0x5D,(byte)0xE4,(byte)0x5B,(byte)0xEB,(byte)0x82,(byte)0x9A,(byte)0x3D,(byte)0x47,(byte)0x30,(byte)0x84,
																																																														(byte)0x8A,(byte)0x36,(byte)0x6D,(byte)0x33,(byte)0x24,(byte)0xC3,(byte)0x02,(byte)0x70,(byte)0x32,(byte)0xFF,(byte)0x8D,(byte)0x16,(byte)0xA1,(byte)0xE4,(byte)0x4D,(byte)0x8D
																																																													},
																																																													(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																																													new byte[]{(byte)0x00}
																																																													),

																																																													new EmvCapk(
																																																															new byte[]{(byte)0xA0,(byte)0x00,(byte)0x00,(byte)0x00,(byte)0x03},(byte)0x97,
																																																															(byte)0x00,(byte)0x01,(byte)0x60,
																																																															new byte[]{(byte)0xAF,(byte)0x07,(byte)0x54,(byte)0xEA,(byte)0xED,(byte)0x97,(byte)0x70,(byte)0x43,(byte)0xAB,(byte)0x6F,(byte)0x41,(byte)0xD6,(byte)0x31,(byte)0x2A,(byte)0xB1,(byte)0xE2,
																																																																(byte)0x2A,(byte)0x68,(byte)0x09,(byte)0x17,(byte)0x5B,(byte)0xEB,(byte)0x28,(byte)0xE7,(byte)0x0D,(byte)0x5F,(byte)0x99,(byte)0xB2,(byte)0xDF,(byte)0x18,(byte)0xCA,(byte)0xE7,
																																																																(byte)0x35,(byte)0x19,(byte)0x34,(byte)0x1B,(byte)0xBB,(byte)0xD3,(byte)0x27,(byte)0xD0,(byte)0xB8,(byte)0xBE,(byte)0x9D,(byte)0x4D,(byte)0x0E,(byte)0x15,(byte)0xF0,(byte)0x7D,
																																																																(byte)0x36,(byte)0xEA,(byte)0x3E,(byte)0x3A,(byte)0x05,(byte)0xC8,(byte)0x92,(byte)0xF5,(byte)0xB1,(byte)0x9A,(byte)0x3E,(byte)0x9D,(byte)0x34,(byte)0x13,(byte)0xB0,(byte)0xD9,
																																																																(byte)0x7E,(byte)0x7A,(byte)0xD1,(byte)0x0A,(byte)0x5F,(byte)0x5D,(byte)0xE8,(byte)0xE3,(byte)0x88,(byte)0x60,(byte)0xC0,(byte)0xAD,(byte)0x00,(byte)0x4B,(byte)0x1E,(byte)0x06,
																																																																(byte)0xF4,(byte)0x04,(byte)0x0C,(byte)0x29,(byte)0x5A,(byte)0xCB,(byte)0x45,(byte)0x7A,(byte)0x78,(byte)0x85,(byte)0x51,(byte)0xB6,(byte)0x12,(byte)0x7C,(byte)0x0B,(byte)0x29
																																																															},
																																																															(byte)1,new byte[]{(byte)0x03},new byte[]{(byte)0x50,(byte)0x12,(byte)0x31},
																																																															new byte[]{(byte)0x00}																																																													)
			};
		}
		*/
}
