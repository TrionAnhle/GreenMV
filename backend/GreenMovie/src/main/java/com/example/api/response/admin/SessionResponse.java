package com.example.api.response.admin;

import java.util.List;

import com.example.api.response.BaseResponse;
import com.example.dtos.admin.SessionDTO;

public class SessionResponse extends BaseResponse<SessionDTO>{

	public SessionResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public SessionResponse(boolean isOK, String message, List<SessionDTO> data) {
		super(isOK, message, data);
		// TODO Auto-generated constructor stub
	}

	public SessionResponse(boolean isOK, String message) {
		super(isOK, message);
		// TODO Auto-generated constructor stub
	}
	
}
