package com.vanstone.trans.tools;

import android.content.Context;
import android.text.Editable;
import android.text.InputType;
import android.text.TextWatcher;
import android.util.AttributeSet;
import android.widget.EditText;

public class AMTEditText extends EditText {
	private int maxLength;
	private int minLength;
	private Context context;

	public int getMaxLength() {
		return maxLength;
	}

	public void setMaxLength(int maxLength) {
		this.maxLength = maxLength;
	}

	public int getMinlength() {
		return minLength;
	}

	public void setMinlength(int minlength) {
		this.minLength = minlength;
	}

	public AMTEditText(Context context, AttributeSet attributeSet) {

		super(context,attributeSet);
		this.context=context;
		this.setHint("0.00");
		this.setInputType(InputType.TYPE_CLASS_NUMBER);
		this.addTextChangedListener(new TextWatcher() {    //�����������ݸı�ļ���
			int lBefore = 0;                               //�ı�ǰ����
			int lafter = 0;                                //�ı�󳤶�

			@Override
			public void onTextChanged(CharSequence s, int start, int before,
                                int count) {


			}

			@Override
			public void beforeTextChanged(CharSequence s, int start, int count,
                                    int after) {
				lBefore = s.length();
			}

			@Override
			public void afterTextChanged(Editable s) {
				if(maxLength>0&&maxLength<s.length()){          //������ȳ�����󳤶ȣ��ѳ�������ɾ��
					AMTEditText.this.setText(s.delete(maxLength, s.length()));

				}else if(minLength>s.length()){
				}else{
					lafter = s.length();
					if (s.length() == 1) {                       //�������1�������Ϊ0.0x
						AMTEditText.this.setText("0.0" + s);
					} else if (lafter == 3 && lBefore == 4) {    //�ı�ǰΪ����4,,�ı��Ϊ����3����1.23��Ϊ0.12
						String str = s.toString().trim();
						str = "0." + str.charAt(0) + str.charAt(2);
						AMTEditText.this.setText(str);
					} else if (lafter < lBefore && lafter >= 4) {//��Ϊɾ��ģʽ ��123.45��Ϊ12.34��
						if (s.charAt(1) != '.') {
							String str = s.toString().trim();
							str = str.substring(0, str.length() - 3) + "."
									+ str.charAt(str.length() - 3)
									+ str.charAt(str.length() - 1);
							AMTEditText.this.setText(str);
						}
					} else if (lafter > lBefore) {                //����ģʽ
						if (s.toString().trim().length() > 4) {   //���ȴ���4
							if (s.charAt(0) == '0') {             //��һλ��0 ��02.33��Ϊ 2.33
								String str = s.toString().trim();
								str=str.replace(".", "");
								str = str.charAt(1) + "." + str.substring(str.length()-2);
								AMTEditText.this.setText(str);

							} else {
								String str = s.toString().trim();
								str=str.replace(".", "");
								str = str.substring(0, str.length() - 2)
										+ "."
										+ str.substring(str.length() - 2,
												str.length());
								AMTEditText.this.setText(str);
							}

						}

					}
					AMTEditText.this.setSelection(AMTEditText.this.getText().toString()
							.trim().length());
				}

			}
		});
	}


}
