package com.example.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.AccountEntity;

@Repository
public interface IAccountRepository extends JpaRepository<AccountEntity, Long>{
	
	Optional<AccountEntity> findByUsername(String username);
	
	Boolean existsByUsername(String username);
	
}
