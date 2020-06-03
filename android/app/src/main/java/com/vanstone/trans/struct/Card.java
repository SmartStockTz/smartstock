package com.vanstone.trans.struct;

import com.vanstone.demo.constants.DefConstants;
import com.vanstone.demo.constants.GlobalConstants;
import com.vanstone.trans.api.Itwell;
import com.vanstone.trans.api.MathsApi;
import com.vanstone.utils.ByteUtils;

public class Card {

	public static int GetTrackData(byte[] Inbuf )
	{
		int iPos = 0, track1Len = 0, track2Len = 0, track3Len = 0;
		byte[] track1 = new byte[256]; 
		byte[] track2 = new byte[256]; 
		byte[] track3 = new byte[256];
		
		if((Inbuf[iPos]) != 0)					
		{ 
			ByteUtils.memcpy(track2, 0, Inbuf, iPos+1, Inbuf[iPos]);
			track2Len = Inbuf[iPos];
			iPos += Inbuf[iPos];
		}
		else
		{
			return 1;
		}
		
		iPos += 1;								
		if(Inbuf[iPos] != 0)				
		{ 
			ByteUtils.memcpy(track3, 0, Inbuf, iPos+1, Inbuf[iPos]);
			track3Len = Inbuf[iPos];
			iPos += Inbuf[iPos];
		}
		
		iPos += 1 ;		 						
		if(Inbuf[iPos] != 0)					
		{  
			ByteUtils.memcpy(track1, 0, Inbuf, iPos+1, Inbuf[iPos]);
			track1Len = Inbuf[iPos];
			iPos += Inbuf[iPos];
		}
		
		if( track1Len != 0 )
		{
			GetNameFromTrack1(track1, GlobalConstants.PosCom.stTrans.HoldCardName);
			ByteUtils.memcpy(GlobalConstants.PosCom.Track1, 0, track1, 0, track1Len);
			GlobalConstants.PosCom.Track1Len = track1Len;
		}	
		if(track2Len!= 0)
		{
			Itwell.FormBcdToAsc( GlobalConstants.PosCom.Track2, track2, track2Len * 2);
			GlobalConstants.PosCom.Track2Len = track2Len;
			
			if(GlobalConstants.PosCom.Track2[GlobalConstants.PosCom.Track2.length - 1] == 0x3f)
			{
				GlobalConstants.PosCom.Track2[GlobalConstants.PosCom.Track2.length - 1] = 0;
				GlobalConstants.PosCom.Track2Len--;
			}
		}		
		if(track3Len != 0) 
		{
			MathsApi.BcdToAsc_Api(GlobalConstants.PosCom.Track3, track3, track3Len*2);
			GlobalConstants.PosCom.Track3Len = track3Len;
			if(GlobalConstants.PosCom.Track3[GlobalConstants.PosCom.Track3.length - 1] == 0x3f)
			{
				GlobalConstants.PosCom.Track3[GlobalConstants.PosCom.Track3.length - 1] = 0;
				GlobalConstants.PosCom.Track3Len--;
			}
		}
		
		return 0;
	}

	public static int GetNameFromTrack1(byte[]Inbuf, byte[]Name)
	{
		boolean oneflag=false;
		int i, j, Nl;
        byte[]p=null;
		i = 0;
		j = 0;
		while(Inbuf.length>i)  
		{
			if( Inbuf[i] == 0x7e )//'~'
			{
				oneflag=true;
				p=new byte[Inbuf.length-i-1];
				System.arraycopy(Inbuf, i+1, p, 0, Inbuf.length-i-1);
				break;  	
			}
			i++;
		}

		if(!oneflag) 
			return -1;

		while(p.length>j) 
		{
			if( p[j] == 0x7e )
			{
				System.arraycopy(p, 0, Name, 0, j+1);
				break;
			}
			
			if(j >= 19)
			{
				System.arraycopy(p, 0, Name, 0, j+1);
				break;
			}
			j++;
		}

		Nl = Name.length;
		for(i = 0, j = 0; i < Nl ; )
		{
			if( Name[j] != '@' )
			{
				Name[i] = Name[j];
				i++;
			}
			else
				Name[j] = 0;
			j++;
		}  
		return 0;
	}

	public static int GetCardFromTrack(byte[] CardNo,byte[] track2,byte[] track3)
	{
		int i;
		 
		track2[37] = 0;
		track3[104] = 0; 
		
		if(track2.length != 0)				      
		{
			i = 0;
			while (track2[i] != '=')
			{
				if(i > 19)
				{
					return 12;
				}
				i++;
			}
			if( i < 13 || i > 19)
			{
				return DefConstants.E_ERR_SWIPE;
			}
			ByteUtils.memcpy(CardNo, 0, track2, 0, i);
//			CardNo[i] = 0;
		}
		else if(track3.length!= 0) 
		{
			i = 0;
			while(track3[i] != '=') {
				if(i > 21)
				{
					return DefConstants.E_ERR_SWIPE;
				}
				i++;
			}			    
			if( i < 15 || i > 21)
			{
				return DefConstants.E_ERR_SWIPE;	
			}
			ByteUtils.memcpy(CardNo, 0, track3, 2, i-2);
			CardNo[i-2]=0;
		}
		
		return 0;
	}
	
}
