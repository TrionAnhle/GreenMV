package com.example.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.config.UserDetailsImpl;
import com.example.entity.AccountEntity;
import com.example.repositories.IAccountRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{

	@Autowired
	IAccountRepository accountRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AccountEntity account = accountRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: "+username));
		return UserDetailsImpl.build(account);
	}

}
