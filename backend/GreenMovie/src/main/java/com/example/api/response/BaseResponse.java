package com.example.api.response;

import java.util.List;

public abstract class BaseResponse<T> {
	private boolean isOK;
	private String message;
	private List<T> data;
	
	
	
	public BaseResponse() {
		super();
	}
		
	public BaseResponse(boolean isOK, String message) {
		super();
		this.isOK = isOK;
		this.message = message;
	}
	public BaseResponse(boolean isOK, String message, List<T> data) {
		super();
		this.isOK = isOK;
		this.message = message;
		this.data = data;
	}

	public boolean isOK() {
		return isOK;
	}
	public void setOK(boolean isOK) {
		this.isOK = isOK;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public List<T> getData() {
		return data;
	}
	public void setData(List<T> data) {
		this.data = data;
	}
	
	
	
}
