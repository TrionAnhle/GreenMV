package com.example.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.CategoryEntity;

@Repository
public interface ICategoryRepository extends JpaRepository<CategoryEntity, Long>{
	
	@Query("SELECT c FROM CategoryEntity c WHERE c.code = :code")
	CategoryEntity findOneByCode(@Param("code")String code);
	
	@Query("FROM CategoryEntity c WHERE c.isDelete = 0")
	List<CategoryEntity> findAll();
}
