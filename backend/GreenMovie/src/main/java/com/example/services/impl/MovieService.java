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

import com.example.api.response.admin.MovieResponse;
import com.example.constants.AppConstants;
import com.example.dtos.CategoryUserDTO;
import com.example.dtos.admin.MovieDTO;
import com.example.entity.CategoryEntity;
import com.example.entity.MovieEntity;
import com.example.repositories.ICategoryRepository;
import com.example.repositories.IMovieRepository;
import com.example.services.IMovieService;
import com.example.uitities.UploadFileUtils;

@Service
public class MovieService implements IMovieService{
	@Autowired
	private ModelMapper modelMapper;
	
	@Autowired
	private IMovieRepository movieRepository;
	
	@Autowired
	private ICategoryRepository categoryRepository;

	@Autowired
	private UploadFileUtils uploadFile;
	
	@Override
	public MovieResponse findAll() {
		List<MovieEntity> entities = movieRepository.findAll();
		List<MovieDTO> dtos = new ArrayList<>();
		for (MovieEntity e : entities) {
			MovieDTO dto = modelMapper.map(e, MovieDTO.class);
			dtos.add(dto);
		}
		return new MovieResponse(true, "", dtos);
	}

	@Override
	public MovieResponse findOne(Long id) {
		
		if (!movieRepository.existsById(id))
			return new MovieResponse(false, AppConstants.NOT_FOUND_DATA);
		MovieDTO dto = findOneById(id);
		return new MovieResponse(true, "", Arrays.asList(dto));
	}

	@Override
	public MovieResponse save(MovieDTO dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if(dto.getName().equals(""))
			return new MovieResponse(false,AppConstants.MISSING_DATA);
		MovieEntity entity;
		if(dto.getId() == null) {
			entity = new MovieEntity();
			entity = modelMapper.map(dto, MovieEntity.class);
			entity.setPathThumbnail(uploadFile.saveImage(dto.getBase64(), dto.getPathThumbnail()));
			entity.setCreatedDate(new Date());
			entity.setCreatedBy(authentication.getName());
			entity.setIsShowing(true);	
			entity.setIsDelete(false);
			entity.setCategories(getListCategory(dto.getCategoryId()));
			
		}else {
			entity = movieRepository.findById(dto.getId()).orElse(null);
			if (entity == null)
				return new MovieResponse(false, AppConstants.NOT_FOUND_DATA);
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setCreatedBy(entity.getCreatedBy());
			
			if(dto.getPathThumbnail().equals("")) {
				dto.setPathThumbnail(entity.getPathThumbnail());
			}
			
			if(!dto.getBase64().equals("")) {
				uploadFile.deleteImage(entity.getPathThumbnail());
				dto.setPathThumbnail(uploadFile.saveImage(dto.getBase64(), dto.getPathThumbnail()));
			}
			entity = modelMapper.map(dto, MovieEntity.class);
			entity.setUpdateDate(new Date());
			entity.setUpdateBy(authentication.getName());
			if(dto.getCategoryId() != null) {
				entity.setCategories(getListCategory(dto.getCategoryId()));
			}
		}
		MovieDTO newDto = findOneById(movieRepository.save(entity).getId());
		return new MovieResponse(true,
				(dto.getId() == null ? AppConstants.SAVE_SUCCESS : AppConstants.UPDATE_SUCCESS), Arrays.asList(newDto));
	}

	@Override
	public MovieResponse delete(Long[] ids) {
		MovieEntity entity;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		boolean isAllExist = true;
		StringBuilder message = new StringBuilder("Không tìm thấy id : ");
		for(Long id : ids) {
			if (!movieRepository.existsById(id)) {
				isAllExist = false;
				message.append(id.toString()+" ");
			}
		}
		if(!isAllExist)
			return new MovieResponse(false,message.toString());
		
		for (Long id : ids) {
			entity = movieRepository.findById(id).orElse(null);
			if (entity.getSessions().size() > 0) {
				entity.setIsDelete(true);
				entity.setUpdateDate(new Date());
				entity.setUpdateBy(authentication.getName());
				movieRepository.save(entity);
			}
			else {
				uploadFile.deleteImage(entity.getPathThumbnail());
				movieRepository.delete(entity);
			}
		}
		return new MovieResponse(true, AppConstants.DELETE_SUCCESS);
	}

	@Override
	public MovieDTO findOneById(Long id) {
		MovieEntity entity = movieRepository.findById(id).orElse(null);
		MovieDTO dto = modelMapper.map(entity, MovieDTO.class);
		//Get Category of movies
		List<CategoryUserDTO> categories = new ArrayList<>();
		for(CategoryEntity ce : entity.getCategories()) {
			categories.add(modelMapper.map(ce, CategoryUserDTO.class));
		}
		dto.setCategory(categories);
		return dto;
	}
	
	public List<CategoryEntity> getListCategory(Integer id){
		List<CategoryEntity> listCategory = new ArrayList<>();
		
		CategoryEntity category = categoryRepository.findById(Long.valueOf(id)).orElse(null);
		if(category!=null) {
			listCategory.add(category);
		}
		
		return listCategory;
	}

	@Override
	public MovieResponse updateCatgoryOrThumbnail(MovieDTO dto) {
		MovieEntity entity = movieRepository.findById(dto.getId()).orElse(null);
		if (entity == null)
			return new MovieResponse(false, AppConstants.NOT_FOUND_DATA);
		if(!dto.getBase64().equals("")) {
			uploadFile.deleteImage(entity.getPathThumbnail());
			dto.setPathThumbnail(uploadFile.saveImage(dto.getBase64(), dto.getPathThumbnail()));
		}
		entity = modelMapper.map(dto, MovieEntity.class);
		if(dto.getCategoryId() !=null) {
			entity.setCategories(getListCategory(dto.getCategoryId()));
		}
		MovieDTO newDto = findOneById(movieRepository.save(entity).getId());
		return new MovieResponse(true,AppConstants.UPDATE_SUCCESS, Arrays.asList(newDto));
	}
}
