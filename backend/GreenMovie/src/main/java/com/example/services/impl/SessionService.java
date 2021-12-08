package com.example.services.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.time.DateUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.api.response.admin.SessionResponse;
import com.example.constants.AppConstants;
import com.example.dtos.admin.CinemaDTO;
import com.example.dtos.admin.MovieDTO;
import com.example.dtos.admin.SessionDTO;
import com.example.entity.CinemaEntity;
import com.example.entity.MovieEntity;
import com.example.entity.SessionEntity;
import com.example.repositories.ICinemaRepository;
import com.example.repositories.IMovieRepository;
import com.example.repositories.ISessionRepository;
import com.example.services.ISessionService;


@Service
public class SessionService implements ISessionService{
	@Autowired
	private ModelMapper modelMapper;
	
	@Autowired
	private ISessionRepository sessionRepository;
	
	@Autowired
	private IMovieRepository movieRepository;
	
	@Autowired
	private ICinemaRepository cinemaRepository;
	
	@Override
	public SessionResponse findAll() {
		List<SessionEntity> entities = sessionRepository.findAll();
		List<SessionDTO> dtos = new ArrayList<>();
		for(SessionEntity e : entities) {
			SessionDTO dto = toDTO(e);
			dto.setNumberBooked(e.getTickets().size());
			dtos.add(dto);
		}
		return new SessionResponse(true,"",dtos);
	}

	@Override
	public SessionResponse findAllAvailable() {
		List<SessionEntity> entities = sessionRepository.findAllSessionByAtTime(new Date());
		List<SessionDTO> dtos = new ArrayList<>();
		for(SessionEntity e : entities) {
			SessionDTO dto = toDTO(e);
			dto.setNumberBooked(e.getTickets().size());
			dtos.add(dto);
		}
		return new SessionResponse(true,"",dtos);
	}


	@Override
	public SessionResponse findOne(Long id) {
		SessionEntity entity = sessionRepository.findById(id).orElse(null);
		if(entity == null) 
			return new SessionResponse(false, AppConstants.NOT_FOUND_DATA);
		SessionDTO dto = toDTO(entity);
		
		return new SessionResponse(true,"",Arrays.asList(dto));
		
	}

	@Override
	public SessionResponse save(SessionDTO dto) {
		SimpleDateFormat formatter=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			dto.setShowTime(formatter.parse(dto.getTime()));
		} catch (ParseException e) {
			return new SessionResponse(false, "Sai định dạng thời gian yyyy-MM-dd HH:mm:ss");
		}
		 
		if(dto.getCinemaId() == null || dto.getMovieId() == null || dto.getShowTime() == null)
			return new SessionResponse(false, AppConstants.MISSING_DATA);
		CinemaEntity cinemaEntity = cinemaRepository.findById(dto.getCinemaId()).orElse(null);
		MovieEntity movieEntity = movieRepository.findById(dto.getMovieId()).orElse(null);
		if(cinemaEntity == null || movieEntity == null)
			return new SessionResponse(false, AppConstants.NOT_FOUND_DATA);
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		SessionEntity entity;
		SessionEntity oldEntity = sessionRepository.findSessionIsShowing(cinemaEntity.getId(), dto.getShowTime());
		if(dto.getId() == null) {
			entity = new SessionEntity();
			if(oldEntity != null)
				return new SessionResponse(false,"Đã có suất chiếu trong thời gian này");
			entity.setCreatedDate(new Date());
			entity.setCreatedBy(authentication.getName());
		}else {
			entity = sessionRepository.findById(dto.getId()).orElse(null);
			if(oldEntity != null && oldEntity.getId() != dto.getId())
				return new SessionResponse(false,"Đã có suất chiếu trong thời gian này");
			entity.setUpdateDate(new Date());
			entity.setUpdateBy(authentication.getName());
		}
		entity.setCinema(cinemaEntity);
		entity.setMovie(movieEntity);
		entity.setShowTime(dto.getShowTime());
		entity.setFinishTime(DateUtils.addMinutes(dto.getShowTime(), movieEntity.getScreenTime()));
		
		SessionEntity newEntity = sessionRepository.findById(sessionRepository.save(entity).getId()).orElse(null);
		SessionDTO newDto = toDTO(newEntity);
		return new SessionResponse(true,
				(dto.getId() == null ? AppConstants.SAVE_SUCCESS : AppConstants.UPDATE_SUCCESS), Arrays.asList(newDto));
	}

	@Override
	public SessionResponse delete(Long[] ids) {
		SessionEntity entity;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		boolean isAllExist = true;
		StringBuilder message = new StringBuilder("Không tìm thấy id : ");
		for(Long id : ids) {
			if (!sessionRepository.existsById(id)) {
				isAllExist = false;
				message.append(id.toString()+" ");
			}
		}
		if(!isAllExist)
			return new SessionResponse(false,message.toString());
		
		for (Long id : ids) {
			entity = sessionRepository.findById(id).orElse(null);
			if (entity.getTickets().size() > 0) {
				entity.setIsDelete(true);
				entity.setUpdateDate(new Date());
				entity.setUpdateBy(authentication.getName());
				sessionRepository.save(entity);
			}
			else {
				
				sessionRepository.delete(entity);
			}
		}
		return new SessionResponse(true, AppConstants.DELETE_SUCCESS);
	}
	
	public SessionDTO toDTO(SessionEntity entity) {
		SessionDTO dto = new SessionDTO();
		dto.setId(entity.getId());
		dto.setCreatedBy(entity.getCreatedBy());
		dto.setCreatedDate(entity.getCreatedDate());
		dto.setUpdateBy(entity.getUpdateBy());
		dto.setUpdateDate(entity.getUpdateDate());
		
		CinemaDTO cinemaDto = modelMapper.map(entity.getCinema(), CinemaDTO.class);
		MovieDTO moiveDto = modelMapper.map(entity.getMovie(),MovieDTO.class);
		
		dto.setCinema(cinemaDto);
		dto.setMovie(moiveDto);
		dto.setShowTime(entity.getShowTime());
		dto.setFinishTime(entity.getFinishTime());
		
		return dto;
	}
}
