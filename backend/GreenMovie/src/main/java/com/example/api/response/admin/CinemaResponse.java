package com.example.api.response.admin;

import java.util.List;

import com.example.api.response.BaseResponse;
import com.example.dtos.admin.CinemaDTO;

public class CinemaResponse extends BaseResponse<CinemaDTO>{

	public CinemaResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CinemaResponse(boolean isOK, String message, List<CinemaDTO> data) {
		super(isOK, message, data);
		// TODO Auto-generated constructor stub
	}

	public CinemaResponse(boolean isOK, String message) {
		super(isOK, message);
		// TODO Auto-generated constructor stub
	}
	
}
