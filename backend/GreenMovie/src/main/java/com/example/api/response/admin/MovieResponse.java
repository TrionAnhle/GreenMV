package com.example.api.response.admin;

import java.util.List;

import com.example.api.response.BaseResponse;
import com.example.dtos.admin.MovieDTO;

public class MovieResponse extends BaseResponse<MovieDTO>{

	public MovieResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public MovieResponse(boolean isOK, String message, List<MovieDTO> data) {
		super(isOK, message, data);
		// TODO Auto-generated constructor stub
	}

	public MovieResponse(boolean isOK, String message) {
		super(isOK, message);
		// TODO Auto-generated constructor stub
	}
	
}
