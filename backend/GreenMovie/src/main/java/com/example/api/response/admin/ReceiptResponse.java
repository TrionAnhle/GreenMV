package com.example.api.response.admin;

import java.util.List;

import com.example.api.response.BaseResponse;
import com.example.dtos.admin.ReceiptDTO;

public class ReceiptResponse extends BaseResponse<ReceiptDTO>{

	public ReceiptResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ReceiptResponse(boolean isOK, String message, List<ReceiptDTO> data) {
		super(isOK, message, data);
		// TODO Auto-generated constructor stub
	}

	public ReceiptResponse(boolean isOK, String message) {
		super(isOK, message);
		// TODO Auto-generated constructor stub
	}

}
