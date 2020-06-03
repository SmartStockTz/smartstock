package com.vanstone.trans.tools;

import android.app.Activity;
import android.app.Application;

import java.util.LinkedList;
import java.util.List;

public class MyApplication  extends Application {
	private List<Activity> list=new LinkedList<Activity>();
	private static MyApplication instance;
	private MyApplication(){

	}

	public static MyApplication getInstance(){
		if(null==instance){
			instance=new MyApplication();
		}
		return instance;
	}

	public void addActivity(Activity activity){
		list.add(activity);
	}

	public void exit(){
		for(Activity activity:list){
			activity.finish();
		}
		System.exit(0);
	}
}

























