package com.example.api.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.api.response.admin.ReceiptResponse;
import com.example.dtos.admin.ReceiptDTO;
import com.example.services.IReceiptService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController(value = "ReceiptOfAdmin")
@RequestMapping(value = "/api/admin/receipt")
public class ReceiptAPI {

	@Autowired
	private IReceiptService receiptService;

	@GetMapping
	public ResponseEntity<ReceiptResponse> findAll() {
		ReceiptResponse resp = receiptService.findAll();
		return new ResponseEntity<ReceiptResponse>(resp, HttpStatus.OK);
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<ReceiptResponse> findOne(@PathVariable(name = "id") long id) {
		ReceiptResponse resp = receiptService.findOne(id);
		return new ResponseEntity<ReceiptResponse>(resp, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<ReceiptResponse> saveCategory(@RequestBody ReceiptDTO dto) {
		ReceiptResponse resp = receiptService.updateStatusReceipt(dto);
		return new ResponseEntity<ReceiptResponse>(resp, HttpStatus.OK);
	}
}
