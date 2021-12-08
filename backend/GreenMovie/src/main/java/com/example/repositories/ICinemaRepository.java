package com.example.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.CinemaEntity;

@Repository
public interface ICinemaRepository extends JpaRepository<CinemaEntity, Long>{
	@Query("FROM CinemaEntity c WHERE c.isDelete = 0")
	List<CinemaEntity> findAll();
	
	@Query("FROM CinemaEntity c WHERE c.name = :name")
	CinemaEntity existByName(@Param("name")Integer name);
}
