package com.example.services.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.api.response.admin.CategoryResponse;
import com.example.constants.AppConstants;
import com.example.dtos.admin.CategoryDTO;
import com.example.entity.CategoryEntity;
import com.example.repositories.ICategoryRepository;
import com.example.services.ICategoryService;
import com.example.uitities.StringUtities;

@Service
public class CategoryService implements ICategoryService {

	@Autowired
	private ICategoryRepository categoryRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public CategoryResponse findAll() {
		List<CategoryEntity> entities = categoryRepository.findAll();
		List<CategoryDTO> dtos = new ArrayList<>();
		for (CategoryEntity e : entities) {
			CategoryDTO dto = modelMapper.map(e, CategoryDTO.class);
			dtos.add(dto);
		}
		return new CategoryResponse(true, "", dtos);
	}

	@Override
	public CategoryResponse findOne(Long id) {
		CategoryEntity entity = categoryRepository.findById(id).orElse(null);
		if (entity == null)
			return new CategoryResponse(false, AppConstants.NOT_FOUND_DATA);
		CategoryDTO dto = modelMapper.map(entity, CategoryDTO.class);
		return new CategoryResponse(true, "", Arrays.asList(dto));
	}

	@Override
	@Transactional
	public CategoryResponse save(CategoryDTO dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		dto.setName(StringUtities.normalizeName(dto.getName()));
		dto.setCode(StringUtities.toCode(dto.getName()));
		CategoryEntity entity = categoryRepository.findOneByCode(dto.getCode());
		if(dto.getName().equals("") || dto.getName()==null)
			return new CategoryResponse(false, "Tên không được thiếu");
		if (entity != null)
			return new CategoryResponse(false, "Tên bị trùng");
		if (dto.getId() == null) {
			entity = new CategoryEntity();
			entity = modelMapper.map(dto, CategoryEntity.class);
			entity.setCreatedDate(new Date());
			entity.setCreatedBy(authentication.getName());
		} else {
			entity = categoryRepository.findById(dto.getId()).orElse(null);
			if (entity == null)
				return new CategoryResponse(false, AppConstants.NOT_FOUND_DATA);
			entity.setName(dto.getName());
			entity.setCode(dto.getCode());
			entity.setUpdateDate(new Date());
			entity.setUpdateBy(authentication.getName());
		}
		entity.setIsDelete(false);
		CategoryDTO newDto = modelMapper.map(categoryRepository.save(entity), CategoryDTO.class);
		return new CategoryResponse(true,
				(dto.getId() == null ? AppConstants.SAVE_SUCCESS : AppConstants.UPDATE_SUCCESS), Arrays.asList(newDto));
	}

	@Override
	@Transactional
	public CategoryResponse delete(Long[] ids){
		CategoryEntity entity;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		boolean isAllExist = true;
		StringBuilder message = new StringBuilder("Không tìm thấy id : ");
		for(Long id : ids) {
			if (!categoryRepository.existsById(id)) {
				isAllExist = false;
				message.append(id.toString()+" ");
			}
		}
		if(!isAllExist)
			return new CategoryResponse(false,message.toString());
		
		for (Long id : ids) {
			entity = categoryRepository.findById(id).orElse(null);
			if (entity.getMovies().size() > 0) {
				entity.setIsDelete(true);
				entity.setUpdateDate(new Date());
				entity.setUpdateBy(authentication.getName());
				categoryRepository.save(entity);
			}
			else
				categoryRepository.delete(entity);
		}
		return new CategoryResponse(true, AppConstants.DELETE_SUCCESS);
	}

}
