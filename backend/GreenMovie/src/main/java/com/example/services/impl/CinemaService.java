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

import com.example.api.response.admin.CinemaResponse;
import com.example.constants.AppConstants;
import com.example.constants.ETypeCinema;
import com.example.dtos.admin.CinemaDTO;
import com.example.entity.CinemaEntity;
import com.example.repositories.ICinemaRepository;
import com.example.services.ICinemaService;

@Service
public class CinemaService implements ICinemaService{
	@Autowired
	private ModelMapper modelMapper;
	
	@Autowired
	private ICinemaRepository cinemaRepository;
	
	
	@Override
	public CinemaResponse findAll() {
		List<CinemaEntity> entities = cinemaRepository.findAll();
		List<CinemaDTO> dtos = new ArrayList<>();
		for(CinemaEntity e : entities) {
			CinemaDTO dto = modelMapper.map(e, CinemaDTO.class);
			dtos.add(dto);
		}
		return new CinemaResponse(true,"",dtos);
	}

	@Override
	public CinemaResponse findOne(Long id) {
		CinemaEntity entity = cinemaRepository.findById(id).orElse(null);
		if (entity == null)
			return new CinemaResponse(false, AppConstants.NOT_FOUND_DATA);
		CinemaDTO dto = modelMapper.map(entity, CinemaDTO.class);
		return new CinemaResponse(true, "", Arrays.asList(dto));
	}

	@Override
	public CinemaResponse save(CinemaDTO dto) {
		if(dto.getTypeOfCinema() == null )
			return new CinemaResponse(false, "Không được thiếu loại rạp phim");
		if(dto.getTypeOfCinema()  < 0 || dto.getTypeOfCinema() >2)
			return new CinemaResponse(false, "Loại rạp phim không hợp lệ");
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		dto.setType(ETypeCinema.getTypeOfCinema(dto.getTypeOfCinema()));
		dto.setPrice(ETypeCinema.getPriceByCinema(dto.getType()));
		CinemaEntity entity = new CinemaEntity();
		
		if(dto.getId() == null || dto.getId() < 0) {
			if(cinemaRepository.existByName(dto.getName()) !=null)
				return new CinemaResponse(false, "Tên rạp đã tồn tại");
			entity = modelMapper.map(dto, CinemaEntity.class);
			entity.setCreatedDate(new Date());
			entity.setCreatedBy(authentication.getName());
		}else {
			entity = cinemaRepository.findById(dto.getId()).orElse(null);
			if(entity == null)
				return new CinemaResponse(false, AppConstants.NOT_FOUND_DATA);
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setName(entity.getName());
			entity = modelMapper.map(dto, CinemaEntity.class);
			entity.setUpdateDate(new Date());
			entity.setUpdateBy(authentication.getName());
		}
		entity.setIsDelete(false);
		CinemaDTO newDto = modelMapper.map(cinemaRepository.save(entity), CinemaDTO.class);
		return new CinemaResponse(true,
				(dto.getId() == null ? AppConstants.SAVE_SUCCESS : AppConstants.UPDATE_SUCCESS), Arrays.asList(newDto));
	}

	@Override
	public CinemaResponse delete(Long[] ids) {
		CinemaEntity entity;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		boolean isAllExist = true;
		StringBuilder message = new StringBuilder("Không tìm thấy id : ");
		for(Long id : ids) {
			if (!cinemaRepository.existsById(id)) {
				isAllExist = false;
				message.append(id.toString()+" ");
			}
		}
		if(!isAllExist)
			return new CinemaResponse(false,message.toString());
		for (Long id : ids) {
			entity = cinemaRepository.findById(id).orElse(null);
			if (entity.getSessions().size() > 0) {
				entity.setIsDelete(true);
				entity.setUpdateDate(new Date());
				entity.setUpdateBy(authentication.getName());
				cinemaRepository.save(entity);
			}
			else
				cinemaRepository.delete(entity);
		}
		return new CinemaResponse(true, AppConstants.DELETE_SUCCESS);
	}

}
