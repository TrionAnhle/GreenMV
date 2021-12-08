package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.RoleEntity;

@Repository
public interface IRoleRepository extends JpaRepository<RoleEntity, Long>{
	
	@Query("SELECT r FROM RoleEntity r WHERE r.code = :code")
	RoleEntity findByCode(@Param("code")String code);
}
