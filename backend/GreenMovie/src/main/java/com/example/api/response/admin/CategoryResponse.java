package com.example.api.response.admin;

import java.util.List;

import com.example.api.response.BaseResponse;
import com.example.dtos.admin.CategoryDTO;

public class CategoryResponse extends BaseResponse<CategoryDTO>{

	public CategoryResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CategoryResponse(boolean isOK, String message, List<CategoryDTO> data) {
		super(isOK, message, data);
		// TODO Auto-generated constructor stub
	}

	public CategoryResponse(boolean isOK, String message) {
		super(isOK, message);
		// TODO Auto-generated constructor stub
	}
	
}
