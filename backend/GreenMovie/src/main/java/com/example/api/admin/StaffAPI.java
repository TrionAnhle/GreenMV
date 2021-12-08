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

import com.example.api.response.admin.StaffResponse;
import com.example.dtos.admin.StaffDTO;
import com.example.services.IStaffService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController(value = "StaffOfAdmin")
@RequestMapping(value = "/api/admin/staff")
public class StaffAPI {
	
	@Autowired
	private IStaffService staffService;
	
	@GetMapping
	public ResponseEntity<StaffResponse> findAll(){
		StaffResponse resp = staffService.findAll();
		return new ResponseEntity<StaffResponse>(resp, HttpStatus.OK);
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<StaffResponse> findOne(@PathVariable(name = "id") long id){
		StaffResponse resp = staffService.findOne(id);
		return new ResponseEntity<StaffResponse>(resp, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<StaffResponse> save(@RequestBody StaffDTO dto){
		StaffResponse resp = staffService.save(dto);
		return new ResponseEntity<StaffResponse>(resp, HttpStatus.OK);
	}
	
	@PostMapping(value = "/delete")
	public ResponseEntity<StaffResponse> delete(@RequestBody Long[] ids){
		StaffResponse resp = staffService.delete(ids);
		return new ResponseEntity<StaffResponse>(resp, HttpStatus.OK);
	}
}
