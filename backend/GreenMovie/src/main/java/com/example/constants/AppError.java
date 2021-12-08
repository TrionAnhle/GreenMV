package com.example.constants;

public class AppError extends Error{

	private static final long serialVersionUID = 1L;

	public AppError() {
		super();
	}

	public AppError(String message) {
		super(message);
	}
}
