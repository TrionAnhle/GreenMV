package com.example.api.response.admin;

import java.util.List;

import com.example.api.response.BaseResponse;
import com.example.dtos.admin.StaffDTO;

public class StaffResponse extends BaseResponse<StaffDTO>{

	public StaffResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public StaffResponse(boolean isOK, String message, List<StaffDTO> data) {
		super(isOK, message, data);
		// TODO Auto-generated constructor stub
	}

	public StaffResponse(boolean isOK, String message) {
		super(isOK, message);
		// TODO Auto-generated constructor stub
	}
	
}
