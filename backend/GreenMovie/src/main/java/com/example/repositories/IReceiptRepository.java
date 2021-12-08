package com.example.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.entity.ReceiptEntity;
import com.example.entity.SessionEntity;

@Repository
public interface IReceiptRepository extends JpaRepository<ReceiptEntity, Long>{
	@Query("from ReceiptEntity s order by s.createdDate desc")
	List<SessionEntity> findAllOrderByCreated();
}
