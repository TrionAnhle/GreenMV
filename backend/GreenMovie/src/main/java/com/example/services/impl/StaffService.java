package com.example.services.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.api.response.admin.StaffResponse;
import com.example.constants.AppConstants;
import com.example.dtos.admin.StaffDTO;
import com.example.entity.AccountEntity;
import com.example.entity.StaffEntity;
import com.example.repositories.IAccountRepository;
import com.example.repositories.IStaffRepository;
import com.example.services.IStaffService;

@Service
public class StaffService implements IStaffService{
	
	@Autowired
	private IStaffRepository staffRepository;
	
	@Autowired
	private IAccountRepository accountRepository;

	@Override
	public StaffResponse findAll() {
		List<StaffEntity> entities = staffRepository.findAll();
		List<StaffDTO> dtos = new ArrayList<>();
		for(StaffEntity e : entities) {
			
			dtos.add(toDTO(e));
		}
		return new StaffResponse(true,"",dtos);
	}

	@Override
	public StaffResponse findOne(Long id) {
		StaffEntity entity = staffRepository.findById(id).orElse(null);
		if (entity == null)
			return new StaffResponse(false, AppConstants.NOT_FOUND_DATA);
		StaffDTO dto = toDTO(entity);
		return new StaffResponse(true, "", Arrays.asList(dto));
	}

	@Override
	public StaffResponse save(StaffDTO dto) {
		StaffEntity entity = staffRepository.findById(dto.getId()).orElse(null);
		if(entity == null)
			return new StaffResponse(false, AppConstants.NOT_FOUND_DATA);
		entity.setFullName(dto.getFullName().trim().equals("") ? entity.getFullName() : dto.getFullName());
		entity.setSex(dto.getSex());
		entity.setPhone(dto.getPhone().trim().equals("") ? entity.getPhone() : dto.getPhone());
		entity.setAddress(dto.getAddress().trim().equals("") ? entity.getAddress() : dto.getAddress());
		staffRepository.save(entity);
		return new StaffResponse(true, AppConstants.UPDATE_SUCCESS);
	}

	@Override
	public StaffResponse delete(Long[] ids) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		boolean isAllExist = true;
		StringBuilder message = new StringBuilder("Không tìm thấy id : ");
		for(Long id : ids) {
			if (!accountRepository.existsById(id)) {
				isAllExist = false;
				message.append(id.toString()+" ");
			}
		}
		if(!isAllExist)
			return new StaffResponse(false,message.toString());
		AccountEntity account;	
		Boolean status = false;
		for (Long id : ids) {
			account = accountRepository.findById(id).orElse(null);
			if(account.getRole().getCode().trim().equalsIgnoreCase("ROLE_ADMIN")) {
				return new StaffResponse(false,"Bạn không được khoá tài khoản này");
			}
			account.setIsDelete(!account.getIsDelete());
			status = account.getIsDelete();
			account.setUpdateDate(new Date());
			account.setUpdateBy(authentication.getName());
			accountRepository.save(account);
		}
		return new StaffResponse(true, (status ? "Khoá tài khoản thành công" : "Mở tài khoản thành công"));
	}
	
	public StaffDTO toDTO(StaffEntity entity) {
		StaffDTO dto = new StaffDTO();
		
		dto.setId(entity.getId());
		dto.setCreatedDate(entity.getAccountS().getCreatedDate());
		dto.setCreatedBy(entity.getAccountS().getCreatedBy());
		dto.setUpdateDate(entity.getAccountS().getUpdateDate());
		dto.setUpdateBy(entity.getAccountS().getUpdateBy());
		
		dto.setFullName(entity.getFullName());
		dto.setSex(entity.getSex());
		dto.setPhone(entity.getPhone());
		dto.setAddress(entity.getAddress());
		dto.setUsername(entity.getAccountS().getUsername());
		dto.setRole(entity.getAccountS().getRole().getName());
		dto.setIsDelete(entity.getAccountS().getIsDelete());
		
		return dto;
	}

}
