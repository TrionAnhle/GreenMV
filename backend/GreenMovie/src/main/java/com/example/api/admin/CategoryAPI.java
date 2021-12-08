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

import com.example.api.response.admin.CategoryResponse;
import com.example.dtos.admin.CategoryDTO;
import com.example.services.ICategoryService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController(value = "CategoryOfAdmin")
@RequestMapping(value = "/api/admin/category")
public class CategoryAPI {
	@Autowired
	private ICategoryService categoryService;
	
	@GetMapping
	public ResponseEntity<CategoryResponse> findAll(){
		CategoryResponse resp = categoryService.findAll();
		return new ResponseEntity<CategoryResponse>(resp, HttpStatus.OK);
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<CategoryResponse> findOne(@PathVariable(name = "id") long id){
		CategoryResponse resp = categoryService.findOne(id);
		return new ResponseEntity<CategoryResponse>(resp, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<CategoryResponse> saveCategory(@RequestBody CategoryDTO dto){
		CategoryResponse resp = categoryService.save(dto);
		return new ResponseEntity<CategoryResponse>(resp, HttpStatus.OK);
	}
	
	@PostMapping(value = "/delete")
	public ResponseEntity<CategoryResponse> deleteCategory(@RequestBody Long[] ids){
		CategoryResponse resp = categoryService.delete(ids);
		return new ResponseEntity<CategoryResponse>(resp, HttpStatus.OK);
	}

}
