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

import com.example.api.response.admin.SessionResponse;
import com.example.dtos.admin.SessionDTO;
import com.example.services.ISessionService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController(value = "SessionOfAdmin")
@RequestMapping(value = "/api/admin/session")
public class SessionAPI {
	@Autowired
	private ISessionService sessionService;
	
	@GetMapping
	public ResponseEntity<SessionResponse> findAll(){
		SessionResponse resp = sessionService.findAll();
		return new ResponseEntity<SessionResponse>(resp, HttpStatus.OK);
	}
	
	@GetMapping(value = "/available")
	public ResponseEntity<SessionResponse> findAllAvailabe(){
		SessionResponse resp = sessionService.findAllAvailable();
		return new ResponseEntity<SessionResponse>(resp, HttpStatus.OK);
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<SessionResponse> findOne(@PathVariable(name = "id") long id){
		SessionResponse resp = sessionService.findOne(id);
		return new ResponseEntity<SessionResponse>(resp, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<SessionResponse> save(@RequestBody SessionDTO dto){
		SessionResponse resp = sessionService.save(dto);
		return new ResponseEntity<SessionResponse>(resp, HttpStatus.OK);
	}
	
	@PostMapping(value = "/delete")
	public ResponseEntity<SessionResponse> delete(@RequestBody Long[] ids){
		SessionResponse resp = sessionService.delete(ids);
		return new ResponseEntity<SessionResponse>(resp, HttpStatus.OK);
	}
}
