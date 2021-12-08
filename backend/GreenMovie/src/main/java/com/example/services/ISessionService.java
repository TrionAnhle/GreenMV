package com.example.services;

import com.example.api.response.admin.SessionResponse;
import com.example.dtos.admin.SessionDTO;

public interface ISessionService {
	SessionResponse findAll();
	SessionResponse findAllAvailable();
	SessionResponse findOne(Long id);
	SessionResponse save(SessionDTO dto);
	SessionResponse delete(Long[] ids);
}
