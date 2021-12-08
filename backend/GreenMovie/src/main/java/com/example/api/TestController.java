package com.example.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dtos.admin.MovieDTO;
import com.example.uitities.UploadFileUtils;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
	
	@Autowired
	private UploadFileUtils uploadFile;
	
	@GetMapping("/all")
	public String allAccess() {
		return "Public Content.";
	}
	
	@GetMapping("/user")
	@PreAuthorize("hasRole('USER') or hasRole('STAFF') or hasRole('ADMIN')")
	public String userAccess() {
		return "User or High";
	}

	@GetMapping("/staff")
	@PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
	public String staffAccess() {
		return "Staff or High";
	}
	
	@GetMapping("/admin")
	@PreAuthorize("hasRole('ADMIN')")
	public String adminAccess() {
		return "Admin";
	}
	
	@PostMapping("/upload")
	public String uploadImage(@ModelAttribute MovieDTO dto) {
		
	
		return dto.getPathThumbnail();
	}
	
	
	
}
