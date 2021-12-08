package com.example.services;

import com.example.api.response.admin.ReceiptResponse;
import com.example.dtos.admin.ReceiptDTO;

public interface IReceiptService {
	ReceiptResponse findAll();
	ReceiptResponse findOne(Long id);
	ReceiptResponse updateStatusReceipt(ReceiptDTO dto);
}
