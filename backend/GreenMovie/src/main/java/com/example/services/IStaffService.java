package com.example.services;

import com.example.api.response.admin.StaffResponse;
import com.example.dtos.admin.StaffDTO;

public interface IStaffService {
	StaffResponse findAll();
	StaffResponse findOne(Long id);
	StaffResponse save(StaffDTO dto);
	StaffResponse delete(Long[] ids);
}
