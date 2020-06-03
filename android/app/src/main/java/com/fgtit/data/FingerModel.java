package com.fgtit.data;

import android.graphics.Bitmap;

/**
 * Created by hx007 on 2017/5/10.
 */

public class FingerModel {

    private Bitmap fingerBitmap;
    private byte[] fingerCharacter;

    public FingerModel(byte[] fingerCharacter, Bitmap fingerBitmap){
        this.fingerCharacter = fingerCharacter;
        this.fingerBitmap = fingerBitmap;
    }

    public Bitmap getFingerBitmap() {
        return fingerBitmap;
    }

    public void setFingerBitmap(Bitmap fingerBitmap) {
        this.fingerBitmap = fingerBitmap;
    }

    public byte[] getFingerCharacter() {
        return fingerCharacter;
    }

    public void setFingerCharacter(byte[] fingerCharacter) {
        this.fingerCharacter = fingerCharacter;
    }
}
