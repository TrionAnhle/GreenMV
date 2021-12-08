package com.example.services;

import com.example.api.response.admin.CategoryResponse;
import com.example.dtos.admin.CategoryDTO;

public interface ICategoryService{
	CategoryResponse findAll();
	CategoryResponse findOne(Long id);
	CategoryResponse save(CategoryDTO dto);
	CategoryResponse delete(Long[] ids);
}
